import { Injectable } from '@angular/core';
import { BaseCrudService } from './../../core/services/base-crud.service';
import { ApiService } from './../../core/services/api.service';
import { 
  IUserCreateDTO, IUserUpdateDTO 
} from './models/user.interface';
import { ApiUrl } from '../../api.urls';
import { IUser, IUserDTO } from '../../core/models/user.interface';

@Injectable()
export class UsersService extends BaseCrudService<IUser, IUserDTO> {
  constructor(api: ApiService) {
    super(api, ApiUrl.Users);
  }

  fromDTO(dto: IUserDTO): IUser {
    return {
      ...dto
    };
  }

  toCreateDTO(user: IUser): IUserCreateDTO {
    return {
      ...user
    };
  }

  toUpdateDTO(user: Partial<IUser>): IUserUpdateDTO {
    const dto: IUserUpdateDTO = {};
    if (user.name !== undefined) dto.name = user.name;
    if (user.roles !== undefined) dto.roles = user.roles;
    return dto;
  }
}