import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { accessTokenStrategy } from '../modules/auth/strategies/jwt.strategy.js'
import { localStrategy } from '../modules/auth/strategies/local.strategy.js'
import logger from '../shared/utils/logger.js'
import config from './index.js'

/**
 * Configure Passport strategies
 */
export const configurePassport = () => {
    // JWT Access Token Strategy
    passport.use('jwt-access', accessTokenStrategy)

    // Local Strategy (Email/Password)
    passport.use('local', localStrategy)

    // Google OAuth Strategy
    if (config.google.clientId && config.google.clientSecret) {
        passport.use(
            'google',
            new GoogleStrategy(
                {
                    clientID: config.google.clientId,
                    clientSecret: config.google.clientSecret,
                    callbackURL: config.google.redirectUri,
                    scope: ['profile', 'email'],
                },
                async (accessToken, refreshToken, profile, done) => {
                    try {
                        // Return the Google profile to the callback
                        // The actual user creation/lookup will be handled in the auth controller
                        return done(null, {
                            googleId: profile.id,
                            email: profile.emails?.[0]?.value,
                            name: profile.displayName,
                            avatar: profile.photos?.[0]?.value,
                        })
                    } catch (error) {
                        return done(error, null)
                    }
                }
            )
        )
        logger.info('Google OAuth strategy configured')
    } else {
        logger.warn(
            'Google OAuth credentials not provided, skipping Google strategy'
        )
    }

    logger.info('Passport strategies configured')
}

export default configurePassport
