import {useState} from "react";
import '@/pages/homepage/homepage.css'
import { useAuth } from "@/contexts/AuthContext";
import { Cart, UserCircle } from "@mynaui/icons-react";
import { Link, Box, Flex, IconButton, NativeSelect } from "@chakra-ui/react";

export default function Navbar() {
    const [lang, setLang] = useState("UA");
    const {isAuthenticated, user} = useAuth();
    return (
        <Box className="homepage">
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
                            color="white"
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                        >
                            <option value="UA" style={{ color: "black" }}>UA</option>
                            <option value="EN" style={{ color: "black" }}>EN</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator color="#FD7F16"/>
                    </NativeSelect.Root>

                    <IconButton variant="ghost" _hover={{ bg: "orange.400" }} rounded="full"><Cart color="white"/></IconButton>

                    {!isAuthenticated ? (
                        <IconButton as={Link} variant={{ base: "ghost", _selected: "subtle" }} _hover={{ bg: "orange.400" }} rounded="full" href="/login"><UserCircle color="white"/></IconButton>
                    ) : (
                        <IconButton as={Link} variant={{ base: "ghost", _selected: "subtle" }} rounded="full" href="/myaccount"><UserCircle color="white"/></IconButton>
                    )}
                </Flex>
            </Box>
        </Box>
    )
}