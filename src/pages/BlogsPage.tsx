import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, SortAsc, SortDesc } from "lucide-react";
import BlogCard from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useBlogs, useDeleteBlog } from "../hooks/useBlogs";
import { sortBlogData } from "../constants/constants";
import { authHelpers } from "../utils/api";

type SortField = "createdAt" | "title" | "author";
type SortOrder = "asc" | "desc";

const BlogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: blogs, isLoading, error } = useBlogs();
  const deleteBlogMutation = useDeleteBlog();
  const isAuthenticated = authHelpers.isAuthenticated();

  const handleDelete = (id: string) => {
    deleteBlogMutation.mutate(id);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-12 text-red-600">Error loading blogs</div>
    );

  // Filter and sort blogs
  const filteredAndSortedBlogs = blogs
    ?.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (sortField === "createdAt") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const categories = [
    "all",
    ...new Set(blogs?.map((blog) => blog.category) || []),
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col justify-between items-center mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl inline-block px-3 bg-orange-400/10 rounded-2xl text-orange-600">
              Bama Blogs
            </h1>
            {!isAuthenticated && (
              <Link
                to="/auth/login"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Login
              </Link>
            )}
          </div>
          <p className="text-gray-500 mt-2 md:w-[60%] text-center">
            Discover amazing stories and share your own for readers to
            understand more about you
          </p>
        </div>

        {/* Filters and Search */}
        <section className="md:flex flex-col justify-center items-center md:w-full">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-10 border border-slate-100">
            <section className="flex items-center justify-between mb-2">
              {/* Category Filter */}
              <div className="max-w-[40%] flex items-center justify-between">
                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-8 py-2 border border-gray-200/80 rounded-md focus:border-none appearance-none bg-white text-gray-600 text-sm transition-colors duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="max-w-[40%] relative">
                {sortOrder === "asc" ? (
                  <SortAsc
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                ) : (
                  <SortDesc
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                )}
                <select
                  value={`${sortField}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-") as [
                      SortField,
                      SortOrder
                    ];
                    setSortField(field);
                    setSortOrder(order);
                  }}
                  className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-md appearance-none bg-white text-gray-600 text-sm"
                >
                  {sortBlogData.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="text-gray-600 text-sm"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Search */}
            <div className="w-full flex justify-between items-center border border-gray-200 rounded-xl py-2 px-2 focus:ring-2 focus:ring-gray-300 mb-2">
              <Search className="text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search blogs by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-none px-2 focus:ring-0"
              />
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        {filteredAndSortedBlogs?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-orange-100">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg mb-4">No blog posts found.</p>
            {isAuthenticated && (
              <Link
                to="/blogs/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#fc8804] to-[#ffa258] text-white font-semibold rounded-xl hover:from-[#db7503] hover:to-[#fc8804] transition-all duration-300"
              >
                <Plus size={20} className="mr-2" />
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBlogs?.map((blog) => (
              <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Create Button - Only show if authenticated */}
      {isAuthenticated && (
        <Link
          to="/blogs/create"
          className="fixed bottom-10 right-5 z-20 transition-all duration-300 shadow-lg hover:shadow-xl p-4 rounded-full bg-orange-500/80"
        >
          <Plus size={20} className="text-white" />
        </Link>
      )}
    </div>
  );
};

export default BlogsPage;
