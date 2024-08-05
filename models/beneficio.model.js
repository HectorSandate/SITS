import mongoose from "mongoose";

const BeneficioSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

const Beneficio = mongoose.model("Beneficio", BeneficioSchema);

export default Beneficio;
