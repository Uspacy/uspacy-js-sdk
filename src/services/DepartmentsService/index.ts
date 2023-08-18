import { AxiosResponse } from 'axios';
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IDepartment } from '../../models/department';
import { IResponseWithPagination } from '../../models/response';
import { ICreateDepartmentDto } from './dto/create-department.dto';
import { IUpdateDepartmentDto } from './dto/update-department.dto';

/**
 * Departments service
 */
@injectable()
export class DepartmentsService {
	private namespace = 'company/v1/departments';
	constructor(private httpClient: HttpClient) {}

	/**
	 * Get departments list
	 * @param page page number
	 * @param list elements count
	 * @param show get list of with unactive departments (available only for admin or owner)
	 * @returns Array departments
	 */
	getDepartments(page?: number, list?: number, show?: 'all'): Promise<AxiosResponse<IResponseWithPagination<IDepartment>>>;
	getDepartments(page?: number, list?: 'all', show?: 'all'): Promise<AxiosResponse<IDepartment[]>>;
	getDepartments(page?: number, list?: number | 'all', show?: 'all') {
		if (list === 'all') {
			return this.httpClient.client.get<IDepartment[]>(this.namespace, {
				params: {
					page,
					list,
					show,
				},
			});
		}
		return this.httpClient.client.get<IResponseWithPagination<IDepartment>>(this.namespace, {
			params: {
				page,
				list,
				show,
			},
		});
	}

	/**
	 * Create department
	 * @returns
	 */
	createDepartment(body: ICreateDepartmentDto) {
		return this.httpClient.client.post<IDepartment>(this.namespace, body);
	}

	/**
	 * Get department by id
	 * @param id department id
	 * @returns departament
	 */
	getDepartmentById(id: string) {
		return this.httpClient.client.get<IDepartment>(`${this.namespace}/:id/`, {
			urlParams: {
				id,
			},
		});
	}

	/**
	 * Update department data (set head department, move users, set parent department)
	 * @param id department ID
	 * @param body department data
	 * @returns updated department data
	 */
	updateDepartment(id: IDepartment['id'], body: IUpdateDepartmentDto) {
		return this.httpClient.client.patch<IDepartment>(`${this.namespace}/:id/`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Delete department.
	 * @param id departament ID
	 * @returns
	 */
	deleteDepartment(id: string) {
		return this.httpClient.client.delete<IDepartment>(`${this.namespace}/:id/`, {
			urlParams: { id },
		});
	}

	/**
	 * Update department roles by id
	 * @param id departament ID
	 * @param roles roles
	 * @returns
	 * @deprecated
	 */
	updateDepartmentRolesById(id: string, roles: string[]) {
		return this.httpClient.client.patch<IDepartment>(`${this.namespace}/:id/updateRoles/`, roles, { urlParams: { id } });
	}

	/**
	 * Update department roles by id
	 * @param id departament ID
	 * @param users users ids
	 * @returns
	 */
	addUsersToDepartment(id: string, users: IDepartment['usersIds']) {
		return this.httpClient.client.patch<IDepartment>(`${this.namespace}/:id/addUsers/`, users, { urlParams: { id } });
	}

	/**
	 * Update department roles by id
	 * @param id departament ID
	 * @param users users ids
	 * @returns
	 */
	deleteUsersFromDepartment(id: string, users: IDepartment['usersIds']) {
		return this.httpClient.client.patch<IDepartment>(`${this.namespace}/:id/deleteUsers/`, users, { urlParams: { id } });
	}
}
