import "./App.css";
import './index.css'
import AppRouter from '@/router/AppRouter';
import Navbar from "@/router/Navbar.tsx"
import Footer from "@/router/Footer.tsx"
import { Flex } from "@chakra-ui/react";

const App: React.FC = () => {
  return (
    <Flex direction="column">
        <Navbar />
            <AppRouter />
        <Footer />
    </Flex>
  );
};

export default App;