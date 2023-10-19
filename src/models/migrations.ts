export interface IEntity {
	Totals: ITotals;
	Information: IInformation;
}
export interface IImportSystem {
	Information: IInformation;
}

export interface ITotals {
	ActivityStream?: IEntityList;
	Crm?: ICrm;
	Departments?: IEntityList;
	SonetGroup?: IEntityList;
	TaskList?: ITaskList;
	Users?: IEntityList;
	CompanyList?: IEntityList;
	ContactList?: IEntityList;
	CustomerList?: IEntityList;
	LeadList?: IEntityList;
	ProductList?: IEntityList;
	UserList?: IEntityList;
}

export interface IEntityList {
	Method: string;
	Count: number;
	Time: number;
	Error: string;
	ActivityList?: IActivityList;
}

export interface ICrm {
	Companies: IEntityList;
	ContactList: IEntityList;
	DealList: IEntityList;
	LeadList: IEntityList;
	Method: string;
	Count: number;
	Time: number;
	Error: string;
}

export interface IActivityList {
	Method: string;
	Count: number;
	Time: number;
	Error: string;
}

export interface ITaskList {
	TaskComments?: IEntityList;
	Method: string;
	Count: number;
	Time: number;
	Error: string;
}

export interface IInformation {
	ClientData?: string;
	InitBitrixClient?: string;
	ReadAuthData?: string;
	UnmarshalData?: string;
	IsUserAdmin?: string;
	CreateClient?: string;
	ReadEntities?: string;
}

export interface ITotalNums {
	NumOfEntities: number;
	TotalTime: number;
}

export interface IServicesStatus {
	bitrix24?: IStatus;
	amo?: IStatus;
	kommo?: IStatus;
	pipedrive?: IStatus;
	hubspot?: IStatus;
	zoho?: IStatus;
	trello?: IStatus;
	clickup?: IStatus;
}

export interface IStatus {
	DateComplete?: string;
	DateStart?: string;
	DateStop?: string;
	Progress: number;
	Stop: boolean;
	AllImportTime: number;
	PassedTime: number;
}
