export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    permission: 'admin' | 'regular_user';
}