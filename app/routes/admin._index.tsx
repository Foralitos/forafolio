import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/require-user.server";
import { getAllProjects } from "~/models/project.server";
import { getAllPosts } from "~/models/post.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  const [projects, posts] = await Promise.all([
    getAllProjects(),
    getAllPosts(),
  ]);
  return json({
    projectCount: projects.length,
    publishedProjects: projects.filter((p) => p.published).length,
    postCount: posts.length,
    publishedPosts: posts.filter((p) => p.published).length,
  });
}

export default function AdminHome() {
  const { projectCount, publishedProjects, postCount, publishedPosts } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="font-pixel text-xl mb-8 tracking-wider">DASHBOARD</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <Link
          to="/admin/projects"
          className="border-4 border-white bg-gray-900 p-6 hover:bg-gray-800 transition-colors"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
            Proyectos
          </p>
          <p className="font-pixel text-3xl mb-1">{projectCount}</p>
          <p className="text-gray-500 text-xs">
            {publishedProjects} publicados
          </p>
        </Link>

        <Link
          to="/admin/blog"
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
