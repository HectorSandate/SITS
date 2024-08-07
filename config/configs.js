import dotenv from "dotenv";

// Configura dotenv para cargar las variables del archivo .env
dotenv.config();

// Obtén la URL de TODO  desde las variables de entorno
export const AWS_BUCKET_SITS = process.env.AWS_BUCKET_SITS;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
export const AWS_PUCLIC_KEY = process.env.AWS_PUCLIC_KEY;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const MONGO_URL = process.env.MONGO_URL;

