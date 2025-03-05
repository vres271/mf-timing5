import { UserRole } from "src/users/entities/user.entity";

export interface ITokenPayload {
    username: string,
    sub: string, 
    roles: UserRole[]
}