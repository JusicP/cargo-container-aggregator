import {z} from 'zod';

export const registerUserSchema = z.object({
    name: z.string()
        .max(128, {message: "Задовге ім'я"})
        .trim(),
    email: z.string()
        .min(5, { message: "Email занадто короткий" })
        .max(340, { message: "Email задовгий" })
        .email({ message: "Невірний формат email" })
        .toLowerCase()
        .trim(),
    password: z.string()
        .trim()
        .min(6, { message: 'Пароль закороткий' } ) //to be clarified by backend devs
        .max(128, { message: 'Пароль задовгий' }),
    phone_number: z.string()
        .max(16, { message: "Номер телефону задовгий" })
        .trim(),
    company_name: z.string()
        .max(64, { message: "Назва компанії задовга" })
        .optional(),
    repeatPassword: z.string().trim(),
})
    .refine((data) => data.password === data.repeatPassword, {
        message: "Паролі не співпадають",
        path: ["repeatPassword"],
})
export type registerUser = z.infer<typeof registerUserSchema>

export const loginUserSchema = z.object({
    name: z.string()
        .max(128, {message: "Задовге ім'я"})
        .trim(),
    password: z.string()
        .trim()
        .min(6, { message: 'Пароль закороткий' })
        .max(128, { message: 'Пароль задовгий' }),
});

export type loginUser = z.infer<typeof loginUserSchema>;