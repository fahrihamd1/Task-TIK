export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

// 15 minutes in seconds
export const JWT_EXPIRATION = 15 * 60;

// 7 days in seconds
export const JWT_REFRESH_EXPIRATION = 7 * 24 * 60 * 60;
