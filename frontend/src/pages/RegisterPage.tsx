import RegisterForm from "@/components/authentication/RegisterForm.tsx";
import PageLayout from "@/router/PageLayout.tsx";
import SvgLogo from "@/components/icons/Logo.tsx";
import {Link, Text, Box} from "@chakra-ui/react";

export default function RegisterPage() {
    return (
        <PageLayout>
            <div className="bg-white h-screen px-20 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center !mb-5">
                    <SvgLogo width={100} height={100} />
                    <div className="flex flex-col items-center leading-tight">
                        <Text
                            fontSize="27px"
                            fontWeight="semibold"
                            color="#52525B"
                            fontFamily="heading"
                            letterSpacing="tight"
                        >
                            CONTAINERS
                        </Text>
                        <Text
                            fontSize="12px"
                            fontWeight="semibold"
                            color="#A7AFB7"
                            className="!-mt-2"
                            fontFamily="heading"
                        >
                            REGISTRATION
                        </Text>
                    </div>
                </div>
                <RegisterForm />
                <Box paddingTop="6" className="flex flex-col items-center gap-0.5">
                    <Text textStyle="xs" color="gray.400">
                        Вже маєш акаунт на платформі?
                    </Text>
                    <Link
                        href="#"
                        variant="underline"
                        textStyle="xs"
                        color="gray.400"
                    >
                        Увійти
                    </Link>
                </Box>
            </div>
        </PageLayout>
    );
}