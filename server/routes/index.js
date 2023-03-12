import express from 'express';
import token from 'policies/token';
import orders from './orders';
// ...

const router = express.Router();

// Bonus: you can split this /routes folder in 2: private and public.
// In the private index.js file you would precede all routes declaration
// with a function that checks if the authentication token is present
// in all requests and it's valid.
router.use(token);
router.use(orders);

export default router;