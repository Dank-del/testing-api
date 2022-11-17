import { Request, Response } from "express";
import { auth, AuthorizedRequest } from "../../middlewares/jwt";
import { Exam } from "../../models/exam";
import _ from 'lodash';

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
    }]