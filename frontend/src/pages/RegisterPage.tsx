import RegisterForm from "@/components/authentication/RegisterForm.tsx";
import PageLayout from "@/router/PageLayout.tsx";
import SvgLogo from "@/components/icons/Logo.tsx";

export default function RegisterPage() {
    return (
        <PageLayout>
            <div className="bg-white h-screen px-20">
                <div className="flex flex-col items-center">
                    <SvgLogo width={100} height={100} />
                    <h1>CONTAINERS</h1>
                    <h3>REGISTER</h3>
                </div>
                <RegisterForm />
            </div>
        </PageLayout>
    );
}