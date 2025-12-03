import "./App.css";
import './index.css'
import AppRouter from '@/router/AppRouter';
import Navbar from "@/router/Navbar.tsx"
import Footer from "@/router/Footer.tsx"
import { Box, Flex } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";

const App: React.FC = () => {
  return (
    <Flex direction="column" minH="100vh">
        <Navbar />
          <Box flex="1">
              <AppRouter />
          </Box>
        <Footer />
        <Toaster />
    </Flex>
  );
};

export default App;