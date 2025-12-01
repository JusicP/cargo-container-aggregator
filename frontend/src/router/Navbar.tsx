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
                    <Link href="/create-listing">Створити оголошення</Link>
                    {isAuthenticated ? (
                        user?.role === "admin" ? (
                            <Link href="/admin/listings">Адмін панель</Link>
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
                            color="white"
                            className="!border-none"
                        >
                            <option className="!bg-gray-800" value="UA">UA</option>
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

                    {!isAuthenticated ? (
                        <IconButton
                            as={Link}
                            aria-label="profile"
                            variant="ghost"
                            rounded="full"
                            size="md"
                            href="/login"
                            _hover={{
                                bg: 'orange.500',
                                color: 'white',
                                transform: 'scale(1.05)',
                            }}
                        >
                            <UserCircle color="#ffffff"/>
                        </IconButton>
                    ) : (
                        <IconButton
                            as={Link}
                            aria-label="profile"
                            variant="ghost"
                            rounded="full"
                            href="/myaccount"
                            _hover={{
                                bg: 'orange.500',
                                color: 'white',
                                transform: 'scale(1.05)',
                            }}
                        >
                            <UserCircle color="#ffffff"/>
                        </IconButton>
                    )}
                </Flex>
            </Box>
        </Box>
    )
}