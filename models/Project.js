import "server-only";
import mongoose from "mongoose";
import connectMongo from "@/libs/mongoose";
import { slugify } from "@/libs/slug";

export const PROJECT_STATUSES = ["live", "paused", "archived"];

// En `yarn dev` el sitio también muestra los proyectos ocultos, para revisar
// cómo se ven antes de publicarlos. En producción solo salen los publicados.
const VISIBLES =
  process.env.NODE_ENV === "development" ? {} : { published: true };

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: "" }, // Cloudinary secure_url
    tags: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    // Página propia del proyecto (/projects/<slug>). Todo opcional: los
    // proyectos que existían antes de estos campos siguen funcionando.
    slug: { type: String, trim: true, default: "" },
    summary: { type: String, default: "" },
    body: { type: String, default: "" }, // markdown
    year: { type: Number, default: null },
    role: { type: String, default: "" },
    stack: { type: [String], default: [] },
    status: { type: String, enum: PROJECT_STATUSES, default: "live" },
    repoUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    gallery: { type: [String], default: [] }, // Cloudinary secure_urls
    video: { type: String, default: "" }, // Cloudinary secure_url
  },
  { timestamps: true }
);

// Evita "OverwriteModelError" cuando el módulo se re-evalúa (hot reload en dev,
// reuso del proceso en serverless).
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

// Los documentos de Mongoose NO son serializables como props de un Server
// Component hacia un Client Component (ObjectId, Date, prototipos). Todo lo que
// cruza esa frontera pasa por aquí primero.
export function toProjectDTO(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description,
    image: doc.image ?? "",
    tags: doc.tags ?? [],
    liveUrl: doc.liveUrl ?? "",
    order: doc.order ?? 0,
    published: doc.published ?? true,
    // Los proyectos viejos no tienen slug guardado: se deriva del título, así
    // que no hace falta migrar la base.
    slug: doc.slug || slugify(doc.title),
    summary: doc.summary ?? "",
    body: doc.body ?? "",
    year: doc.year ?? null,
    role: doc.role ?? "",
    stack: doc.stack ?? [],
    status: doc.status || "live",
    repoUrl: doc.repoUrl ?? "",
    featured: doc.featured ?? false,
    gallery: doc.gallery ?? [],
    video: doc.video ?? "",
  };
}

export async function getPublishedProjects() {
  await connectMongo();
  const docs = await Project.find(VISIBLES)
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return docs.map(toProjectDTO);
}

export async function getAllProjects() {
  await connectMongo();
  const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return docs.map(toProjectDTO);
}

export async function getProjectById(id) {
  await connectMongo();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await Project.findById(id).lean();
  return doc ? toProjectDTO(doc) : null;
}

// Busca por el slug guardado y, si no hay, por el derivado del título (los
// proyectos que nunca se han vuelto a guardar desde el admin).
export async function getProjectBySlug(slug) {
  await connectMongo();
  const doc = await Project.findOne({ slug, ...VISIBLES }).lean();
  if (doc) return toProjectDTO(doc);
  const publicados = await Project.find(VISIBLES).lean();
  const match = publicados.find((p) => !p.slug && slugify(p.title) === slug);
  return match ? toProjectDTO(match) : null;
}

export { Project };
