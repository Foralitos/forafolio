import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI no está definida en las variables de entorno");
}

// En serverless (Vercel) cada invocación puede reusar el módulo. Cacheamos la
// conexión en `global` para no abrir una nueva por cada request y agotar el pool.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
      // Falla rápido (antes del timeout de la función serverless) con un error
      // legible en vez de colgar la invocación hasta que Vercel la mate.
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Una conexión rechazada deja la promesa cacheada envenenada: cada request
    // siguiente en la misma instancia warm reusaría ese reject. La limpiamos
    // para permitir reintento en la próxima invocación.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
