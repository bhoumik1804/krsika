import passport from 'passport'

export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }

        if (!user) {
            const error = new Error('Authentication required')
            error.statusCode = 401
            error.code = 'UNAUTHORIZED'
            return next(error)
        }

        req.user = user
        next()
    })(req, res, next)
}

export const optionalAuthenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            return next(err)
        }

        if (user) {
            req.user = user
        }

        next()
    })(req, res, next)
}
