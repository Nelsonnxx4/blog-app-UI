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
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create Account
          </h1>

          <div className="space-y-4">
            <Input
              label="Name"
              type="text"
              placeholder="Nelson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="bordered"
              classNames={{
                input: "text-gray-700",
                label: "text-gray-600",
              }}
            />

            <Input
              label="Email"
              type="email"
              placeholder="joedoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="bordered"
              classNames={{
                input: "text-gray-700",
                label: "text-gray-600",
              }}
            />

            <Input
              label="Password"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="bordered"
              classNames={{
                input: "text-gray-700",
                label: "text-gray-600",
              }}
            />

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white font-semibold"
              isLoading={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating account..." : "Sign Up"}
            </Button>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
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
