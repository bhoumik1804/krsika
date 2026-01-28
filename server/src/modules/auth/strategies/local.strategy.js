import { Strategy as LocalStrategy } from 'passport-local'
import { User } from '../../../shared/models/index.js'
import logger from '../../../shared/utils/logger.js'

/**
 * Local Strategy (Email/Password)
 * Used for login with email and password
 */
export const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email: email.toLowerCase() })
                .select('+password') // Include password field
                .populate('millId')

            if (!user) {
                logger.warn(`Login attempt failed for email: ${email}`)
                return done(null, false, {
                    message: 'Invalid email or password',
                })
            }

            // Check if account is locked
            if (user.isLocked) {
                logger.warn(`Login attempt on locked account: ${email}`)
                return done(null, false, {
                    message:
                        'Account is temporarily locked. Please try again later.',
                })
            }

            if (!user.isActive) {
                logger.warn(`Login attempt on inactive account: ${email}`)
                return done(null, false, { message: 'Account is deactivated' })
            }

            const isMatch = await user.comparePassword(password)

            if (!isMatch) {
                // Increment failed login attempts
                await user.incLoginAttempts()
                logger.warn(`Invalid password for email: ${email}`)
                return done(null, false, {
                    message: 'Invalid email or password',
                })
            }

            // Reset login attempts on successful login
            if (user.loginAttempts > 0) {
                await user.resetLoginAttempts()
            }

            // Update last login
            user.lastLoginAt = new Date()
            await user.save()

            // Log successful login
            logger.info(`User logged in: ${user.email}`)

            // Remove password from user object before returning
            const userObject = user.toObject()
            delete userObject.password

            return done(null, userObject)
        } catch (error) {
            logger.error('Error in local strategy:', error)
            return done(error, false)
        }
    }
)

export default localStrategy
