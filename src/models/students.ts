import { Schema, model } from 'mongoose';
import { string } from 'zod';

// student interface
export interface IStudent {
    name: string;
    email: string;
    identityHash: string;
    password: string;
    age: number;
}

// student schema
const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    identityHash: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
});

// student model
export const Student = model<IStudent>('Student', studentSchema);
