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
  HStack
} from '@chakra-ui/react';
import {
  FaCheckCircle,
  FaShippingFast,
  FaChartLine,
  FaHandsHelping,
} from 'react-icons/fa';
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


export default function AboutUsPage(): React.ReactElement {
  return (
    <Box>
      <Box
        bg="gray.800"
        color="white"
        py={{ base: 12, md: 20 }}
        textAlign="center"
        width="100%"
      >
        <Container maxW="3xl">
          <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" mb={4}>
            Cargo Containers — Усі пропозиції ринку на одній платформі
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.300">
            Перший агрегатор оголошень про продаж та оренду контейнерів. Ми об'єднуємо сотні джерел в єдину зручну базу.
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
              Як це працює?
            </Heading>
            <Text fontSize="lg" mb={6} color="gray.600">
              Ми створили централізований хаб для ринку контейнерів.
              Наша система автоматично збирає оголошення з десятків профільних сайтів,
              а також дозволяє приватним особам та компаніям розміщувати свої пропозиції напряму.
              Більше не потрібно моніторити десятки вкладок — усе є тут.
            </Text>
            <Stack gap={4}>
              <HStack>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontWeight="medium">Єдина база оголошень (Агрегація)</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontWeight="medium">API-інтеграція для великих компаній</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontWeight="medium">Ручне розміщення оголошень для приватних осіб</Text>
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
              title="Розумний пошук"
              text="Наші алгоритми моніторять ринок 24/7, збираючи найактуальніші пропозиції з різних майданчиків в одному місці."
            />
            <Feature
              icon={FaChartLine}
              title="Аналітика ринку"
              text="Допомагаємо приймати рішення, ґрунтуючись на актуальних ринкових даних."
            />
            <Feature
              icon={FaHandsHelping}
              title="Доступність для кожного"
              text="Бажаєте продати один контейнер? Створіть оголошення вручну, натиснувши зверху 'Створити оголошення'."
            />
            <Feature
              icon={FaCheckCircle}
              title="Гарантія якості"
              text="Кожне оголошення проходить перевірку на відповідність правилам."
            />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}