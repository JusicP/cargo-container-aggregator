import { Box, Button, VStack, Text, Image} from "@chakra-ui/react";
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
            <VStack>

                <Image
                    src="/src/assets/svg/Key.svg"
                    alt="sent-icon"
                    boxSize="110px"
                />

                <Box textAlign="center">
            <Text
                as="div"
                fontFamily="Avenir, sans-serif"
                fontSize="48px"
                fontWeight="900"
                textAlign="center"
                verticalAlign="middle"
                mb="10px"
                color="#52525B"
            >
                <div>ОГОЛОШЕННЯ</div>
            <div>ВІДПРАВЛЕНО НА МОДЕРАЦІЮ</div>
            </Text>
                </Box>
            <Text
                as="div"
                fontFamily="Geologica, sans-serif"
                fontSize="24px"
                fontWeight="400"
                textAlign="center"
                verticalAlign="middle"
                mb="32px"
                color="#A1A1AA"
            >
                <div>Ваше оголошення у черзі на перевірку.</div>
                <div>Ми вже працюємо над цим — очікуйте!</div>
            </Text>
            </VStack>

            <Button
                onClick={() => navigate("/")}
                bg="#18181B"
                color="white"
                w="179px"
                h="51px"
                borderRadius="4px"
                fontFamily="Avenir, sans-serif"
                fontSize="18px"
                fontWeight="500"
                _hover={{ bg: "#18181B" }}
                _active={{ bg: "#18181B" }}
            >
                На головну
            </Button>
        </Box>
    );
};

export default CreateListingSuccessPage;
