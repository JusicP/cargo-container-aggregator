import { useState } from "react";
import LoginForm from "./LoginForm";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!showLogin ? (
        <button onClick={() => setShowLogin(true)}>Login</button>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

export default App;
