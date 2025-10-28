import {
  Box,
  Flex,
  Text,
  Link,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { FaGithub, FaTelegram, FaGoogle, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <Box bg="#555b61" color="gray.100" py={8} px={10}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "flex-start" }}
        flexWrap="wrap"
      >
        {/* Левая часть */}
        <VStack align="flex-start" gap={1}>
          <Text fontSize="xl" fontWeight="bold">
            Cargo Containers
          </Text>
          <Text fontSize="sm" color="gray.300">
            Купівля та оренда контейнерів онлайн
          </Text>
        </VStack>

        {/* Правая часть */}
        <VStack
          align={{ base: "flex-start", md: "flex-end" }}
          gap={2}
          mt={{ base: 6, md: 0 }}
        >
          <HStack gap={6}>
            <Link href="#" _hover={{ textDecoration: "underline" }} color="gray.300">
              Про нас
            </Link>
            <Link href="#" _hover={{ textDecoration: "underline" }} color="gray.300">
              Контакти
            </Link>
            <Link href="#" _hover={{ textDecoration: "underline" }} color="gray.300">
              Оголошення
            </Link>
          </HStack>

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

      {/* Замена Divider на Box */}
      <Box
        borderTop="1px solid"
        borderColor="gray.500"
        my={5}
        width="100%"
      />

      <Text textAlign="right" fontSize="sm" color="gray.400">
        © 2025 Cargo Containers. Усі права захищені.
      </Text>
    </Box>
  );
}