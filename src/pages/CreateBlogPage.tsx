import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCreateBlog, useUpdateBlog, useBlog } from "../hooks/useBlogs";
import type { BlogFormData } from "../types/blogType";
import { ReusableInput } from "../components/ui/ReusableInput";
import { ReusableButton } from "../components/ui/ReusableButton";
import { Select, SelectItem } from "@heroui/react";
import { authHelpers } from "../utils/api";

const CreateBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const currentUser = authHelpers.getUser();

  // Check authentication
  useEffect(() => {
    if (!authHelpers.isAuthenticated()) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const { data: existingBlog, isLoading: isLoadingBlog } = useBlog(id || "");
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    author: currentUser?.name || "",
    content: "",
    category: "Technology",
  });

  const categories = [
    "Technology",
    "Lifestyle",
    "Programming",
    "Design",
    "Other",
  ];

  useEffect(() => {
    if (isEditing && existingBlog) {
      setFormData({
        title: existingBlog.title,
        author: existingBlog.author,
        content: existingBlog.content,
        category: existingBlog.category,
      });
    }
  }, [isEditing, existingBlog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && id) {
      updateBlogMutation.mutate(
        { id, data: formData },
        {
          onSuccess: (data) => {
            navigate(`/blogs/${data._id}`);
          },
          onError: (error: any) => {
            alert(
              error.response?.data?.message || "Failed to update blog post"
            );
          },
        }
      );
    } else {
      createBlogMutation.mutate(formData, {
        onSuccess: () => {
          navigate("/blogs");
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || "Failed to create blog post");
        },
      });
    }
  };

  const isLoading =
    isLoadingBlog ||
    createBlogMutation.isPending ||
    updateBlogMutation.isPending;

  if (isLoadingBlog && isEditing) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-start justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-orange-600 hover:text-orange-800 underline transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h2 className="text-xl font-medium text-gray-800 mt-5">
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md py-8 px-3 border border-gray-100"
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <ReusableInput
                type="text"
                required
                variant="faded"
                size="md"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            {/* Author */}
            <div>
              <label
                htmlFor="author"
                className="text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <ReusableInput
                type="text"
                required
                variant="faded"
                size="md"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <Select
                required
                placeholder="Select a category"
                selectedKeys={[formData.category]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setFormData((prev) => ({ ...prev, category: selected }));
                }}
                className="w-full border border-gray-200 rounded-md bg-gray-50/50 focus:outline-none transition-all text-gray-600"
              >
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="bg-gray-50 shadow-xl text-gray-700 font-medium"
                  >
                    {category}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                rows={8}
                required
                placeholder="Write your story..."
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full text-gray-700 border border-gray-300 p-2 focus:outline-0 rounded-md transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <ReusableButton
                type="submit"
                disabled={isLoading}
                color="orange3"
                size="md"
              >
                {isLoading
                  ? "Saving..."
                  : isEditing
                  ? "Update Post"
                  : "Create Post"}
              </ReusableButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;
