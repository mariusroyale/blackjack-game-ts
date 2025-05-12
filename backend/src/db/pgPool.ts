import { Pool } from "pg";

export const pgPool = new Pool({
    connectionString: 'postgresql://postgres.mfgppgqijgahuagqvjai:xUHUEFhuvLPlqESV@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
    max: 10
});