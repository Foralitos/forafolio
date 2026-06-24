import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { connectDB } from "~/lib/db.server";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" }, // markdown
    coverImage: { type: String, default: "" }, // Cloudinary secure_url
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type PostDoc = InferSchemaType<typeof postSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type PostDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const Post: Model<PostDoc> =
  (mongoose.models.Post as Model<PostDoc>) ||
  mongoose.model<PostDoc>("Post", postSchema);

export function toPostDTO(doc: PostDoc): PostDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? "",
    content: doc.content ?? "",
    coverImage: doc.coverImage ?? "",
    tags: doc.tags ?? [],
    published: doc.published ?? false,
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : null,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

// Genera un slug url-safe a partir de un título.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function getPublishedPosts(): Promise<PostDTO[]> {
  await connectDB();
  const docs = await Post.find({ published: true })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean<PostDoc[]>();
  return docs.map(toPostDTO);
}

export async function getAllPosts(): Promise<PostDTO[]> {
  await connectDB();
  const docs = await Post.find().sort({ createdAt: -1 }).lean<PostDoc[]>();
  return docs.map(toPostDTO);
}

export async function getPostBySlug(slug: string): Promise<PostDTO | null> {
  await connectDB();
  const doc = await Post.findOne({ slug, published: true }).lean<PostDoc>();
  return doc ? toPostDTO(doc) : null;
}

export async function getPostById(id: string): Promise<PostDTO | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await Post.findById(id).lean<PostDoc>();
  return doc ? toPostDTO(doc) : null;
}

export { Post };
