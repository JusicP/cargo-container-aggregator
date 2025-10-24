import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {registerUserSchema, type registerUser} from "../../schemas/authUserSchema.ts";
import DOMPurify from "dompurify";
import { Field, Input, InputGroup } from "@chakra-ui/react"
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

const strengthOptions: Options<string> = [
    { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
    { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
    { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
    { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
]

export default function RegisterForm() {
    const { handleSubmit,register, formState: { errors } } = useForm({
        resolver: zodResolver(registerUserSchema),
    })
    const sanitizeInput = (value: string) => DOMPurify.sanitize(value);

    const onSubmit = async (data: registerUser) => {
        try{
            const sanitizedEmail = sanitizeInput(data.email);
            const sanitizedPassword = sanitizeInput(data.password);
            console.log(sanitizedEmail, sanitizedPassword);
            //endpoint API call & preprocess data
        } catch (error) {
            
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
                    <Field.Label fontSize="11px">
                        Ім'я користувача <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                        placeholder="username"
                        size="xs"
                    />
                </Field.Root>
            </div>
            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px">
                        Пошта <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup startElement={<Envelope size={13} color="#27272A" />}>
                        <Input
                            {...register("email")}
                            placeholder="email@example.com"
                            size="xs"
                        />
                    </InputGroup>
                </Field.Root>
                {errors.email && <p role="alert">{errors.email.message}</p>}
            </div>

            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px">
                        Пароль <Field.RequiredIndicator />
                    </Field.Label>
                    <Stack gap="3" className="w-full">
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="password"
                            size="xs"
                        />
                        <PasswordStrengthMeter value={strength} />
                    </Stack>
                </Field.Root>
                {errors.password && <p role="alert">{errors.password.message}</p>}
            </div>

            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px">
                        Підтвердити пароль <Field.RequiredIndicator />
                    </Field.Label>
                    <PasswordInput
                        placeholder="password"
                        size="xs"
                    />
                </Field.Root>
            </div>

            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px">
                        Телефон <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup startElement={<Telephone size={13} color="#27272A" />}>
                        <Input
                            placeholder="+380123456789"
                            size="xs"
                        />
                    </InputGroup>
                </Field.Root>
            </div>

            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px">
                        Назва компанії
                    </Field.Label>
                    <InputGroup startElement={<Briefcase size={13} color="#27272A" />}>
                        <Input
                            placeholder="Назва компанії"
                            size="xs"
                        />
                    </InputGroup>
                </Field.Root>
            </div>

            <Box paddingTop="6">
                <Button
                    type="submit"
                    size="sm"
                    className="w-35 font-thin tracking-[1px]"
                >
                    Реєстрація
                </Button>
            </Box>
        </form>
    )
}