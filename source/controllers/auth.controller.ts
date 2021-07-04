import Customer from '../models/authModels/customer.model';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const JWT_SECRET = 'xyz';

export const registerCustomer = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(422).json({ error: 'Please add all the fields' });
    }

    try {
        const savedCustomer = await Customer.findOne({ email: email });
        if (savedCustomer) {
            return res.status(422).json({ error: 'Already Registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const customerId = `cus-${new Date().getTime()}`;

        const customer = {
            id: customerId,
            email,
            password: hashedPassword
        };
        const newCustomer = new Customer(customer);
        await newCustomer.save();
        res.status(200).json(newCustomer);
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
};

export const loginCustomer = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: 'Please add email and password' });
    }
    try {
        const savedCustomer: any = await Customer.findOne({ email: email });
        if (!savedCustomer) {
            return res.status(422).json({ error: 'Email not found' });
        }
        const matchPassword = await bcrypt.compare(password, savedCustomer.password);

        if (matchPassword) {
            const token = jwt.sign({ _id: savedCustomer._id }, JWT_SECRET);
            const { _id, id, email } = savedCustomer;
            res.json({ token, customer: { _id, id, email } });
        } else {
            res.status(422).json({ error: 'Invalid Email or password' });
        }
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
};
