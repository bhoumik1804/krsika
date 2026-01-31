import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../models/User.js'
import logger from '../utils/logger.js'
import env from './env.js'

// Cookie extractor for JWT
const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['access_token']
    }
    return token
}

// Local Strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email }).select('+password')

                if (!user) {
                    return done(null, false, { message: 'Invalid credentials' })
                }

                if (!user.isActive) {
                    return done(null, false, { message: 'Account is inactive' })
                }

                const isPasswordValid = await user.comparePassword(password)

                if (!isPasswordValid) {
                    return done(null, false, { message: 'Invalid credentials' })
                }

                return done(null, user)
            } catch (error) {
                logger.error('Local strategy error:', error)
                return done(error)
            }
        }
    )
)

// JWT Strategy
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: env.ACCESS_TOKEN_SECRET,
        },
        async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).populate(
                    'millId'
                )

                if (!user) {
                    return done(null, false)
                }

                if (!user.isActive) {
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                logger.error('JWT strategy error:', error)
                return done(error, false)
            }
        }
    )
)

// Google OAuth Strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
                callbackURL: env.GOOGLE_REDIRECT_URI,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const {
                        id: googleId,
                        emails,
                        displayName,
                        photos,
                    } = profile
                    const email = emails[0].value
                    const avatar = photos && photos[0] ? photos[0].value : null

                    // Check if user exists with Google ID
                    let user = await User.findOne({ googleId })

                    // If not found by Google ID, check by email
                    if (!user) {
                        user = await User.findOne({ email })

                        // If user exists with email but no Google ID, link the account
                        if (user) {
                            user.googleId = googleId
                            if (!user.avatar && avatar) {
                                user.avatar = avatar
                            }
                            await user.save()

                            logger.info('Google account linked', {
                                userId: user._id,
                                email,
                            })
                        }
                    }

                    // If user still doesn't exist, create a new one
                    if (!user) {
                        user = await User.create({
                            email,
                            name: displayName,
                            googleId,
                            avatar,
                            isActive: true,
                        })

                        logger.info('New Google user created', {
                            userId: user._id,
                            email,
                        })
                    } else {
                        user.lastLogin = new Date()
                        await user.save()
                    }

                    return done(null, user)
                } catch (error) {
                    logger.error('Google strategy error:', error)
                    return done(error, false)
                }
            }
        )
    )
}

export default passport
