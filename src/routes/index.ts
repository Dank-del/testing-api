import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
    return res.json({ message: 'Hello World!' });
}