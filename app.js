import express from "express";
import morgan from "morgan";
import authRoute from "./routes/auth.routes.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import { uploadFile, getFiled, getFileUnic, downloadFile, getFileUrl } from "./s3.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
const app = express();
dotenv.config();



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

const {EMAIL_PASSWORD}  = process.env; 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hectorjosediazsandate@gmail.com',
    pass: EMAIL_PASSWORD,
  },
});

console.log(EMAIL_PASSWORD )

app.post('/enviar-correo', (req, res) => {
  const { titulo, agremiado, fecha, CURP, numero } = req.body;

  const mailOptions = {
    from: 'hectorjosediazsandate@gmail.com',
    to: 'hector_3127210071@utd.edu.mx',
    subject: `Solicitud de Beneficio: ${titulo}`,
    text: `El agremiado ${agremiado}, ha solicitado el beneficio: ${titulo} el día ${fecha}.
          CURP: ${CURP}
          Numero: ${numero}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      return res.status(500).send('Error al enviar el correo');
    }
    console.log('Correo enviado: ' + info.response);
    res.status(200).send('Correo enviado exitosamente');
  });
});

  //express-fileupload para poder subir imagenes
  app.post("/files", async (req, res) => {
    const result = await uploadFile(req.files.file);
    res.json({ message: "file uploaded", result });
  });

app.use("/api", authRoute);

export default app;
