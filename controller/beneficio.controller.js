import Beneficio from '../models/beneficio.model.js';

// Crear un nuevo beneficio
export const agregarBeneficio = async (req, res) => {
    try {
      const { titulo, categoria, subTitulo, descripcion } = req.body;
  
      if (!titulo || !categoria) {
        return res.status(400).json({ message: "Faltan campos obligatorios: titulo y descripcion" });
      }
  
      let nuevoBeneficio;
      try {
        nuevoBeneficio = new Beneficio({ titulo, categoria, subTitulo, descripcion });
      } catch (error) {
        return res.status(500).json({ message: "Error al crear la instancia de Beneficio.", error });
      }
  
      try {
        await nuevoBeneficio.save();
      } catch (error) {
        return res.status(500).json({ message: "Error al guardar el beneficio en la base de datos.", error });
      }
  
      res.status(201).json(nuevoBeneficio);
  
    } catch (error) {
      res.status(500).json({ message: "Error general en el servidor.", error });
    }
  };

// Obtener todos los beneficios
export const obtenerBeneficios = async (req, res) => {
  try {
    const beneficios = await Beneficio.find({}, 'titulo categoria subTitulo descripcion'); // Select only titulo and descripcion fields
    res.status(200).json(beneficios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los beneficios.", error });
  }
};

// Actualizar un beneficio existente
export const actualizarBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, categoria, subTitulo, descripcion } = req.body;
    const beneficioActualizado = await Beneficio.findByIdAndUpdate(
      id,
      { titulo, categoria, subTitulo, descripcion },
      { new: true }
    );
    if (!beneficioActualizado) {
      return res.status(404).json({ message: "Beneficio no encontrado." });
    }
    res.status(200).json(beneficioActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el beneficio.", error });
  }
};

// Eliminar un beneficio
export const eliminarBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const beneficioEliminado = await Beneficio.findByIdAndDelete(id);
    if (!beneficioEliminado) {
      return res.status(404).json({ message: "Beneficio no encontrado." });
    }
    res.status(200).json({ message: "Beneficio eliminado con éxito." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el beneficio.", error });
  }
};

// Buscar beneficios por categoría
export const getBeneficiosPorCategoria = async (req, res) => {
  const { categoria } = req.params;
  
  try {
    const beneficios = await Beneficio.find({ categoria });
    
    if (!beneficios.length) {
      return res.status(404).json({ message: "No se encontraron beneficios para esta categoría." });
    }

    res.status(200).json(beneficios);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar beneficios por categoría.", error });
  }
};



