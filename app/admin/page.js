import Link from "next/link";
import { getAllProjects } from "@/models/Project";
import { getAllPosts } from "@/models/Post";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [projects, posts] = await Promise.all([getAllProjects(), getAllPosts()]);

  const projectCount = projects.length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const postCount = posts.length;
  const publishedPosts = posts.filter((p) => p.published).length;

  return (
    <div>
      <h1 className="font-pixel text-xl mb-8 tracking-wider">DASHBOARD</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <Link
          href="/admin/projects"
          className="border-4 border-white bg-gray-900 p-6 hover:bg-gray-800 transition-colors"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
            Proyectos
          </p>
          <p className="font-pixel text-3xl mb-1">{projectCount}</p>
          <p className="text-gray-500 text-xs">{publishedProjects} publicados</p>
        </Link>

        <Link
          href="/admin/blog"
          className="border-4 border-white bg-gray-900 p-6 hover:bg-gray-800 transition-colors"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
            Posts
          </p>
          <p className="font-pixel text-3xl mb-1">{postCount}</p>
          <p className="text-gray-500 text-xs">{publishedPosts} publicados</p>
        </Link>
      </div>
    </div>
  );
}
