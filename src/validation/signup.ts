import z from "zod";

// student schema
export const studentSignUpSchema = z.object({
    name: z.string().min(3).max(20),
    // rollNo: z.number().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    age: z.number().min(1).max(50),
});

export const teacherSignUpSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    age: z.number().min(1).max(50),
    subject: z.string().min(3).max(20),
});