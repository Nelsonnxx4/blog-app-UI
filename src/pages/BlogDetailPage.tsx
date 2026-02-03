import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useBlog, useDeleteBlog } from "../hooks/useBlogs";
import { authHelpers } from "../utils/api";

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const blogId = id || ""; // ✅ Fixed - keep as string

  const { data: blog, isLoading, error } = useBlog(blogId);
  const deleteBlogMutation = useDeleteBlog();

  const currentUser = authHelpers.getUser();
  const isAuthor =
    currentUser &&
    (typeof blog?.userId === "string"
      ? blog.userId === currentUser.id
      : blog?.userId._id === currentUser.id);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogMutation.mutate(blogId, {
        onSuccess: () => {
          navigate("/blogs");
        },
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !blog)
    return <div className="text-center py-12 text-red-600">Blog not found</div>;

  // Get author name
  const authorName =
    typeof blog.userId === "object" ? blog.userId.name : blog.author;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/blogs"
          className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blogs
        </Link>

        <article className="bg-white rounded-xl shadow-lg p-3 border border-gray-200">
          <header className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-gray-600">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <User size={20} className="mr-2 text-gray-500" />
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={20} className="mr-2 text-gray-500" />
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {isAuthor && (
                <div className="flex items-center space-x-4">
                  <Link
                    to={`/blogs/edit/${blog._id}`}
                    className="flex items-center text-gray-500 hover:text-blue-800 transition-colors"
                  >
                    <Edit size={18} className="mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={18} className="mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center mt-4">
              <Tag size={20} className="text-gray-500 mr-2" />
              <span className="px-4 py-2 bg-orange-400/10 text-orange-600 font-medium rounded-full">
                {blog.category}
              </span>
            </div>
          </header>

          <div>
            <p className="text-gray-700 leading-6 text-lg whitespace-pre-line">
              {blog.content}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage;
