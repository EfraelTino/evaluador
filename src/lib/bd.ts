

import mysql from 'serverless-mysql';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const connection = mysql({
  config: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'landinglab',
  } as any,
});
/* eslint-enable @typescript-eslint/no-explicit-any */
