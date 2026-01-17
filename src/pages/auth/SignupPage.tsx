import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../../hooks/useAuth";

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const signupMutation = useSignup();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signupMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          navigate("/blogs");
        },
        onError: (error: any) => {
          alert(
            error.response?.data?.message || "Signup failed. Please try again."
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
          className=" bg-white rounded-2xl shadow-lg px-1 py-6 md:p-8 border border-gray-100"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back
          </h1>

          <div className="space-y-6">
            <Input
              label="Name"
              labelPlacement="outside-top"
              type="text"
              placeholder="joedoe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="bordered"
              classNames={{
                input:
                  "p-2 text-gray-700 bg-gray-50 focus:bg-gray-100 border-gray-600 outline-gray-500 ",
                label: "text-gray-700 ml-4",
              }}
            />

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
                isLoading={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Signing up..." : "Signup"}
              </Button>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/auth/login"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignupPage;
