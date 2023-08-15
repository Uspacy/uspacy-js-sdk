import { IUser } from '../../../models/user';

export interface IUpdateUserDto extends Omit<IUser, 'id' | 'active' | 'position' | 'roles'> {}
