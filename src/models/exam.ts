import { model, Schema } from "mongoose";
import { number } from "zod";
import { ITeacher } from "./teacher";

export interface IOption {
    data: string;
    isCorrect: boolean;
}

export interface IQuestion {
    id: string;
    question: string;
    options: IOption[];
    // answer: IOption['id'];
}

// exam interface
export interface IExam {
    name: string;
    subject: string;
    date?: Date;
    //timeMinutes: number;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    questions: IQuestion[];
    teacher: ITeacher;
}


// exam schema
const examSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: false,
    },
    timeMinutes: {
        type: Number,
        required: false,
    },
    duration: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    passingMarks: {
        type: Number,
        required: true,
    },
    questions: [
        {
            id: {
                type: String,
                required: true,
            },
            question: {
                type: String,
                required: false,
            },
            options: [
                {
                    isCorrect: {
                        type: Boolean,
                        required: false,
                        default: false
                    },
                    data: {
                        type: String,
                        required: true,
                    },
                },
            ],
            // answer: {
            //     type: String,
            //     required: true,
            // },
        },
    ],
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    }
});

// exam model
export const Exam = model<IExam>("Exam", examSchema);