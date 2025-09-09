require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth')
const quizRoutes = require('./routes/quiz')

const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
 
app.listen(4000, () => console.log('Server Running on Port 4000!'));