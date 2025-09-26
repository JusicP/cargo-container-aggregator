import "./App.css";
import { useState } from "react";
import background from "./assets/background.png";

function App() {
  const [lang, setLang] = useState("UA");

  return (
      <div
          className="app-root"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
      >
        {/* Header */}
        <header className="site-header">
          <nav className="nav-left">
            <a href="#">Головна</a>
            <a href="#">Пошук контейнерів</a>
            <a href="#">Аналітика</a>
            <a href="#">Адмін панель</a>
          </nav>

          <div className="nav-right">
            <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="lang-select"
                aria-label="Вибір мови"
            >
              <option value="UA">UA</option>
              <option value="EN">EN</option>
            </select>

            <button className="icon-btn" aria-label="cart">🛒</button>
            <button className="icon-btn" aria-label="profile">👤</button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="hero-overlay"/>

        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              Cargo<br/>
              Containers
            </h1>
          </div>
          <div className="hero-right">
          <p className="hero-desc">
            Ми збираємо пропозиції з різних сайтів та баз даних,
            щоб ви могли легко шукати, порівнювати й знаходити найвигідніші варіанти.
          </p>
          <button className="cta-btn">Аналітика →</button>
        </div>
      </div>
    </div>
  );
}

export default App;
