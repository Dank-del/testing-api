import { Response } from "express";
import { auth, AuthorizedRequest } from "../../middlewares/jwt";
import { Exam } from "../../models/exam";
import _ from 'lodash';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';

export const post = [
    auth,
    async (req: AuthorizedRequest, res: Response) => {
        const { id } = req.params;
        var exam = await Exam.findById(id);
        if (!exam) {
            return res.status(400).json({ message: "Exam not found" });
        }

        if (!req.teacher) {
            const ex = _.pick(exam, ['_id', 'name', 'subject', 'duration', 'date', 'totalMarks', 'passingMarks', 'teacher']);
            return res.status(200).json({ exam: ex });
        }

        return res.status(200).json({ exam: exam.toJSON() });
    }
]

export const put = [
    auth,
    validateRequest({
        body: z.object({
            examId: z.string().min(24).max(24),
            name: z.string().min(3).max(20),
            subject: z.string().min(3).max(20),
            date: z.string(),
            totalMarks: z.number().min(1),
            passingMarks: z.number().min(1),
            duration: z.number().min(1),
        })
    }),
    async (req: AuthorizedRequest, res: Response) => {
        // get the exam to be edited
        const exam = await Exam.findById(req.body.examId);
        if (!exam) {
            return res.status(400).json({ message: "Exam not found" });
        }

        // check if the user is the teacher who created the exam
        if (exam.teacher.toString() !== req.teacher?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // parse the date and check if it is in the past
        const parsedDate = new Date(req.body.date);
        if (parsedDate < new Date()) {
            return res.status(400).json({ message: "Invalid date" });
        }

        // update the exam fields
        exam.name = req.body.name;
        exam.subject = req.body.subject;
        exam.date = req.body.date;
        exam.totalMarks = req.body.totalMarks;
        exam.passingMarks = req.body.passingMarks;
        exam.duration = req.body.duration;

        // save the exam in the database
        await exam.save();
        return res.status(200).json({ message: "Exam updated successfully", exam: exam.toJSON() });
    }
];


