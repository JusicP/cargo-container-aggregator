import {z} from 'zod';

export const registerUserSchema = z.object({
    email: z.string()
        .min(5)
        .email()
        .toLowerCase()
        .trim(),
    password: z.string()
        .trim()
        .min(6, { message: 'Password must be at least 6 characters' } ) //to be clarified by backend devs
        .max(12, { message: 'Password must be not more than 12 characters' }) //to be clarified by backend devs
})
export type registerUser = z.infer<typeof registerUserSchema>