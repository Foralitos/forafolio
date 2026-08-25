import "server-only";
import mongoose from "mongoose";
import connectMongo from "@/libs/mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: "" }, // Cloudinary secure_url
    tags: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
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
  };
}

export async function getPublishedProjects() {
  await connectMongo();
  const docs = await Project.find({ published: true })
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

export { Project };
