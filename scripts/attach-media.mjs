// Sube portadas, galerías y videos a Cloudinary y los asigna a cada proyecto.
// Ejecutar con:
//   node --env-file=.env scripts/attach-media.mjs <manifest.json>
// El manifest es una lista de { title, image?, gallery?, video?, publish?,
// set?, replace? }. Rutas locales se suben; URLs (p. ej. YouTube) se guardan
// tal cual. `replace` cambia textos dentro de `body` ([de, a]).
import mongoose from "mongoose";
import { readFile } from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";

const { MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!MONGODB_URI || !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("Faltan MONGODB_URI o las llaves de Cloudinary en .env");
  process.exit(1);
}
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const manifest = JSON.parse(await readFile(process.argv[2], "utf8"));
const Project = mongoose.model("Project", new mongoose.Schema({}, { strict: false, timestamps: true }));

async function subir(ruta) {
  if (/^https?:\/\//.test(ruta)) return ruta;
  const r = await cloudinary.uploader.upload(ruta, {
    folder: "forafolio/projects",
    resource_type: "auto",
  });
  return r.secure_url;
}

await mongoose.connect(MONGODB_URI);

for (const item of manifest) {
  const doc = await Project.findOne({ title: item.title }).lean();
  if (!doc) {
    console.log(`✗ ${item.title}: no existe`);
    continue;
  }
  const update = { ...(item.set ?? {}) };
  if (item.image) update.image = await subir(item.image);
  if (item.gallery) update.gallery = await Promise.all(item.gallery.map(subir));
  if (item.video) update.video = await subir(item.video);
  if (item.publish) update.published = true;
  if (item.replace) {
    let body = doc.body ?? "";
    for (const [de, a] of item.replace) {
      if (!body.includes(de)) console.log(`  ! ${item.title}: no encontré "${de.slice(0, 40)}…"`);
      body = body.replace(de, a);
    }
    update.body = body;
  }
  await Project.updateOne({ _id: doc._id }, { $set: update });
  console.log(`✓ ${item.title}: ${Object.keys(update).join(", ")}`);
}

await mongoose.disconnect();
process.exit(0);
