import { IFile } from './files';

export interface IExternalLine {
	externalId: string;
	icon: string;
	id: string;
	name: string;
	phoneNumber: string;
	portal: string;
	timestamp: number;
}

export enum MessageType {
	DEFAULT = 'MESSAGE',
	AUDIO = 'AUDIO',
	VOICE = 'VOICE',
	VIDEO = 'VIDEO',
	GIF = 'GIF',
}

export enum ERelationsEntity {
	LEAD = 'lead',
	CONTACT = 'contact',
	DEAL = 'deal',
}

export enum ERelationsAction {
	CREATE = 'create',
}

export interface IRelations {
	action: ERelationsAction;
	service: string;
	entity: ERelationsEntity;
	name: string;
	entityId: number;
}

export enum EActiveEntity {
	CHATS = 'chats',
	CONTACTS = 'contacts',
	ACTIVE_EXTERNAL = 'activeExternal',
	UNDISTRIBUTED_EXTERNAL = 'undistributedExternal',
	INACTIVE_EXTERNAL = 'inactiveExternal',
}

export enum EMetaEntity {
	POST = 'post',
	STORY = 'story',
	REEL = 'reel',
}

export enum EMetaType {
	COMMENT = 'comment',
	REACTION = 'reaction',
	DEFAULT = 'default',
}

export enum EMessageStatus {
	SENT = 'sent',
	DELIVERED = 'delivered',
	READ = 'read',
	ERROR = 'error',
}

export interface IMessage {
	id: string;
	timestamp: number;
	updateTimestamp?: number;
	authorId: number;
	message: string;
	type: MessageType;
	chatId: string;
	parentMessage?: IMessage;
	refrenceId?: string;
	attachedFiles?: IFile[];
	readBy: number[];
	isFirstUnread?: boolean;
	showTime?: boolean;
	mentioned: number[];
	externalLine?: IExternalLine | string;
	externalAuthorId?: string;
	relations?: IRelations[];
	status?: EMessageStatus;
	statusText?: string;
	ref?: {
		chatId: string;
		authorId: number;
		refMessageId: string;
	};
	meta?: {
		entity: EMetaEntity;
		type: EMetaType;
		accountName: string;
		accountImage: string;
		eventType?: string;
		body: {
			text: string;
			attachedFiles: { url: string; type: string }[];
			url: string;
		};
	};
}

export enum ChatType {
	PRIVATE = 'PRIVATE',
	PUBLIC = 'PUBLIC',
	GROUP = 'GROUP',
	DIRECT = 'DIRECT',
	EXTERNAL = 'EXTERNAL',
}

export interface IChat {
	id?: string;
	timestamp: number;
	originalTimestamp?: number;
	ownerId?: number;
	name: string;
	pictureUrl?: string;
	type: ChatType;
	groupId?: number;
	portals?: string[];
	members: number[];
	file?: File;
	pinned: boolean;
	pinnedTimestamp?: number;
	lastMessage?: IMessage;
	externalLines?: {
		externalId: string;
		icon: string;
		id: string;
		name: string;
		phoneNumber: string;
		portal: string;
		timestamp: number;
	}[];
	active?: boolean;
	externalChatStatus?: EActiveEntity.ACTIVE_EXTERNAL | EActiveEntity.UNDISTRIBUTED_EXTERNAL | EActiveEntity.INACTIVE_EXTERNAL;
	meta?: {
		type: string;
		value: string;
	}[];
	settings?: {
		muteUntil?: number;
	};
	unreadCount?: number;
	unreadMentions: string[];
	isInviteChat?: boolean;
	assigned?: boolean;
	customer_contact?: ICrmConnectEntity;
}

export interface IMessagesGroup {
	items: IMessage[];
	chatId: string;
	lastTimestamp?: number;
	firstTimestamp?: number;
	loading: boolean;
	init?: boolean;
	editableMessageId?: string;
	parentMessageId?: string;
	scrollPosition?: number;
	draftMessage: string;
}

export enum EMessengerType {
	INTERNAL_CHAT = 'internalChat',
	EXTERNAL_LINES = 'externalLines',
	MAIL = 'mail',
}

export type FetchMessagesRequest = {
	chatId: string;
	limit?: number;
	reconnect?: boolean;
	lastTimestamp?: number;
	firstTimestamp?: number;
	push?: boolean;
	dir?: 'next' | 'prev';
	unreadFirst?: boolean;
};

export type GoToMessageRequest = {
	chatId?: string;
	id: string;
};

export interface IExternalChatsItems {
	active: IChat[];
	undistributed: IChat[];
	inactive: IChat[];
}

export interface ICreateWidgetData {
	id?: string;
	name: string;
	nameExternalLine?: string;
	entryPoint?: string;
	active?: boolean;
	authUserId?: number;
	externalLine?: string;
	settings: {
		icon?: string;
		welcomeMessage?: string;
		operatorName?: string;
		iconColor?: string;
		backgroundColor?: string;
		operatorAvatar?: string;
	};
}

export interface ICrmConnectEntity {
	entity: 'leads' | 'contacts' | 'companies' | 'deals';
	id: number;
	owner: number;
	title: string;
}

export interface IQuickAnswer {
	name: string;
	message: string;
	availableForUsers: number[];
	availableInExternalLines: [];
	ownerId: number;
	portal: string;
	status: string;
	createdAt: number;
	updatedAt: number;
	id: string;
	isOutOfQuota?: boolean;
}

export interface IGetQuickAnswerParams {
	page?: number;
	availableInExternalLines?: number[];
	statuses?: string[];
	availableForUsers?: number[];
	list?: number | 'all';
	createdAt?: number[][];
	ownerId?: number[];
	boolean_operator?: 'AND' | 'OR';
	q?: string;
	includeOutOfQuota?: boolean;
}

export interface ICreateQuickAnswerDTO {
	name: string;
	message?: string;
	availableForUsers?: number[];
	availableInExternalLines?: [];
}
