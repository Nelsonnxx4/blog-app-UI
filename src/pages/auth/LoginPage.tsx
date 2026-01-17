import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/blogs");
        },
        onError: (error: any) => {
          alert(
            error.response?.data?.message || "Login failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className=" bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back
          </h1>

          <div className="space-y-6">
            <Input
              label="Email"
              labelPlacement="outside-top"
              type="email"
              placeholder="joedoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="bordered"
              classNames={{
                input:
                  "p-2 text-gray-700 bg-gray-50 focus:bg-gray-100 border-gray-600 outline-gray-500 ",
                label: "text-gray-700 ml-4",
              }}
            />

            <Input
              label="Password"
              labelPlacement="outside-top"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="bordered"
              classNames={{
                input:
                  "p-2 rounded-md text-gray-700 bg-gray-50 focus:bg-gray-100 border-gray-600 outline-gray-500",
                label: "text-gray-600 ml-4",
              }}
            />

            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="px-12 rounded-md bg-orange-500 text-white font-semibold"
                isLoading={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
