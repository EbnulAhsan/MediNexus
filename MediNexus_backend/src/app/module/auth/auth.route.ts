import { NextFunction, Request, Response, Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { AuthController } from "./auth.controller";
import { PatientValidation } from "./auth.validation";

const router = Router();

router.post("/register",

	(req: Request, _res: Response, next: NextFunction) => {

		try {

			const payload = req.body ?? {}

			const result = PatientValidation.PatientRegistrationZodSchema.safeParse(payload)

			if (!result.success) {
				console.log(result.error)
				console.log(result.error.issues)

				throw new Error(result.error.issues[0].message)
			}

			req.body = result.data


			next()

		} catch (error) {
			next(error)
		}






	},












	AuthController.registerPatient);

router.post("/login", AuthController.loginUser);

router.post("/google", AuthController.googleLogin);

router.get(
	"/me",
	auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
	AuthController.getMe,
);
router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
