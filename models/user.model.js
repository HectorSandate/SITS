import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    CURP: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fechaDeNacimiento: { type: Date, required: false },
    INE: { type: String },
    actaNacimiento: { type: String },
    comprobanteDomicilio: { type: String },
    comprobanteIngresos: { type: String },
    isActive: { type: Boolean, default: false }, 
    status: { type: String, default: "commun" },// Nuevo campo isActive con valor predeterminado false
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
