import mongoose from "mongoose";

const BeneficioSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    subTitulo: { type: String, required: false },
    categoria: { type: String, required: true },
    descripcion: { type: String, required: false },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

const Beneficio = mongoose.model("Beneficio", BeneficioSchema);

export default Beneficio;
