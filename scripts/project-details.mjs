// Llena la página de cada proyecto (summary, body, ficha) con los textos de
// scripts/data/project-details.json. Ejecutar con:
//   yarn project-details
// Busca cada proyecto por título y SOLO escribe los campos que estén vacíos:
// lo que Fora ya editó desde el admin nunca se pisa.
import mongoose from "mongoose";
import { readFile } from "node:fs/promises";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Falta MONGODB_URI (usa: yarn project-details)");
  process.exit(1);
}

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({}, { strict: false, timestamps: true })
);

const detalles = JSON.parse(
  await readFile(new URL("./data/project-details.json", import.meta.url), "utf8")
);

const vacio = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

await mongoose.connect(MONGODB_URI);

for (const { title, ...campos } of detalles) {
  const doc = await Project.findOne({ title }).lean();
  if (!doc) {
    console.log(`✗ ${title}: no existe en la base, se salta`);
    continue;
  }
  const update = {};
  for (const [campo, valor] of Object.entries(campos)) {
    if (vacio(doc[campo]) && !vacio(valor)) update[campo] = valor;
  }
  if (Object.keys(update).length === 0) {
    console.log(`= ${title}: nada que llenar`);
    continue;
  }
  await Project.updateOne({ _id: doc._id }, { $set: update });
  console.log(`✓ ${title}: ${Object.keys(update).join(", ")}`);
}

await mongoose.disconnect();
process.exit(0);
