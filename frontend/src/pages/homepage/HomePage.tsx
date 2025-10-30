import background from "@/assets/background.png";
import '@/pages/homepage/homepage.css'
import container from "@/assets/container.png";

function App() {
    const colors = ['#bada55', '#bada55', '#bada55', '#bada55', '#bada55'];
    return (
        <div
            className="app-root homepage"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",

            }}
        >

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


            {/* Main Content Section */}
            <div className="main-content">
                <div className="content-container">
                    {/* Sidebar Filters */}
                    <aside className="filters-sidebar">
                        <h1 className="filters-title">Фільтри:</h1>

                        {/* Тип контейнера */}
                        <div className="filter-section">
                            <h2 className="filter-subtitle">Тип</h2>
                            <div className="filter-select-container">
                                <select className="filter-select">
                                    <option>Оберіть тип контейнера</option>
                                </select>
                                <span className="dropdown-arrow">▾</span>
                            </div>
                        </div>

                        {/* Колір */}
                        <div className="filter-section">
                            <h2 className="filter-subtitle">Оберіть колір</h2>
                            <div className="color-filters">
                                {colors.map((color, index) => (
                                    <div key={index} className="color-option">
                                        <span className="color-swatch" style={{backgroundColor: color}}></span>
                                        <span className="color-text">{color}</span>
                                        <span className="color-dropdown">▾</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Стан */}
                        <div className="filter-section">
                            <h2 className="filter-subtitle">Стан</h2>
                            <div className="status-filters">
                                <label className="status-option">
                                    <input type="radio" name="status"/>
                                    <span className="status-dot">●</span>
                                    Новий
                                    <span className="status-ratio">6/7</span>
                                </label>
                                <label className="status-option">
                                    <input type="radio" name="status"/>
                                    <span className="status-dot">●</span>
                                    Б/У
                                    <span className="status-ratio">6/7</span>
                                </label>
                            </div>
                        </div>

                        {/* Ціна */}
                        <div className="filter-section">
                            <h2 className="filter-subtitle">Мінімальна ціна</h2>
                            <div className="price-input-group">
                                <span className="price-label">10</span>
                                <input type="number" className="price-input" placeholder="0"/>
                            </div>
                        </div>

                        <div className="filter-section">
                            <h2 className="filter-subtitle">Максимальна ціна</h2>
                            <div className="price-input-group">
                                <span className="price-label">10</span>
                                <input type="number" className="price-input" placeholder="0"/>
                            </div>
                        </div>

                        <div className="divider"></div>

                        {/* Reset Button */}
                        <div className="filter-section">
                            <button className="reset-button">Застосувати:</button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="content-main">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Введіть назву контейнера ..."
                                className="search-input"
                            />
                            <button className="search-btn">Пошук</button>
                        </div>

                        <p className="results-count">Всього знайдено: 22</p>

                        <div className="products-grid">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="product-card">
                                    <img
                                        src={container}
                                        alt="Container"
                                        className="product-image"
                                    />
                                    <div className="product-info">
                                        <p className="product-title">
                                            10ft New High Cube Storage Container with Roll-Up Door
                                        </p>
                                        <button className="product-link">↗</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>

    );
}

export default App;
