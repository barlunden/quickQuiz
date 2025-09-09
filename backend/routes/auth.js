const express = require('express');
const router = express.Router();
const prisma = require('../db');

const { z } = require('zod');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;
const { validateBody } = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema } = require('../schemas/validationSchemas');

router.post('/register', validateBody(registerSchema), async (req, res) => {
    const { fullName, nickname, email, password, passwordRepeat} = req.body;

    if (!email || !password || !fullName ||!nickname || !passwordRepeat) {
        res.status(400).json({ error: "Please fill in all the fields before registering!"});
        return;
    }

    if (password !== passwordRepeat) {
        res.status(400).json({ error: "Your passwords do not match!" });
        return;
    }

    try {
        console.log(req.body);
        const existingUser = await prisma.user.findUnique({ where: { email} });
        if (existingUser) {
            res.status(409).json({ error: "You have registered this email before. Pleas log in!"});
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                fullName: fullName,
                nickname: nickname,
            },
        });
        res.status(201).json({ success: "Your account has been created with " + email});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong, try again later!" });
        return;
    }
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
    const loginData = req.body;

    if (!loginData.email || !loginData.password) {
        res.status(400).json({ error: "You've left empty fields!" });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { email: loginData.email },
    });

    if (!user) {
        res.status(401).json({ error: "An account with that email does not exist. Pleas register an account."});
        return;
    }

    const valid = await bcrypt.compare(loginData.password, user.password);

    if (!valid) {
        res.status(401).json({ error: "Your password is incorrect." });
        return;
    }

    const { password, ...safeUser } = user;
    res.json({
        token: jwt.sign({ userId: user.id}, process.env.SECRET_KEY, {
            expiresIn: "1h",
        }),
        user: safeUser,
    })
})
/* router.post('/login', ...); */


module.exports = router;