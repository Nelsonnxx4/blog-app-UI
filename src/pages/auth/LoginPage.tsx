import { Button, Input } from "@heroui/react";
import { useState } from "react";

const LoginPage: React.FC = () => {
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
        <h1>Welcome back</h1>
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

        <Button type="submit">Login</Button>
      </form>
    </main>
  );
};

export default LoginPage;
