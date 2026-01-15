import { createBrowserRouter } from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/blogs",
    element: <BlogsPage />,
  },
  {
    path: "/blogs/:id",
    element: <BlogDetailPage />,
  },
  {
    path: "/blogs/create",
    element: <CreateBlogPage />,
  },
  {
    path: "/blogs/edit/:id",
    element: <CreateBlogPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/signup",
    element: <SignupPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
