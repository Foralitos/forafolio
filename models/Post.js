import "server-only";
import mongoose from "mongoose";
import connectMongo from "@/libs/mongoose";

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

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export function toPostDTO(doc) {
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
export function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function getPublishedPosts() {
  await connectMongo();
  const docs = await Post.find({ published: true })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();
  return docs.map(toPostDTO);
}

export async function getAllPosts() {
  await connectMongo();
  const docs = await Post.find().sort({ createdAt: -1 }).lean();
  return docs.map(toPostDTO);
}

export async function getPostBySlug(slug) {
  await connectMongo();
  const doc = await Post.findOne({ slug, published: true }).lean();
  return doc ? toPostDTO(doc) : null;
}

export async function getPostById(id) {
  await connectMongo();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await Post.findById(id).lean();
  return doc ? toPostDTO(doc) : null;
}

export { Post };
