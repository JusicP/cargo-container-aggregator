import "../App.css";
import { useState } from "react";
import background from "../assets/background.png";
import "../index.css";

import {
  Box,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
  ChakraProvider,
  defaultSystem,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaTelegram,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

function App() {
  const [lang] = useState("UA");
  const colors = ['#bada55', '#bada55', '#bada55', '#bada55', '#bada55'];

  return (
    <ChakraProvider value={defaultSystem}>
      <div
        className="app-root"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          minHeight: "100vh",
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

          {/* Chakra-based nav-right */}
          <Flex className="nav-right" align="center" gap={6}>
            {/* Language Selector */}
            <Flex align="center" cursor="pointer" position="relative">
              <Text fontWeight="bold" fontSize="16px" color="white" mr={1}>
                {lang}
              </Text>
              <Box fontSize="12px" color="orange" transform="translateY(1px)">
                ▾
              </Box>
            </Flex>

            {/* Cart Icon */}
            <Box position="relative">
              <Icon
                as={FaShoppingCart}
                boxSize={5}
                color="white"
                _hover={{ color: "orange" }}
                cursor="pointer"
              />
            </Box>

            {/* Profile Icon with Avatar Overlay */}
            <Box position="relative">
              <Icon
                as={FaUser}
                boxSize={5}
                color="white"
                _hover={{ color: "orange" }}
                cursor="pointer"
              />
              <Box
                position="absolute"
                top="-6px"
                right="-6px"
                boxSize="18px"
                bg="white"
                borderRadius="full"
                border="2px solid #1a202c"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box boxSize="10px" bg="blue.400" borderRadius="full" />
              </Box>
            </Box>
          </Flex>
        </header>

        {/* Hero Section */}
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              Cargo<br />
              Containers
            </h1>
          </div>
          <div className="hero-right">
            <p className="hero-desc">
              Ми збираємо пропозиції з різних сайтів та баз даних, щоб ви могли
              легко шукати, порівнювати й знаходити найвигідніші варіанти.
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
                      <span
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                      ></span>
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
                    <input type="radio" name="status" />
                    <span className="status-dot">●</span>
                    Новий
                    <span className="status-ratio">6/7</span>
                  </label>
                  <label className="status-option">
                    <input type="radio" name="status" />
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
                  <input type="number" className="price-input" placeholder="0" />
                </div>
              </div>

              <div className="filter-section">
                <h2 className="filter-subtitle">Максимальна ціна</h2>
                <div className="price-input-group">
                  <span className="price-label">10</span>
                  <input type="number" className="price-input" placeholder="0" />
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
                    <img src="/" alt="Container" className="product-image" />
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
        {/* Footer */}
        <Box bg="#555b61" color="gray.100" py={8} px={10}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            flexWrap="wrap"
            mb={6}
          >
            {/* Левая часть - Лого и описание */}
            <VStack align="flex-start" gap={2}>
              <Text fontSize="2xl" fontWeight="bold">
                Cargo Containers
              </Text>
              <Text fontSize="md" color="gray.300">
                Купівля та оренда контейнерів онлайн
              </Text>
            </VStack>

            {/* Правая часть - Контакты и соцсети */}
            <VStack align="flex-end" gap={3}>
              {/* Ссылки */}
              <HStack gap={6}>
                <Link href="About.tsx" _hover={{ textDecoration: "underline" }} color="gray.300">
                  Про нас
                </Link>
                <Link href="#" _hover={{ textDecoration: "underline" }} color="gray.300">
                  Контакти
                </Link>
                <Link href="#" _hover={{ textDecoration: "underline" }} color="gray.300">
                  Оголошення
                </Link>
              </HStack>

              {/* Иконки соцсетей */}
              <HStack gap={4}>
                <Link href="https://google.com" target="_blank" rel="noopener noreferrer">
                  <Icon as={FaGoogle} boxSize={5} color="gray.300" _hover={{ color: "white" }} />
                </Link>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Icon as={FaGithub} boxSize={5} color="gray.300" _hover={{ color: "white" }} />
                </Link>
                <Link href="https://t.me" target="_blank" rel="noopener noreferrer">
                  <Icon as={FaTelegram} boxSize={5} color="gray.300" _hover={{ color: "white" }} />
                </Link>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Icon as={FaFacebook} boxSize={5} color="gray.300" _hover={{ color: "white" }} />
                </Link>
              </HStack>

              {/* Email */}
              <Link
                href="mailto:contact@cargocontainers.com"
                color="gray.300"
                fontSize="sm"
                _hover={{ textDecoration: "underline", color: "white" }}
              >
                contact@cargocontainers.com
              </Link>
            </VStack>
          </Flex>

          {/* Разделительная полоска */}
          <Box border="1px solid #AEACAC" width="100%" height="0px" mb={5} />

          {/* Копирайт */}
          <Text textAlign="right" fontSize="sm" color="gray.400">
            © 2025 Cargo Containers. Усі права захищені.
          </Text>
        </Box>
      </div>
    </ChakraProvider>
  );
}

export default App;