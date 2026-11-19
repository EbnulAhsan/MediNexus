import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const requireEnv = (name: string): string => {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};

export default {
	node_env: process.env.NODE_ENV,

	port: process.env.PORT,

	database_url: process.env.DATABASE_URL,

	bak_url: process.env.APP_URL,

	frontend_url: process.env.FRONTEND_URL,

	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

	jwt_access_secret: requireEnv("JWT_ACCESS_SECRET"),

	jwt_refresh_secret: requireEnv("JWT_REFRESH_SECRET"),

	jwt_access_expires_in: requireEnv("JWT_ACCESS_EXPIRES_IN"),

	jwt_refresh_expires_in: requireEnv("JWT_REFRESH_EXPIRES_IN"),

	google_client_id: process.env.GOOGLE_CLIENT_ID,


	super_admin_name: process.env.SUPER_ADMIN_NAME!,

	super_admin_email: process.env.SUPER_ADMIN_EMAIL!,

	super_admin_password: process.env.SUPER_ADMIN_PASSWORD!,

	tester_admin_name: process.env.TESTER_ADMIN_NAME || "Tester Admin 1",

	tester_admin_email: process.env.TESTER_ADMIN_EMAIL || "testeradmin@gmail.com",

	tester_admin_password: process.env.TESTER_ADMIN_PASSWORD || "Tester@admin12345",

	tester_doctor_name: process.env.TESTER_DOCTOR_NAME || "Tester Doctor 1",

	tester_doctor_email: process.env.TESTER_DOCTOR_EMAIL || "testerdoctor@gmail.com",

	tester_doctor_password: process.env.TESTER_DOCTOR_PASSWORD || "Tester@doctor12345"
};
