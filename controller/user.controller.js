import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { uploadFile } from '../s3.js';

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
  const { nombre, CURP, password, numero, fechaDeNacimiento } = req.body;
  const files = req.files;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ CURP });
    
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      CURP,
      password: hashedPassword,
      numero,
      fechaDeNacimiento,
    });

    // Si existen archivos, sube los archivos a S3 y guarda las URLs en el modelo User
    if (files && files.INE) {
      const ifeResult = await uploadFile(files.INE, CURP);
      newUser.INE = ifeResult.Location;
    }

    if (files && files.actaNacimiento) {
      const actaResult = await uploadFile(files.actaNacimiento, CURP);
      newUser.actaNacimiento = actaResult.Location;
    }

    if (files && files.comprobanteDomicilio) {
      const domicilioResult = await uploadFile(files.comprobanteDomicilio, CURP);
      newUser.comprobanteDomicilio = domicilioResult.Location;
    }

    if (files && files.comprobanteIngresos) {
      const ingresosResult = await uploadFile(files.comprobanteIngresos, CURP);
      newUser.comprobanteIngresos = ingresosResult.Location;
    }

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  console.log('Datos recibidos:', req.body); // Muestra los datos recibidos en la solicitud

  const { CURP, password } = req.body;

  try {
    const user = await User.findOne({ CURP });

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('Usuario encontrado:', user);

    // Comprobamos la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('¿Contraseña es válida?', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    if (!user.isActive) {
      console.log('Usuario inactivo');
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    // Si todo está bien, retornamos los datos del usuario
    console.log('Inicio de sesión exitoso');
    res.status(200).json({
      id: user._id,
      nombre: user.nombre,
      numero: user.numero,
      status: user.status, // Asegúrate de incluir el campo status en la respuesta
      CURP: user.CURP,

      // Otros datos que podrías necesitar
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Traer todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    // Especificamos los campos que queremos obtener
    const users = await User.find({}, 'CURP nombre isActive');

    // Responder con los usuarios encontrados
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: error.message });
  }
};
// Traer un usuario en específico
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activar/Desactivar un usuario
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};