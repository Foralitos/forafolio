import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { connectDB } from "~/lib/db.server";

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

export type ProjectDoc = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
};

// Tipo plano serializable para pasar de loader -> componente.
export type ProjectDTO = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  order: number;
  published: boolean;
};

// Evita "OverwriteModelError" en hot-reload / serverless reuse.
const Project: Model<ProjectDoc> =
  (mongoose.models.Project as Model<ProjectDoc>) ||
  mongoose.model<ProjectDoc>("Project", projectSchema);

export function toProjectDTO(doc: ProjectDoc): ProjectDTO {
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

export async function getPublishedProjects(): Promise<ProjectDTO[]> {
  await connectDB();
  const docs = await Project.find({ published: true })
    .sort({ order: 1, createdAt: -1 })
    .lean<ProjectDoc[]>();
  return docs.map(toProjectDTO);
}

export async function getAllProjects(): Promise<ProjectDTO[]> {
  await connectDB();
  const docs = await Project.find()
    .sort({ order: 1, createdAt: -1 })
    .lean<ProjectDoc[]>();
  return docs.map(toProjectDTO);
}

export async function getProjectById(id: string): Promise<ProjectDTO | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await Project.findById(id).lean<ProjectDoc>();
  return doc ? toProjectDTO(doc) : null;
}

export { Project };
