import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	NextFunction,
	type Application,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import z, { email } from "zod";
import { RedisSentinel } from "redis";
import { redisClient } from "./app/lib/redis";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);

// building zod function

app.get("/test", async (req: Request, res: Response, next: NextFunction) => {

	try {
		await redisClient.set("forgot-password-otp:patient1@gmail.com", "123456", {
			expiration: {
				type: "EX",
				value: 5 * 60,
			}
		})




		res.status(httpStatus.OK).json({
			success: true,
			message: "Welcome to MediNexus Healthcare System Backend",
			data: null
		});
	} catch (error) {
		console.log(error)
		next(error)

	}

})






// Basic route
app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to MediNexus Healthcare System Backend",
	});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
