import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import BlogForm from "../BlogForm";
import { updateBlogPost } from "../actions";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id: Number(id) } });
  if (!post) notFound();

  const boundUpdate = updateBlogPost.bind(null, post.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar artículo</h1>
      <BlogForm post={post} action={boundUpdate} />
    </div>
  );
}
