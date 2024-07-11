import User from '../models/user.model.js';
import { uploadFile } from '../s3';

export const registerUser = async (req, res) => {
  const { nombre, CURP, password, fechaDeNacimiento } = req.body;
  const files = req.files;

  try {
    const newUser = new User({
      nombre,
      CURP,
      password, // Ideally, you'll hash the password using bcrypt
      fechaDeNacimiento,
    });

    // Upload files to S3 and store URLs in User model
    if (files.IFE) {
      const ifeResult = await uploadFile(files.IFE);
      newUser.IFE = ifeResult.Location;
    }

    if (files.actaNacimiento) {
      const actaResult = await uploadFile(files.actaNacimiento);
      newUser.actaNacimiento = actaResult.Location;
    }

    if (files.comprobanteDomicilio) {
      const domicilioResult = await uploadFile(files.comprobanteDomicilio);
      newUser.comprobanteDomicilio = domicilioResult.Location;
    }

    if (files.comprobanteIngresos) {
      const ingresosResult = await uploadFile(files.comprobanteIngresos);
      newUser.comprobanteIngresos = ingresosResult.Location;
    }

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
