import RegisterForm from "@/components/authentication/RegisterForm.tsx";
import PageLayout from "@/router/PageLayout.tsx";
import SvgLogo from "@/components/icons/Logo.tsx";
import {Link, Text, Box} from "@chakra-ui/react";

export default function RegisterPage() {
    return (
        <PageLayout>
            <div className="bg-white h-screen px-20 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                    <SvgLogo width={100} height={100} />
                    <div className="flex flex-col items-center gap-0.5">
                        <h1 className="text-[#52525B] text-[30px] font-black">CONTAINERS</h1>
                        <h3 className="text-[#A7AFB7] text-[15px]">REGISTER</h3>
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