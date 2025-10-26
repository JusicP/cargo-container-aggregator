import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {registerUserSchema, type registerUser} from "../../schemas/authUserSchema.ts";
import DOMPurify from "dompurify";
import { Field, Input, InputGroup } from "@chakra-ui/react"
import { Stack } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from "react"
import { Button } from "@chakra-ui/react"
import { Envelope } from "@mynaui/icons-react";
import { Box } from "@chakra-ui/react"

export default function LoginForm() {
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

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="w-150 flex flex-col items-center gap-3">
            <div className="w-[65%]">
                <Field.Root required>
                    <Field.Label fontSize="11px" fontWeight="bolder">
                        Пошта
                    </Field.Label>
                    <InputGroup startElement={<Envelope size={13} color="#68686A" />}>
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
                    <Field.Label fontSize="11px" fontWeight="bolder">
                        Пароль
                    </Field.Label>
                    <Stack gap="3" className="w-full">
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="password"
                            size="xs"
                        />
                    </Stack>
                </Field.Root>
                {errors.password && <p role="alert">{errors.password.message}</p>}
            </div>

            <Box paddingTop="6">
                <Button
                    type="submit"
                    size="sm"
                    className="w-35 font-thin tracking-[1px]"
                    boxShadow="custom"
                    fontWeight="450"
                >
                    Реєстрація
                </Button>
            </Box>
        </form>
    )
}