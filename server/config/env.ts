import dotenv from 'dotenv';

dotenv.config();
export const PORT =Number( process.env.PORT || 3000)
export const JWT_SECRET = process.env.JWT_SECRET || 'cle_secret_a_changer_en_production'
export const JWT_EXPIRY = '7d'
export const COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 jours en millisecondes
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/addressbook';

