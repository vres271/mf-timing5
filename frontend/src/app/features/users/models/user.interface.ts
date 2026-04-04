import { IUserDTO } from "../../../core/models/user.interface";

export interface IUserCreateDTO extends Omit<IUserDTO, 'id'> {
}

export interface IUserUpdateDTO extends Partial<IUserCreateDTO> {
}