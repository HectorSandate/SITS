import { Router } from "express";
import {deleteUser, getAllUsers, getUserById, loginUser, registerUser, toggleUserStatus} from '../controller/user.controller.js'
import {
    agregarBeneficio,
    obtenerBeneficios,
    actualizarBeneficio,
    eliminarBeneficio,
    getBeneficiosPorCategoria,
  } from "../controller/beneficio.controller.js"; // Asegúrate de que el path sea correcto

const router = Router();

//Registrar un usuario 
router.post('/register', registerUser);
//login
router.post('/login', loginUser);
//obtener todos los usuaios 
router.get('/users', getAllUsers);
//obtener usuario por id
router.get('/users/:CURP', getUserById);
//borrar usuario
router.delete('/users/:id', deleteUser);
//cambiar status
router.put('/users/:id/toggle-status', toggleUserStatus);



// Ruta para agregar un beneficio
router.post('/beneficios', agregarBeneficio);

// Ruta para obtener todos los beneficios
router.get('/beneficios', obtenerBeneficios);

// Ruta para actualizar un beneficio
router.put('/beneficios/:id', actualizarBeneficio);

// Ruta para eliminar un beneficio
router.delete('/beneficios/:id', eliminarBeneficio);
// Ruta para buscar beneficios por categoría
router.get('/beneficios/categoria/:categoria', getBeneficiosPorCategoria);

export default router;