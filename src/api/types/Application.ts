import type User from './User';

export interface Application {
    ID: string;
    userID: number;
    botID: number;
    name: string;
    redirectURI: string | null;
    createdAt: string;
    updatedAt: string;

    bot?: User;
}
