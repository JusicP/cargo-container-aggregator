import {useState} from "react";

export default function Navbar() {
    const [lang, setLang] = useState("UA");

    return (
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
    )
}