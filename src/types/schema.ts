import z from 'zod';

export const userSchema = z.object({
    username: z.string().min(3, { message: 'username must be at least 3 characters'}).max(10,
        { message: 'username should not be more than 10 characters'}),
    password: z.string()
    .min(8).max(20)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/ ,
        {message: 'Password must have one uppercae, one lowercase and one special character'})
});

export type userInterface = z.infer<typeof userSchema>