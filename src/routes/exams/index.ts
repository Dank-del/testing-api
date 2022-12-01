import { Request, Response } from "express";
import _ from "lodash";
import { Exam } from "../../models/exam";

export const get = async (req: Request, res: Response) => {
    const exams = await Exam.find({});
    const data = exams.map(
        (exam) => _.pick(exam, ['_id', 'name', 'subject', 'duration', 'date', 'totalMarks', 'passingMarks', 'teacher'])
    )
    return res.status(200).json({ message: "Exams found", exams: data });
}