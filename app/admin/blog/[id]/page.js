import { notFound } from "next/navigation";
import { getPostById } from "@/models/Post";
import PostForm from "./PostForm";

export const dynamic = "force-dynamic";

export default async function PostEditor({ params }) {
  const { id } = await params;
  const isNew = id === "new";
  const post = isNew ? null : await getPostById(id);
  if (!isNew && !post) notFound();

  return <PostForm id={id} isNew={isNew} post={post} />;
}
