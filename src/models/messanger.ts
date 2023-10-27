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

export interface IMessage {
	id: string;
	timestamp: number;
	authorId: number;
	message: string;
	type: MessageType;
	chatId: string;
	parentMessage?: IMessage;
	refrenceId?: string;
	attachedFiles?: IFile[];
	readBy: number[];
	showTime?: boolean;
	mentioned: number[];
	externalLine?: IExternalLine | string;
	externalAuthorId?: string;
	relations?: IRelations[];
	ref?: {
		chatId: string;
		authorId: number;
		refMessageId: string;
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
	message: string;
}

export enum EMessengerType {
	INTERNAL_CHAT = 'internalChat',
	EXTERNAL_LINES = 'externalLines',
}

export type FetchMessagesRequest = {
	chatId: string;
	limit?: number;
	reconnect?: boolean;
	lastTimestamp?: number;
	firstTimestamp?: number;
	push?: boolean;
	dir?: 'next' | 'prev';
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
