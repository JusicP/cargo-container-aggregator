// layout imports
import {Field, Input, InputGroup, Text} from "@chakra-ui/react"
import { Stack } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from "react"
import { Button } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"

// form controls $ api
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {loginUserSchema, type loginUser} from "@/schemas/authUserSchema.ts";
import DOMPurify from "dompurify";
import {useSignInUser} from "@/services/api/auth.ts";
import {Envelope} from "@mynaui/icons-react";

export default function LoginForm() {
    const signInUser = useSignInUser()
    const { handleSubmit,register, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginUserSchema),
    })
    const sanitizeInput = (value: string) => DOMPurify.sanitize(value);

    const onSubmit = async (data: loginUser) => {
        try{
            const formData = new FormData();
            formData.append('username', sanitizeInput(data.email));
            formData.append('password', sanitizeInput(data.password));
            console.log(formData);
            await signInUser.mutateAsync(formData);
        } catch (error) {

        }
    }
    const [password, setPassword] = useState("")

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="w-150 flex flex-col items-center gap-3">
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
                        Пароль
                    </Field.Label>
                    <Stack gap="3" className="w-full">
                        <PasswordInput
                            {...register("password")}
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="password"
                            size="xs"
                        />
                    </Stack>
                </Field.Root>
                {errors.password && <Text role="alert" textStyle="xs" color="red.500">{errors.password.message}</Text>}
            </div>

            <Box paddingTop="6">
                <Button
                    type="submit"
                    size="sm"
                    className="w-35 font-thin tracking-[1px]"
                    boxShadow="custom"
                    fontWeight="450"
                >
                    {isSubmitting ? "Вхід..." : "Увійти"}
                </Button>
            </Box>
        </form>
    )
}