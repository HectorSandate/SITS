import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_BUCKET_REGION,
  AWS_PUCLIC_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_SITS,
} from "./config/configs.js";
import fs from "fs";
import { time } from "console";

//Donde se especifica el cliente y sus claves
const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUCLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});


//Para subir archivo a S3 y obtener su URL pública
export async function uploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_SITS,
    Key: file.name,
    Body: stream,
  };
  const command = new PutObjectCommand(uploadParams);
  await client.send(command);

  // Obtener la URL del archivo subido
  const objectUrl = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: AWS_BUCKET_SITS, Key: file.name }),
    { expiresIn: 3600 } // URLs válidas por 1 hora
  );
  return { Location: objectUrl };
}


//Para obtener la lista de archivos en el bucket
export async function getFiled() {
  const command = new ListObjectsCommand({ Bucket: AWS_BUCKET_SITS });
  const data = await client.send(command);
  
  const files = await Promise.all(
    data.Contents.map(async (item) => {
      const objectUrl = await getSignedUrl(
        client,
        new GetObjectCommand({ Bucket: AWS_BUCKET_SITS, Key: item.Key }),
        { expiresIn: 3600 } // URLs válidas por 1 hora
      );
      return {
        ...item,
        ObjectURL: objectUrl,
      };
    })
  );

  return files;
}
//Para obtener un archivo en especifico
export async function getFileUnic(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_SITS,
    Key: filename,
  });
  return await client.send(command);
}

//Para obtener un archivo en especifico y su ruta pre firmada
export async function getFileUrl(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_SITS,
    Key: filename,
  });
  return await getSignedUrl(client, command, {expiresIn: 100});
}

//Para descargar un archivo
export async function downloadFile(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_SITS,
    Key: filename,
  });
  const result = await client.send(command);
  console.log(result);
  result.Body.pipe(fs.createWriteStream(`./filesDownload/${filename}`));
}
