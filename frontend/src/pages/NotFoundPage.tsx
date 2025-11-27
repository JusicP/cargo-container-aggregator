import PageLayout from "@/router/PageLayout";
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <VStack bg="#E4E4E7" minW="100vw" minH="100vh" justifyContent="center">
            <Text
                fontSize="120px"
                fontWeight="bold"
                color="#F97316" // яскраво-помаранчевий
                lineHeight="1"
            >
                404
            </Text>
            <Text
                fontSize="36px"
                fontWeight="extrabold"
                color="#3F3F46"
                mb={3}
                textTransform="uppercase"
            >
                Not Found
            </Text>
            <Text fontSize="18px" color="#71717A" mb={8}>
                Схоже сторінки за цією адресою не існує
            </Text>

            <Link to="/">
                <Button
                    bg="#18181B"
                    color="white"
                    _hover={{ bg: "#27272A" }}
                    borderRadius="md"
                    px={8}
                    py={6}
                >
                    На головну
                </Button>
            </Link>
        </VStack>
    );
}
