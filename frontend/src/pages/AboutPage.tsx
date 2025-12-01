import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  VStack,
  Icon,
  Image,
  Flex,
  Link,
  HStack
} from '@chakra-ui/react';
import {
  FaCheckCircle,
  FaShippingFast,
  FaChartLine,
  FaHandsHelping,
  FaGithub,
  FaTelegram,
  FaGoogle,
  FaFacebook
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import type { IconType } from 'react-icons';


// =================================================================
// 1. ТИПІЗАЦІЯ ДЛЯ КОМПОНЕНТІВ
// =================================================================

interface FeatureProps {
  icon: IconType;
  title: string;
  text: string;
}

// =================================================================
// 2. КОМПОНЕНТИ ТА СТИЛІ
// =================================================================

const routerLinkStyle: React.CSSProperties = {
  color: '#cbd5e0',
  textDecoration: 'none',
  transition: 'color 0.2s ease-in-out'
};

const Feature: React.FC<FeatureProps> = ({ icon, title, text }) => (
  <VStack
    bg="white"
    p={6}
    rounded="lg"
    shadow="md"
    align="flex-start"
    transition="all 0.3s"
    _hover={{ shadow: "xl", transform: "translateY(-5px)" }}
  >
    <Icon as={icon} w={8} h={8} color="blue.500" />
    <Text fontWeight="semibold" fontSize="xl" mt={2}>
      {title}
    </Text>
    <Text color="gray.600">{text}</Text>
  </VStack>
);

function FooterContent(): React.ReactElement {
  return (
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
              <RouterLink to="/about" style={routerLinkStyle}>Про нас</RouterLink>
              <RouterLink to="/contacts" style={routerLinkStyle}>Контакти</RouterLink>
              <RouterLink to="/listings" style={routerLinkStyle}>Оголошення</RouterLink>
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
  );
}




export default function AboutPage(): React.ReactElement {
  return (

    <Box
        width="100%"
        overflowX="hidden"
    >

      {/* 1. Секція Hero */}
      <Box
        bg="gray.800"
        color="white"
        py={{ base: 12, md: 20 }}
        textAlign="center"
        width="100%"
      >
        <Container maxW="3xl">
          <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="extrabold" mb={4}>
            Про Cargo Containers
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.300">
            Ваш надійний партнер у світі контейнерних перевезень та зберігання.
          </Text>
        </Container>
      </Box>

      {/* 2. Секція Місія та бачення */}
      <Container maxW="6xl" py={{ base: 10, md: 16 }}>
        <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={10}
            align="center"
        >
          <Box flex={1}>
            <Heading as="h2" size="xl" mb={4} color="gray.700">
              Наша місія
            </Heading>
            <Text fontSize="lg" mb={6} color="gray.600">
              Ми спрощуємо складний процес купівлі, продажу та оренди вантажних
              контейнерів, забезпечуючи максимальну прозорість, ефективність та
              доступність для кожного клієнта, незалежно від обсягу його потреб.
            </Text>
            <Stack gap={4}>
              <HStack>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontWeight="medium">Прозорі ціни</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontWeight="medium">Широкий вибір типів контейнерів</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontWeight="medium">Перевірені постачальники</Text>
              </HStack>
            </Stack>
          </Box>
          <Box flex={1} ml={{ md: 10 }} mt={{ base: 8, md: 0 }}>
            <Image
              rounded="md"
              alt="Контейнери в порту"
              src="https://st.depositphotos.com/1000128/2170/i/450/depositphotos_21700109-stock-illustration-stacked-cargo-containers-in-port.jpg"
              objectFit="cover"
              boxShadow="xl"
            />
          </Box>
        </Flex>
      </Container>

      {/* 3. Секція Переваги */}
      <Box bg="gray.50" py={{ base: 10, md: 16 }} width="100%">
        <Container maxW="6xl">
          <Heading as="h2" size="xl" textAlign="center" mb={10} color="gray.700">
            Чому обирають нас
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={10}>
            <Feature
              icon={FaShippingFast}
              title="Швидкість та логістика"
              text="Оптимізовані процеси пошуку та доставки контейнерів по всій країні."
            />
            <Feature
              icon={FaChartLine}
              title="Аналітика ринку"
              text="Допомагаємо приймати рішення, ґрунтуючись на актуальних ринкових даних."
            />
            <Feature
              icon={FaHandsHelping}
              title="Експертна підтримка"
              text="Наші фахівці завжди готові допомогти вам із вибором та оформленням."
            />
            <Feature
              icon={FaCheckCircle}
              title="Гарантія якості"
              text="Кожен контейнер проходить перевірку на відповідність міжнародним стандартам."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* 4. Виклик інтегрованого футера */}
      <FooterContent />
    </Box>
  );
}