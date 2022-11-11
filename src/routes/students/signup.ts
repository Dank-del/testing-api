import { Request, Response } from "express";
import { Student } from "../../models/students";
import { studentSignUpSchema } from "../../validation/signup";
import { v4 as uuidv4 } from 'uuid';
import { hashIt } from "../../validation/password";
import { Teacher } from "../../models/teacher";

// sign up students
export const post = async (req: Request, res: Response) => {
    const data = studentSignUpSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ message: JSON.parse(data.error.message)});
    }
    
    const existingStudent = await Student.findOne({ email: data.data.email });
    const teacher = await Teacher.findOne({ email: data.data.email });
    if (teacher){
        return res.status(400).json({ message: "You are a teacher" });
    }
    
    if (existingStudent) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashpwd = await hashIt(data.data.password);

    const student = new Student({
        name: data.data.name,
        email: data.data.email,
        password: hashpwd,
        age: data.data.age,
        identityHash: uuidv4(),
    });
    await student.save();
    return res.status(200).json({ message: 'Student created successfully', student: student.toJSON() });
}