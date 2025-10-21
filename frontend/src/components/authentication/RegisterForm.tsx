import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {registerUserSchema, type registerUser} from "../../schemas/authUserSchema.ts";
import DOMPurify from "dompurify";

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

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="email">Email</label>
                <input {...register("email")} />
                {errors.email && <p role="alert">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input {...register("password")} />
                {errors.password && <p role="alert">{errors.password.message}</p>}
            </div>

            <div>
                <input type="submit" value="Register"/>
            </div>
        </form>
    )
}