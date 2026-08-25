import "server-only";
import { v2 as cloudinary } from "cloudinary";

// Vercel corta cualquier request body en 4.5 MB, así que una Server Action
// nunca llega a ver un archivo más grande: validamos por debajo de ese techo
// para dar un error legible en vez de un 413 opaco. (En Remix el tope era 5 MB
// porque el multipart se parseaba con un handler propio en memoria.)
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// La config se aplica dentro de la función y no al importar: si se ejecutara en
// el scope del módulo, un build sin las llaves de Cloudinary evaluaría este
// archivo con `undefined` y dejaría el SDK mal configurado de forma permanente.
let configurado = false;

function configurar() {
  if (configurado) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Faltan las variables de entorno de Cloudinary");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configurado = true;
}

/**
 * Sube un File (de un FormData) a Cloudinary y devuelve la secure_url.
 * Devuelve null si no hay archivo (campo vacío en el form).
 */
export async function uploadImage(file, folder = "forafolio") {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return null;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("La imagen pesa más de 4 MB");
  }

  configurar();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload falló"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
