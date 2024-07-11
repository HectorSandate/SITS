import express from "express";
import morgan from "morgan";
import authRoute from "./routes/auth.routes.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import { uploadFile, getFiled, getFileUnic, downloadFile, getFileUrl } from "./s3.js";
const app = express();

app.use(
  cors({
    origin: "*", // Aquí permites las solicitudes de este origen
    optionsSuccessStatus: 200, // Algunos navegadores antiguos (IE11, varios SmartTVs) no manejan 204
  })
);

app.use(morgan("dev"));
app.use(express.json());

// Traer el contenido del bucket con URLs
app.get("/files", async (req, res) => {
  try {
    const result = await getFiled();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//traer el contenido del bucket de uno en especifico
app.get("/files/:fileName", async (req, res) => {
    const result = await getFileUrl(req.params.fileName)
  res.json(result)
});

//descargar 
app.get("/downloadfile/:fileName", async (req, res) => {
 await downloadFile(req.params.fileName)
  res.json({message:'Archivo descargado'})
});

app.use(express.static('filesDownload'))

//express-fileupload para poder subir imagenes
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

//express-fileupload para poder subir imagenes
app.post("/files", async (req, res) => {
  const result = await uploadFile(req.files.file);
  res.json({ message: "file uploaded", result });
});

app.use("/api", authRoute);

export default app;
