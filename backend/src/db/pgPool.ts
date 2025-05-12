import { Pool } from "pg"
import { config } from "dotenv"
import path from "path"


// we need to load the .env file for non-production environments
if (process.env.NODE_ENV !== "skip-env-loading") {
    const result = config({
        path: path.resolve(__dirname, "../../.env"), // Look for .env one level up from /src
    })
}

export const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10
})