import { useState } from "react";

function LoginForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username_or_email: usernameOrEmail,
          password: password,
        }),
      });

      if (!res.ok) {
        throw new Error("Authorization error");
      }

      const data = await res.json();
      setToken(data.access_token);
      console.log("JWT:", data.access_token);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {token && (
        <p style={{ marginTop: "20px", color: "green" }}>
          ✅ Logged in. JWT saved: {token}
        </p>
      )}
    </div>
  );
}

export default LoginForm;
