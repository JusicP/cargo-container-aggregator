import {useState} from "react";
import '@/pages/homepage/homepage.css'
import { useAuth } from "@/contexts/AuthContext";
import { Cart, UserCircle } from "@mynaui/icons-react";
import { Link, Box, Flex, IconButton, NativeSelect } from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';

export default function Navbar() {
    const [lang, setLang] = useState("UA");
    const {isAuthenticated, user} = useAuth();
    return (
        <Box className="homepage w-full">
            <Box as="header" className="site-header" colorPalette="fg">
                <nav className="nav-left">
<<<<<<< HEAD
                    <Link href="/#">Головна</Link>
                    <Link href="/create-listing">Створити оголошення</Link>
                    {isAuthenticated ? (
                        user?.role === "admin" ? (
                            <Link href="/admin/listings">Адмін панель</Link>
=======
                    <Link as={RouterLink} to="/">Головна</Link>
                    <Link as={RouterLink} to="/search">Пошук контейнерів</Link>
                    {isAuthenticated ? (
                        user?.role === "admin" ? (
                            <Link as={RouterLink} to="/admin">Адмін панель</Link>
>>>>>>> d4d1866 (fix: improving the top layer app hierarchy & fixing inside app navigation (no rerender for the context))
                        ) : (
                            null
                        )
                    ) : (
                        <Link as={RouterLink} to="/register">Реєстрація</Link>
                    )}
                </nav>

                <Flex colorPalette="bg">
                    <NativeSelect.Root key="lang" width="fit-content">
                        <NativeSelect.Field
                            color="white"
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            color="white"
                            className="!border-none"
                        >
                            <option className="к bg-gray-800" value="UA">UA</option>
                            <option className="!bg-gray-800"  value="EN">EN</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator color="#FD7F16" />
                    </NativeSelect.Root>

                    <IconButton
                        aria-label="cart"
                        variant="ghost"
                        rounded="full"
                        _hover={{
                            bg: 'orange.500',
                            color: 'white',
                            transform: 'scale(1.05)',
                        }}
                    >
                        <Cart color="#ffffff"/>
                    </IconButton>

                    <IconButton
                        as={RouterLink}
                        aria-label="profile"
                        variant="ghost"
                        rounded="full"
                        size="md"
                        to={isAuthenticated ? "/myaccount" : "/login"}
                        _hover={{
                            bg: 'orange.500',
                            color: 'white',
                            transform: 'scale(1.05)',
                        }}
                    >
                        <UserCircle color="#ffffff"/>
                    </IconButton>
                </Flex>
            </Box>
        </Box>
    )
}