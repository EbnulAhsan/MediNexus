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
};
