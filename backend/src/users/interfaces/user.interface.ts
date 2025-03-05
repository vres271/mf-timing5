import { UserRole } from "../entities/user.entity";

export class IUser {
  id: string;
  name: string;
  roles: UserRole[];
  email: string;
}