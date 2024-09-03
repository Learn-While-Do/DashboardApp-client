export interface ILoginData {
    access_token: string;
    refresh_token: string;
    isAdmin: boolean;
    requiresReset: boolean;
    username: string;
    id: string;
}