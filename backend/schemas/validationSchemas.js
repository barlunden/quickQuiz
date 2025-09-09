const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  nickname: z.string().min(2, "Nick must be at least 2 characters").max(16, "Nick can not be longer than 16 characters"),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordRepeat: z.string().min(6),
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

const addEntrySchema = z.object({
  title: z.string().min(1).max(20),
  content: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters long" })
    .max(300, { message: "Comment must not be longer than 300 characters." }),
});

const entryParamsSchema = z.object({ entryId: z.string().regex(/^\d+$/) });

module.exports = {
  registerSchema,
  loginSchema,
  addEntrySchema,
  entryParamsSchema,
};
