import User from '../models/user.model.js';
import { uploadFile } from '../s3.js';

export const registerUser = async (req, res) => {
  const { nombre, CURP, password, fechaDeNacimiento } = req.body;
  const files = req.files;

  try {
    const newUser = new User({
      nombre,
      CURP,
      password, // Idealmente, cifrar el password usando bcrypt
      fechaDeNacimiento,
    });

    // Si existen archivos, sube los archivos a S3 y guarda las URLs en el modelo User
    if (files && files.INE) {
      const ifeResult = await uploadFile(files.INE);
      newUser.INE = ifeResult.Location;
    }

    if (files && files.actaNacimiento) {
      const actaResult = await uploadFile(files.actaNacimiento);
      newUser.actaNacimiento = actaResult.Location;
    }

    if (files && files.comprobanteDomicilio) {
      const domicilioResult = await uploadFile(files.comprobanteDomicilio);
      newUser.comprobanteDomicilio = domicilioResult.Location;
    }

    if (files && files.comprobanteIngresos) {
      const ingresosResult = await uploadFile(files.comprobanteIngresos);
      newUser.comprobanteIngresos = ingresosResult.Location;
    }

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
