// layout imports
import { Field, Input, InputGroup, Text } from "@chakra-ui/react"
import { Stack } from "@chakra-ui/react"
import { type Options, passwordStrength } from "check-password-strength"
import {
    PasswordInput,
    PasswordStrengthMeter,
} from "@/components/ui/password-input"
import { useMemo, useState } from "react"
import { Button } from "@chakra-ui/react"
import { Envelope, Telephone, Briefcase } from "@mynaui/icons-react";
import { Box } from "@chakra-ui/react"

// form controls & api
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {registerUserSchema, type registerUser} from "@/schemas/authUserSchema.ts";
import DOMPurify from "dompurify";
import {useSignUpUser, type SignUpReqBody} from "@/services/api/auth.ts";

const strengthOptions: Options<string> = [
    { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
    { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
    { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
    { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
]

export default function RegisterForm() {
    const signUpUser = useSignUpUser()
    const { handleSubmit,register, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerUserSchema),
    })

    const sanitizeAll = (data: Record<string, unknown>) =>
        Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                typeof value === "string" ? DOMPurify.sanitize(value) : value,
            ])
        );

    const onSubmit = async (data: registerUser) => {
        try{
            const sanitizedData = sanitizeAll(data);
            const { repeatPassword, ...restData } = sanitizedData;
            const credentials: SignUpReqBody = {
                ...(restData as Omit<SignUpReqBody, "avatar_photo_id" | "role">),
                avatar_photo_id: 0,
                role: "user",
            };
            console.log(credentials);
            await signUpUser.mutateAsync(credentials);
        } catch (error) {
            console.error("Registration error:", error);
        }
    }

    const [password, setPassword] = useState("")
    const strength = useMemo(() => {
        if (!password) return 0
        const result = passwordStrength(password, strengthOptions)
        return result.id
    }, [password])

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="w-150 flex flex-col items-center gap-3">
            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px" fontWeight="bolder">
                        Ім'я користувача <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                        {...register("name")}
                        placeholder="username"
                        size="xs"
                    />
                </Field.Root>
                {errors.name && <Text role="alert" textStyle="xs" color="red.500">{errors.name.message}</Text>}
            </div>
            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px" fontWeight="bolder">
                        Пошта <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup startElement={<Envelope size={13} color="#68686A" />}>
                        <Input
                            {...register("email")}
                            placeholder="email@example.com"
                            size="xs"
                        />
                    </InputGroup>
                </Field.Root>
                {errors.email && <Text role="alert" textStyle="xs" color="red.500">{errors.email.message}</Text>}
            </div>

            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px" fontWeight="bolder">
                        Пароль <Field.RequiredIndicator />
                    </Field.Label>
                    <Stack gap="3" className="w-full">
                        <PasswordInput
                            {...register("password")}
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="password"
                            size="xs"
                        />
                        <PasswordStrengthMeter value={strength} />
                    </Stack>
                </Field.Root>
                {errors.password && <Text role="alert" textStyle="xs" color="red.500">{errors.password.message}</Text>}
            </div>

            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px" fontWeight="bolder">
                        Підтвердити пароль <Field.RequiredIndicator />
                    </Field.Label>
                    <PasswordInput
                        {...register("repeatPassword")}
                        placeholder="password"
                        size="xs"
                    />
                </Field.Root>
                {errors.repeatPassword && <Text role="alert" textStyle="xs" color="red.500">{errors.repeatPassword.message}</Text>}
            </div>

            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px" fontWeight="bolder">
                        Телефон <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup startElement={<Telephone size={13} color="#68686A" />}>
                        <Input
                            {...register("phone_number")}
                            placeholder="+380123456789"
                            size="xs"
                        />
                    </InputGroup>
                </Field.Root>
                {errors.phone_number && <Text role="alert" textStyle="xs" color="red.500">{errors.phone_number.message}</Text>}
            </div>

            <div className="w-[65%]">
                <Field.Root>
                    <Field.Label fontSize="11px" fontWeight="bolder">
                        Назва компанії
                    </Field.Label>
                    <InputGroup startElement={<Briefcase size={13} color="#68686A" />}>
                        <Input
                            {...register("company_name")}
                            placeholder="Назва компанії"
                            size="xs"
                        />
                    </InputGroup>
                </Field.Root>
                {errors.company_name && <Text role="alert" textStyle="xs" color="red.500">{errors.company_name.message}</Text>}
            </div>

            <Box paddingTop="6">
                <Button
                    type="submit"
                    size="sm"
                    className="w-35 font-thin tracking-[1px]"
                    boxShadow="custom"
                    fontWeight="450"
                >
                    {isSubmitting ? "Обробка..." : "Реєстрація"}
                </Button>
            </Box>
        </form>
    )
}