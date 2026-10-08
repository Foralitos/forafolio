// Agrega los proyectos de scripts/data/new-projects.json y reordena la grilla.
// Ejecutar con:
//   yarn add-projects
// - Los proyectos nuevos se crean OCULTOS (published: false) y sin portada:
//   se publican desde el admin cuando Fora sube su imagen.
// - Si un proyecto ya existe (por título) no se toca su contenido.
// - El orden de ORDEN se aplica a todos: lo nuevo primero, lo viejo al final.
import mongoose from "mongoose";
import { readFile } from "node:fs/promises";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Falta MONGODB_URI (usa: yarn add-projects)");
  process.exit(1);
}

const ORDEN = [
  "Sport Metrics",
  "Klai",
  "justenvs",
  "Artemisa",
  "Koi School",
  "sweeply",
  "πt (Pit)",
  "ElAtletico",
  "Hablar con Santa",
  "Furbo",
  "FORAUI",
];

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({}, { strict: false, timestamps: true })
);

const nuevos = JSON.parse(
  await readFile(new URL("./data/new-projects.json", import.meta.url), "utf8")
);

await mongoose.connect(MONGODB_URI);

for (const proyecto of nuevos) {
  const existe = await Project.findOne({ title: proyecto.title }).lean();
  if (existe) {
    console.log(`= ${proyecto.title}: ya existe, no se toca`);
    continue;
  }
  await Project.create({ ...proyecto, image: "", gallery: [], video: "", published: false });
  console.log(`+ ${proyecto.title}: creado (oculto)`);
}

for (const [i, title] of ORDEN.entries()) {
  const r = await Project.updateOne({ title }, { $set: { order: i } });
  if (r.matchedCount === 0) console.log(`✗ orden: no existe "${title}"`);
}
// Solo un destacado: el primero de la lista.
await Project.updateMany({ title: { $ne: ORDEN[0] } }, { $set: { featured: false } });
console.log("✓ orden aplicado");

await mongoose.disconnect();
process.exit(0);
