import env from './env.js'

export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: env.ACCESS_TOKEN_EXPIRY, // Uses env config (milliseconds)
}

export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: env.REFRESH_TOKEN_EXPIRY, // Uses env config (milliseconds)
}

export const clearCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
}
