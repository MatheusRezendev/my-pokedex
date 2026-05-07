import { db } from '../database/sqlite';

type UserRow = {
    id: number;
    email: string;
    password: string;
    created_at: string;
};

export function validateLogin(
    email: string,
    password: string
) : boolean {
    const user = db.getFirstSync<UserRow>(
        `SELECT * FROM users 
         WHERE email = ? AND password = ?
         LIMIT 1;
        `,
        [email, password]
    );

    return Boolean(user);
}

