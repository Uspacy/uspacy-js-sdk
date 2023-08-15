import { IDepartment } from '../../../models/department';

export interface IUpdateDepartmentDto extends Omit<IDepartment, 'id'> {}
