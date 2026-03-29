/**
 * schemas/auth.schema.ts
 *
 * Defines and exports validation schemas for authentication forms
 * using Zod — a TypeScript-first schema validation library.
 */

import * as z from "zod"


/**
 * SIGN UP SCHEMA
 * 
 * Validates the data submitted from the registration form.
 * Zod checks each field against its rules and collects all errors at once.
 */
export const signUpSchema = z.object({
    name: z
        .string()
        .min(1, { error: "Name is required" })
        .max(30, { error: "Name must be under 30 characters" }),

    // Zod's built-in email validator — checks format like "x@y.z"
    // Note: z.email() is a top-level method in Zod v4, not z.string().email()
    email: z
        .email({ error: "Please provide an valid email" }),

    password: z
        .string()
        .min(6, { error: "Password must be 6 characters long" })
        .max(16, { error: "Password must be under 16 characters" }),

    // Raw confirmation input — only checked for presence here,
    // the actual match check happens below in .refine()
    passwordConfirmation: z
        .string()
        .min(1, { error: "Confirmation password is required" })

})
/**
 * CROSS-FIELD VALIDATION via .refine()
 * 
 * .refine() runs AFTER all individual field validations pass.
 * It receives the entire parsed object so you can compare multiple fields.
 * 
 * - First arg : a function that returns true (valid) or false (invalid)
 * - Second arg: the error to attach if the check fails
 *   `path: ["passwordConfirmation"]` pins the error to that specific field
 *    so form libraries (like React Hook Form) know which input to highlight
 */
.refine(
    (data) => data.password === data.passwordConfirmation, 
    { error: "Password don't match", path: ["passwordConfirmation"] }
)


/**
 * SIGN IN SCHEMA
 * Simpler — just validates login credentials.
 * No cross-field checks needed here.
 * 
 * Field is named "identifire" (likely meant "identifier") —
 * currently only accepts email format, but the name suggests
 * it could later support username too by swapping to z.string()
 */
export const signInSchema = z.object({
    identifire: z
        .email({ error: "Please provide an valid email" }),
    password: z
        .string()
        .min(6, { error: "Password must be 6 characters long" })
        .max(16, { error: "Password must be under 16 characters" }),
})


/**
 * INFERRED TYPES
 * 
 * z.infer<typeof schema> extracts a TypeScript type directly from the schema.
 * You never manually write these types — Zod derives them automatically.
 * 
 * SignUpData = {
 *   name: string
 *   email: string
 *   password: string
 *   passwordConfirmation: string
 * }
 * 
 * SignInData = {
 *   identifire: string
 *   password: string
 * }
 * 
 * Use these as the type for:
 *   - React Hook Form's useForm<SignUpData>()
 *   - API route handler req.body
 *   - Any function that receives validated form data
 */
export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>
