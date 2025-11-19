import "./App.css";
import './index.css'
import AppRouter from '@/router/AppRouter';
<<<<<<< HEAD
import Navbar from "@/router/Navbar.tsx"
import Footer from "@/router/Footer.tsx"
import { Box, Flex } from "@chakra-ui/react";

const App: React.FC = () => {
  return (
    <Flex direction="column" minH="100vh">
        <Navbar />
          <Box flex="1">
              <AppRouter /> 
          </Box>
        <Footer />
    </Flex>
=======
import Navbar from "@/router/Navbar.tsx";
import React from "react";
import Footer from "@/router/Footer.tsx";

const App: React.FC = () => {
  return (
      <div className="!flex !flex-col !min-h-screen">
          <Navbar />
          <div className="!flex-1">
              <AppRouter />
          </div>
          <Footer />
      </div>
>>>>>>> d4d1866 (fix: improving the top layer app hierarchy & fixing inside app navigation (no rerender for the context))
  );
};

export default App;