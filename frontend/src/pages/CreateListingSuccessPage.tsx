import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CreateListingSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            w="100%"
            h="100vh"
            bg="white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Text
                fontFamily="Avenir, sans-serif"
                fontSize="32px"
                fontWeight="500"
                textAlign="center"
                mb="32px"
                color="#18181B"
            >
                Оголошення відправлено на модерацію
            </Text>

            <Button
                onClick={() => navigate("/")}
                bg="#18181B"
                color="white"
                w="179px"
                h="51px"
                borderRadius="4px"
                fontFamily="Avenir, sans-serif"
                fontSize="16px"
                fontWeight="500"
                _hover={{ bg: "#18181B" }} // в фигме hover нет → оставляем
                _active={{ bg: "#18181B" }}
            >
                повернутись на головну
            </Button>
        </Box>
    );
};

export default CreateListingSuccessPage;
