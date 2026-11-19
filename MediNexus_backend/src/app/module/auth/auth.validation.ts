import z from "zod";

const PatientRegistrationZodSchema = z.object({
    name: z.string("not a string ").min(5).max(15),
    email: z.email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be at most 32 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    patient: z.object({
        contactNumber: z.string().optional(),

    }).optional()
});


export const PatientValidation = {
    PatientRegistrationZodSchema
}