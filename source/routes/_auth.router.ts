import express from 'express';
import { loginCustomer, registerCustomer } from '../controllers/auth.controller';

const router = express.Router();

//PUBLIC
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
export default router;
