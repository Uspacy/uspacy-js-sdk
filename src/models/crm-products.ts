import { IMeta } from './crm-entities';
import { IFile } from './files';

export interface IProducts {
	data: IProduct[];
	meta: IMeta;
	aborted: boolean;
}

export interface IProductPrice {
	price: number | string;
	currency: string;
	tax_id: number;
	is_tax_included: number;
	tax?: {
		id: number;
		name: string;
		rate: number;
		is_active: number;
		created_at: number;
		updated_at: number;
	};
}

export interface IProduct {
	id: number;
	product_category_id: number;
	measurement_unit_id: number;
	title: string;
	type: 'goods' | 'service' | '';
	article: string;
	is_active: boolean;
	availability: 'available' | 'pending' | 'not_available' | '';
	quantity: number;
	reserved_quantity: number;
	description: string;
	comment: string;
	prices: IProductPrice[];
	remainder?: number;
	created_at?: number;
	updated_at?: number;
	productLink?: string;
	measurement_unit?: {
		abbr: string;
	};
	preview_image_id: number;
	file_ids?: number[];
	files?: IFile[];
}
