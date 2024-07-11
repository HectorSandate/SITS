import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URL } = process.env;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      w: "majority", // Write concern válido
      retryWrites: true,
    });
    console.log('Connected to DB');
  } catch (error) {
    console.error('Error connecting to DB:', error);
    process.exit(1); // Cierra el proceso si no se puede conectar
  }
};
