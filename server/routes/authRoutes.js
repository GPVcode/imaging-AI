import express from "express";
const router = express.Router();
import controller from '../controllers/controller.js'

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);
// router.get('/protected-resource', controller.requireAuthorization
    // req.userId is set by the auth middleware
    // const userId = req.userId;

    // Here you can access the user's ID and return appropriate data
    // res.json({ message: 'You have access to this protected resource.', userId });
// );
export default router;