import {useState} from "react";
import '@/pages/homepage/homepage.css'
import { useAuth } from "@/contexts/AuthContext";
import { Cart, UserCircle } from "@mynaui/icons-react";
import { Link, Box, Flex, IconButton, NativeSelect } from "@chakra-ui/react";

export default function Navbar() {
    const [lang, setLang] = useState("UA");
    const {isAuthenticated, user} = useAuth();
    return (
        <Box className="homepage w-full">
            <Box as="header" className="site-header" colorPalette="fg">
                <nav className="nav-left">
                    <Link href="/#">Головна</Link>
                    <Link href="#">Пошук контейнерів</Link>
                    {isAuthenticated ? (
                        user?.role === "admin" ? (
                            <a href="#">Адмін панель</a>
                        ) : (
                            null
                        )
                    ) : (
                        <Link href="/register">Реєстрація</Link>
                    )}
                </nav>

                <Flex colorPalette="bg">
                    <NativeSelect.Root key="lang" width="fit-content">
                        <NativeSelect.Field
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                        >
                            <option value="UA">UA</option>
                            <option value="EN">EN</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>

                    <IconButton aria-label="cart" variant="ghost" rounded="full"><Cart /></IconButton>

                    {!isAuthenticated ? (
                        <IconButton as={Link} aria-label="profile" variant="ghost" rounded="full" size="md" href="/login"><UserCircle /></IconButton>
                    ) : (
                        <IconButton as={Link} aria-label="profile" variant="ghost" rounded="full" href="/myaccount"><UserCircle /></IconButton>
                    )}
                </Flex>
            </Box>
        </Box>
    )
}