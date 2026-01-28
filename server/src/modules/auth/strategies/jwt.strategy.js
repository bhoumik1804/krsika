import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import config from '../../../config/index.js'
import { User } from '../../../shared/models/index.js'

/**
 * JWT Access Token Strategy
 * Used for authenticating API requests with short-lived access tokens
 */
export const accessTokenStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.accessToken.secret,
        algorithms: [config.jwt.accessToken.algorithm],
        issuer: config.jwt.accessToken.issuer,
        audience: config.jwt.accessToken.audience,
    },
    async (payload, done) => {
        try {
            const user = await User.findById(payload.sub)
                .populate('millId', 'name code status')
                .lean()

            if (!user || !user.isActive) {
                return done(null, false, {
                    message: 'User not found or inactive',
                })
            }

            // Check if mill is active (for non-super-admin users)
            if (user.millId && user.millId.status !== 'ACTIVE') {
                return done(null, false, { message: 'Mill is not active' })
            }

            // Attach user to request
            return done(null, user)
        } catch (error) {
            return done(error, false)
        }
    }
)

export default accessTokenStrategy
