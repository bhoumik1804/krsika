import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import env from '../config/env.js'
import User from '../models/User.js'
import logger from '../utils/logger.js'
// Import your existing handlers
import { adminHandlers } from './adminHandlers.js'
import { millHandlers } from './millHandlers.js'
import { staffHandlers } from './staffHandlers.js'

/**
 * Helper to wrap Express middleware for Socket.IO
 * This allows cookie-parser to run on the socket handshake request
 */
const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next)

export const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: env.CLIENT_URL,
            credentials: true, // Required to accept cookies
        },
    })

    // 1. Apply cookie-parser as a wrapper
    // If you use signed cookies in Express, pass the secret: cookieParser(env.COOKIE_SECRET)
    io.use(wrap(cookieParser()))

    // 2. Authentication Middleware
    io.use(async (socket, next) => {
        try {
            // After wrap(cookieParser()), cookies are available on socket.request.cookies
            const token = socket.request.cookies.access_token

            if (!token) {
                return next(
                    new Error('Authentication required: No token found')
                )
            }

            const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET)

            // Database lookup
            const user = await User.findById(decoded.userId)
                .populate('millId')
                .select('-password')

            if (!user || !user.isActive) {
                return next(new Error('User not found or account inactive'))
            }

            // Attach user to socket for use in handlers
            socket.user = user
            next()
        } catch (error) {
            logger.error('Socket Auth Error:', error.message)
            next(new Error('Invalid or expired token'))
        }
    })

    // 3. Connection & Event Handlers
    io.on('connection', (socket) => {
        const { _id, email, role, millId } = socket.user

        logger.info(`User Connected: ${email} (Role: ${role})`)

        // Join logic-specific rooms
        if (role === 'super-admin') {
            socket.join('super-admin')
            adminHandlers(io, socket)
        } else if (role === 'mill-admin' && millId) {
            socket.join(`mill-admin:${millId}`)
            millHandlers(io, socket)
        } else if (role === 'mill-staff' && millId) {
            socket.join(`mill-staff:${millId}`)
            staffHandlers(io, socket)
        }

        socket.on('disconnect', () => {
            logger.info(`User Disconnected: ${email}`)
        })
    })

    return io
}
