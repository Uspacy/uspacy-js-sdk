import { IProduct } from './crm-products';

export interface IProductInfoForEntity {
	id: number;
	entity_type: string;
	entity_id: number;
	is_automatic_calculation: number;
	amount_before_discount_and_tax: number;
	amount_discount: number;
	amount_tax: number;
	amount_before_tax: number;
	amount_total: number;
	list_products: IProductForEntity[];
}

export interface IProductForEntity {
	createType?: 'new' | 'local' | 'product' | '';
	id: number;
	title: string;
	price: number;
	currency: string;
	quantity: number;
	measurement_unit_abbr: string;
	discount_value: number;
	discount_type: 'relative' | 'absolute';
	discount_price: number;
	tax_rate: number;
	is_tax_included: number;
	amount: number;
	created_at: number;
	updated_at: number;
	product: IProduct | null;
	product_id?: number;
	price_type_id: number;
}

export interface IProductForEntityCreate {
	entity_product_list_id: number;
	product_id: number;
	title: string;
	price: number;
	currency: string;
	quantity: number;
	measurement_unit_abbr: string;
	discount_value: number;
	discount_type: 'relative' | 'absolute';
	discount_price: number;
	tax_rate: number;
	is_tax_included: number;
	amount: number;
	price_type_id: number;
}
