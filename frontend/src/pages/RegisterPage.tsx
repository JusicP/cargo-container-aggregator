import RegisterForm from "@/components/authentication/RegisterForm.tsx";
import PageLayout from "@/router/PageLayout.tsx";

export default function RegisterPage() {
    return (
        <PageLayout>
            <div className="bg-white h-screen px-20">
                <RegisterForm />
            </div>
        </PageLayout>
    );
}