import { Response } from 'express';
import { auth, AuthorizedRequest } from '../../middlewares/jwt';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { Exam } from '../../models/exam';
import { Teacher } from '../../models/teacher';

export const post = [
    auth,
    validateRequest({
        body: z.object({
            name: z.string().min(3).max(20),
            subject: z.string().min(3).max(20),
            date: z.string(),
            totalMarks: z.number().min(1),
            passingMarks: z.number().min(1),
            duration: z.number().min(1),
        })
    }),
    async (req: AuthorizedRequest, res: Response) => {
        // console.log(req);
        if (!req.teacher) {
            return res.status(400).json({ message: "Teacher not found" });
        }

        const parsedDate = new Date(req.body.date);
        // check if the date is in the past 
        if (parsedDate < new Date()) {
            return res.status(400).json({ message: "Invalid date" });
        }

        const { name, subject, date, totalMarks, passingMarks, duration } = req.body;
        const teacher = await Teacher.findOne({ email: req.teacher.email });
        const exam = new Exam({
            name: name,
            subject: subject,
            date: date,
            totalMarks: totalMarks,
            passingMarks: passingMarks,
            teacher: teacher?._id,
            duration: duration,
        });


        await exam.save();
        return res.status(200).json({ message: "Exam created successfully", exam: exam.toJSON() });
    }];