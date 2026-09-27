import BlogForm from "../BlogForm";
import { createBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nuevo artículo</h1>
      <BlogForm action={createBlogPost} />
    </div>
  );
}
