import { Button, Input } from "@heroui/react";
import { useState } from "react";

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("http://localhost:5000", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <Input
          label="Name"
          type="email"
          placeholder="Nelsonn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          placeholder="joedoe@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit">Signup</Button>
      </form>
    </main>
  );
};

export default SignupPage;
export default SignupPage;
