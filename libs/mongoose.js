import mongoose from "mongoose";

// Conexión única a MongoDB Atlas, cacheada en `globalThis`. En serverless cada
// invocación puede reusar el mismo proceso: sin este caché se abriría una
// conexión nueva por request hasta tumbar el cluster.
//
// `bufferCommands: false` hace que una query falle de inmediato si no hay
// conexión, en vez de quedarse esperando en silencio hasta el timeout.
//
// La URI se lee DENTRO de la función: si se leyera al importar, un módulo
// cargado antes de que la plataforma inyecte las variables se quedaría con
// `undefined` congelado para siempre. Por la misma razón el error se lanza
// aquí y no en el scope del módulo — un throw al importar rompe el build de
// Next, que evalúa los módulos al recolectar las páginas.

// Un fallo de conexión no debe tardar 30s (el default de mongoose): si la
// función serverless se corta antes de responder, Vercel devuelve un 502
// genérico en vez de nuestro error.
const TIMEOUT_SELECCION_MS = 8000;

let cached = globalThis._mongoose;
if (!cached) cached = globalThis._mongoose = { conn: null, promise: null };

export default async function connectMongo() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: TIMEOUT_SELECCION_MS,
      })
      // Sin este catch, una promesa RECHAZADA se quedaba cacheada para siempre:
      // todo request posterior en ese proceso moría al instante aunque Atlas ya
      // se hubiera recuperado, hasta que el servidor reciclara.
      .catch((e) => {
        cached.promise = null;
        throw e;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
