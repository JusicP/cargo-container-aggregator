import PageLayout from "@/router/PageLayout";
import { Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F3F4F6]">
            <PageLayout>
                <Box
                    className="flex flex-col items-center justify-center flex-grow text-center"
                    py={20}
                >
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
                </Box>
                
            </PageLayout>
        </div>
    );
}
