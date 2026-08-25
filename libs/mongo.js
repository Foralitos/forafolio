import { MongoClient } from "mongodb";

// Cliente nativo de MongoDB — usado SOLO por el MongoDBAdapter de next-auth.
// Para todo lo demás (modelos) usamos libs/mongoose.js.
// Si falta MONGODB_URI exportamos undefined; libs/auth.js degrada sin adapter
// para que el build no truene cuando aún no hay keys.

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
