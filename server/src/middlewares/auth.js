import passport from 'passport';
import ApiError from '../utils/ApiError.js';

export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return next(ApiError.unauthorized('Authentication required', 'UNAUTHORIZED'));
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

export const optionalAuthenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    
    if (user) {
      req.user = user;
    }
    
    next();
  })(req, res, next);
};
