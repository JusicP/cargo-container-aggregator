<<<<<<< HEAD
=======
import {BrandFacebook, BrandGithub, BrandGoogle, BrandTwitter} from "@mynaui/icons-react";
import { Link as RouterLink } from 'react-router-dom';
import {Link} from '@chakra-ui/react'
>>>>>>> d4d1866 (fix: improving the top layer app hierarchy & fixing inside app navigation (no rerender for the context))
import '@/pages/homepage/homepage.css'
import { Box, Flex, VStack, Text, Link, HStack, Icon } from "@chakra-ui/react";
import { FaFacebook, FaGithub, FaGoogle, FaTelegram } from "react-icons/fa";

const routerLinkStyle: React.CSSProperties = {
  color: '#cbd5e0',
  textDecoration: 'none',
  transition: 'color 0.2s ease-in-out'
};

export default function Footer() {
    return (
<<<<<<< HEAD
        <Box bg="#555b61" color="gray.100" py={8} px={10} width="100%">
            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "flex-start", md: "flex-start" }}
                flexWrap="wrap"
                maxW="1200px"
                mx="auto"
            >
                <VStack align="flex-start" gap={1}>
                    <Text fontSize="xl" fontWeight="bold">
                        Cargo Containers
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                        Купівля та оренда контейнерів онлайн
                    </Text>
                </VStack>

                <VStack
                    align={{ base: "flex-start", md: "flex-end" }}
                    gap={2}
                    mt={{ base: 6, md: 0 }}
                >
                    <VStack align="flex-end" gap={3}>
                        <HStack gap={6}>
                            <Link href="/about" style={routerLinkStyle}>Про нас</Link>
                            <Link href="/contacts" style={routerLinkStyle}>Контакти</Link>
                            <Link href="/listings" style={routerLinkStyle}>Оголошення</Link>
                        </HStack>
                    </VStack>

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

            <Box
                borderTop="1px solid"
                borderColor="gray.500"
                my={5}
                width="100%"
                maxW="1200px"
                mx="auto"
            />

            <Box maxW="1200px" mx="auto" px={{ base: 4, md: 0 }}>
                <Text textAlign="right" fontSize="sm" color="gray.400">
                © 2025 Cargo Containers. Усі права захищені.
                </Text>
            </Box>
        </Box>
=======
        <div className="homepage w-full">
            <footer className="footer bg-[#595F65] text-white homepage">
                <div className="footer-content flex justify-between">
                    <div className="footer-brand">
                        <h2>Cargo Containers</h2>
                        <p>Купівля та оренда контейнерів онлайн</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <nav className="footer-nav flex flex-row gap-10">
                            <Link as={RouterLink} to="/">Про нас</Link>
                            <Link as={RouterLink} to="/">Контакти</Link>
                            <Link as={RouterLink} to="/">Оголошення</Link>
                        </nav>
                        <div className="footer-social flex flex-row gap-5">
                            <BrandGithub />
                            <BrandGoogle />
                            <BrandFacebook />
                            <BrandTwitter />
                            <a href="mailto:contact@cargocontainers.com">contact@cargocontainers.com</a>
                        </div>
                    </div>
                </div>
                <br className="text-white" />
                <div className="footer-bottom">
                    <p>© 2023 Cargo Containers. Усі права захищені.</p>
                </div>
            </footer>
        </div>
>>>>>>> d4d1866 (fix: improving the top layer app hierarchy & fixing inside app navigation (no rerender for the context))
    )
}