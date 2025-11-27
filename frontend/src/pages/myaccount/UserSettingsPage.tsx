import { useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";

export default function UserSettingsPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  return (
    <Box className="p-6 flex flex-col gap-10">

      <Box className="flex flex-col gap-2">
        <Text fontSize="xl" fontWeight="bold">
          Змінити Email
        </Text>

        <Input
          placeholder="Введіть новий email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          w="300px"
        />

        <Button
          bg="#1a1a1a"
          color="white"
          w="200px"
          onClick={() => console.log("New email:", email)}
        >
          Зберегти
        </Button>
      </Box>

      <Box className="border-b" />

      <Box className="flex flex-col gap-2">
        <Text fontSize="xl" fontWeight="bold">
          Змінити номер телефону
        </Text>

        <Input
          placeholder="Введіть новий номер"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          w="300px"
        />

        <Button
          bg="#1a1a1a"
          color="white"
          w="200px"
          onClick={() => console.log("New phone:", phone)}
        >
          Зберегти
        </Button>
      </Box>

      <Box className="border-b" />

      <Box className="flex flex-col gap-2">
        <Text fontSize="xl" fontWeight="bold">
          Змінити пароль
        </Text>

        <Input
          type="password"
          placeholder="Поточний пароль"
          value={passwordOld}
          onChange={(e) => setPasswordOld(e.target.value)}
          w="300px"
        />
        <Input
          type="password"
          placeholder="Новий пароль"
          value={passwordNew}
          onChange={(e) => setPasswordNew(e.target.value)}
          w="300px"
        />
        <Input
          type="password"
          placeholder="Повторіть новий пароль"
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
          w="300px"
        />

        <Button
          bg="#1a1a1a"
          color="white"
          w="200px"
          onClick={() =>
            console.log({
              old: passwordOld,
              new: passwordNew,
              repeat: passwordRepeat,
            })
          }
        >
          Зберегти
        </Button>
      </Box>

    </Box>
  );
}
