import { Router } from "express";
import {registerUser} from '../controller/user.controller.js'
import {
    agregarBeneficio,
    obtenerBeneficios,
    actualizarBeneficio,
    eliminarBeneficio,
  } from "../controller/beneficio.controller.js"; // Asegúrate de que el path sea correcto

const router = Router();

router.post('/register', registerUser);


// Ruta para agregar un beneficio
router.post('/beneficios', agregarBeneficio);

// Ruta para obtener todos los beneficios
router.get('/beneficios', obtenerBeneficios);

// Ruta para actualizar un beneficio
router.put('/beneficios/:id', actualizarBeneficio);

// Ruta para eliminar un beneficio
router.delete('/beneficios/:id', eliminarBeneficio);

export default router;