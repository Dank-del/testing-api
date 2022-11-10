import { model, Schema } from "mongoose";

export interface IQuestion {
    question: string;
    options: string[];
    answer: string;
}

// exam interface
export interface IExam {
    name: string;
    subject: string;
    date: Date;
    time: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    questions: IQuestion[];
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
        required: true,
    },
    time: {
        type: String,
        required: true,
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
            question: {
                type: String,
                required: true,
            },
            options: [
                {
                    type: String,
                    required: true,
                },
            ],
            answer: {
                type: String,
                required: true,
            },
        },
    ],
});

// exam model
export const Exam = model<IExam>("Exam", examSchema);