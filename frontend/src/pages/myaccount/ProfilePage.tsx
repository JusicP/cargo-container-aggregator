import { useState } from "react";
import { Box, Button, Image, Input, Text } from "@chakra-ui/react";

// Тимчасовий користувач !!!!!!!!
const mockUser = {
  username: "Username",
  company: "Company name",
  registered_at: "2025-01-12",
  phone: "+380000000000",
  email: "example@email.com",
  avatar: null as string | null,
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    company: mockUser.company,
    phone: mockUser.phone,
    email: mockUser.email,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box className="p-6 flex flex-col gap-6">

      <Box className="flex gap-8 items-start">
        
        <Image
          src={mockUser.avatar ?? "https://via.placeholder.com/200?text=Avatar"}
          alt="avatar"
          className="w-[160px] h-[160px] object-cover rounded-md bg-gray-200"
        />

        <Box className="flex flex-col gap-2">

          <Text fontSize="2xl" fontWeight="bold">
            {mockUser.username}
          </Text>

          {isEditing ? (
            <Input
              name="company"
              value={form.company}
              onChange={handleInput}
              placeholder="Введіть назву компанії"
              w="300px"
            />
          ) : (
            <Text fontSize="lg">{mockUser.company}</Text>
          )}

          <Text fontSize="sm" color="gray.500">
             зареєстровано {mockUser.registered_at}
          </Text>

          <Box className="flex flex-col gap-2 mt-4">
            <Button bg="#1a1a1a" color="white" w="200px">
              Додати фото
            </Button>

            <Button
              bg="#1a1a1a"
              color="white"
              w="200px"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Зберегти" : "Редагувати дані"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="border-b my-4" />

      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Контактна інформація
        </Text>

        <Box className="flex flex-col gap-4">

          <Box className="flex items-center gap-4">
            <span className="text-2xl">📞</span>
            {isEditing ? (
              <Input
                name="phone"
                value={form.phone}
                onChange={handleInput}
                placeholder="Введіть номер телефону"
                w="260px"
              />
            ) : (
              <Text>{mockUser.phone}</Text>
            )}
          </Box>

          <Box className="flex items-center gap-4">
            <span className="text-2xl">✉️</span>
            {isEditing ? (
              <Input
                name="email"
                value={form.email}
                onChange={handleInput}
                placeholder="Введіть email"
                w="260px"
              />
            ) : (
              <Text>{mockUser.email}</Text>
            )}
          </Box>

        </Box>
      </Box>

    </Box>
  );
}
