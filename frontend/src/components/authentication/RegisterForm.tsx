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
        <form onSubmit={handleSubmit(onSubmit)} className="w-80 px-20">
            <div>
                <Field.Root required>
                    <Field.Label>
                        Email <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup endAddon=".com">
                        <Input
                            {...register("email")}
                            placeholder="email@email"
                            size="sm"
                        />
                    </InputGroup>
                </Field.Root>
                {errors.email && <p role="alert">{errors.email.message}</p>}
            </div>

            <div>
                <Field.Root required>
                    <Field.Label>
                        Password <Field.RequiredIndicator />
                    </Field.Label>
                    <Stack gap="3" className="w-full">
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="Enter your password"
                            size="sm"
                        />
                        <PasswordStrengthMeter value={strength} />
                    </Stack>
                </Field.Root>
                {errors.password && <p role="alert">{errors.password.message}</p>}
            </div>

            <Button
                type="submit"
            >
                Реєстація
            </Button>
        </form>
    )
}