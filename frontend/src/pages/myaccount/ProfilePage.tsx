import { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Icon, Image, Input, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/contexts/AuthContext";
import { FaCalendarAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { privateAxiosInstance } from "@/services/axiosInstances";


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [avatarPhotoId, setAvatarPhotoId] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {user} = useAuth();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone_number ?? "",
        company: user.company_name ?? "",
      });
      if (user.avatar_photo_id) {
        setAvatarPhotoId(user.avatar_photo_id);
        setAvatarUrl(`${import.meta.env.VITE_SERVER_URL}/user/photo/${user.avatar_photo_id}`);
      }
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await privateAxiosInstance.post<{ photo_id: number }>("/user/uploadphoto", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const id = res.data.photo_id;
      setAvatarPhotoId(id);
      setAvatarUrl(`${import.meta.env.VITE_SERVER_URL}/user/photo/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      await privateAxiosInstance.put("/users/me", {
        name: form.name || user.name,
        email: form.email || user.email,
        phone_number: form.phone || user.phone_number,
        company_name: form.company || null,
        avatar_photo_id: avatarPhotoId ?? null,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box w="100%" py={10}>
      <Flex
        direction="column"
        w={{ base: "95%", lg: "75%" }}
        mx="auto"
        bg="white"
        gap={8}
      >
        <Flex 
          direction={{ base: "column", md: "row" }} 
          gap={8} 
          align="flex-start" 
          w="100%"
        >
          
          <Flex direction="column" align="center" gap={3}>
            <Image
              src={avatarUrl || "https://bit.ly/broken-link"}
              fallbackSrc="https://via.placeholder.com/200"
              alt="avatar"
              boxSize="200px"
              objectFit="cover"
              rounded="md"
              bg="gray.300"
              flexShrink={0}
              // На мобільному центруємо фото
              alignSelf={{ base: "center", md: "flex-start" }} 
            />
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              display="none"
            />
          </Flex>

          <Flex direction="column" flex="1" gap={2} w="100%">
            
            <Text fontSize="4xl" fontWeight="normal" lineHeight="1">
              {user.name}
            </Text>

            <HStack color="gray.500" fontSize="md" mb={2}>
              <Icon as={FaCalendarAlt} />
              <Text>зареєстровано {user.registration_date}</Text>
            </HStack>

            {isEditing ? (
              <Input
                name="company"
                value={form.company}
                onChange={handleInput}
                placeholder="Введіть назву компанії"
                mt={2}
                maxW="400px"
              />
            ) : (
              <Box mt={2}>
                 <Text fontSize="4xl" fontWeight="normal" lineHeight="1">
                  {user.company_name || "-"}
                </Text>
              </Box>
            )}

          </Flex>
        </Flex>

        <Flex w="100%" justify="left"> 
          <VStack w="100%" maxW="350px" gap={3}>
            <Button 
              w="100%" 
              bg="#1a1a1a" 
              color="white" 
              _hover={{ bg: "gray.800" }}
              height="50px"
              onClick={() => fileInputRef.current?.click()}
            >
              Додати фото
            </Button>
            
            <Button
              w="100%"
              bg="#1a1a1a"
              color="white"
              _hover={{ bg: "gray.800" }}
              height="50px"
              onClick={() => {
                if (isEditing) {
                  saveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
              isLoading={isSaving}
            >
              {isEditing ? "Зберегти" : "Редагувати дані"}
            </Button>
          </VStack>
        </Flex>

        <Flex align="center" gap={4} w="100%" mt={2}>
           <Text color="gray.300" fontSize="xl" whiteSpace="nowrap">
             Контактна інформація
           </Text>
           <Box h="1px" bg="gray.300" flex="1" />
        </Flex>

        <Box w="100%">
          <Flex direction="column" gap={4}>
            
            <Flex align="center">
              <HStack w="150px" color="gray.500" gap={3}>
                <Icon as={FaPhoneAlt} />
                <Text fontSize="lg">Телефон:</Text>
              </HStack>
              {isEditing ? (
                <Input name="phone" value={form.phone} onChange={handleInput} maxW="300px" />
              ) : (
                <Text fontSize="lg" color="gray.600">{user.phone_number}</Text>
              )}
            </Flex>

            <Flex align="center">
              <HStack w="150px" color="gray.500" gap={3}>
                <Icon as={FaEnvelope} />
                <Text fontSize="lg">Email:</Text>
              </HStack>
              {isEditing ? (
                <Input name="email" value={form.email} onChange={handleInput} maxW="300px" />
              ) : (
                <Text fontSize="lg" color="gray.600">{user.email}</Text>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
