import * as z from "zod"

const RegisterAuth = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
})

const LoginAuth = z.object({
  email: z.email(),
  password: z.string().min(1),
})

const RefreshAuth = z.object({
  refreshToken: z.string()
})

export { RegisterAuth, LoginAuth, RefreshAuth }
