import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import {
	DiskSection,
	DiskSortKey,
	Disposition,
	FolderDestination,
	IAccessPeople,
	IAccessState,
	IAccessUpdate,
	IDiskListing,
	IEntitySource,
	IExternalLink,
	IExternalLinkPayload,
	IFile,
	IFilePage,
	IFolder,
	IFolderTreeEntry,
	IGrant,
	IMassMoveDestination,
	IMassMoveResult,
	IMassResult,
	IModuleListing,
	ISelection,
	IUndoable,
	MODULES_SECTION,
	MoveDestination,
	ShareableId,
	ShareableType,
	SortOrder,
	UploadDestination,
} from '../../models/disk';
import {
	IMassRestoreResult,
	IQuota,
	IStorageItems,
	IStorageItemsParams,
	IStorageUsage,
	ITrashListing,
	ITrashParams,
	ITrashSweep,
} from '../../models/disk-storage';

/**
 * A page window and an ordering, in the backend's own names.
 *
 * `per_page` is clamped to 200 by the server rather than refused: a client
 * asking for more is asking for as much as possible.
 */
export interface IPageParams {
	page?: number;
	per_page?: number;
	sort?: DiskSortKey;
	order?: SortOrder;
}

/** A listing's parameters: the window, plus the filter row's (see useDiskFilters). */
export type IListingParams = IPageParams & { [filter: string]: string | number | undefined };

/**
 * Creating a folder: a name, and exactly one destination.
 *
 * The destination is spread into the body because the wire format is flat —
 * `{ name, parent_id }` or `{ name, section }` — and the union is what stops a
 * third combination from being expressible. See FolderDestination.
 */
export type ICreateFolder = { name: string } & FolderDestination;

/**
 * Where an object's access lives. A file, a folder or a drive by its id in the
 * path; a module's thing by its type and id in the query string, because an
 * entity type is whatever a customer named a smart object and must not decide
 * which route matches.
 */
const accessRoute = (type: ShareableType, id: ShareableId): { path: string; params?: Record<string, string> } =>
	typeof id === 'object'
		? { path: `/disk/${MODULES_SECTION}/entity`, params: { entity_type: id.entity_type, entity_id: id.entity_id } }
		: { path: `/disk/${type}/${id}` };

/**
 * The Disk's API (`files-backend`). Every key travels in snake_case, both ways.
 * Each method answers with the http client's response, as the SDK's services do.
 *
 * The transport is the SDK's `HttpClient` — authentication, token refresh, the
 * tenant header — and only the method surface is local. The same surface is
 * `uspacySdk.diskService` in `@uspacy/sdk`; see `./sdkDisk`.
 *
 * One user action is one request: everything over several objects takes an
 * `ISelection` (see `mass*`), and everything a notice can take back answers with
 * an `undo_token` for `undo`.
 *
 * @see docs/backend-final.uk.md
 */
@injectable()
export class DiskService {
	private readonly namespace = '/files/v1';

	constructor(private readonly httpClient: HttpClient) {}

	// ---------------------------------------------------------------- listing

	listSection(section: DiskSection, params: IListingParams = {}) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${encodeURIComponent(section)}`, { params });
	}

	listFolder(section: DiskSection, folderId: number, params: IListingParams = {}) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${encodeURIComponent(section)}/folders/${folderId}`, { params });
	}

	/** Matches anywhere in the drive, at any depth. */
	search(section: DiskSection, query: string, params: IListingParams = {}) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${encodeURIComponent(section)}/search`, {
			params: { ...params, q: query },
		});
	}

	// ---------------------------------------------------------------- modules

	/** Every module drive the space has, with the drives a grouping one holds as `children`. */
	moduleDrives(params: IPageParams = {}) {
		return this.httpClient.client.get<IModuleListing>(`${this.namespace}/disk/${MODULES_SECTION}/drives`, { params });
	}

	/**
	 * The things in one module drive, as folders.
	 *
	 * The drive travels as a value, never as a path segment: an entity type is
	 * whatever a customer named a smart object, and in a path it would decide
	 * which route matched.
	 */
	moduleEntities(entityType: string, params: IPageParams = {}) {
		return this.httpClient.client.get<IModuleListing>(`${this.namespace}/disk/${MODULES_SECTION}/entities`, {
			params: { ...params, entity_type: entityType },
		});
	}

	/** One entity's files — or, with `source`, the files of one of its sources (a group's posts or tasks). */
	moduleEntityFiles(entityType: string, entityId: string, params: IListingParams = {}, source?: string) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${MODULES_SECTION}`, {
			params: { ...params, entity_type: entityType, entity_id: entityId, ...(source !== undefined && { source }) },
		});
	}

	/** Where an entity's files come from, as folders: a group's «Стрічка новин» and «Завдання». */
	moduleEntitySources(entityType: string, entityId: string) {
		return this.httpClient.client.get<{ sources: IEntitySource[] }>(`${this.namespace}/disk/${MODULES_SECTION}/sources`, {
			params: { entity_type: entityType, entity_id: entityId },
		});
	}

	/** «Відображати: Усі файли» — a drive's files in one flat list, a grouping drive's with its children's. */
	moduleDriveFiles(entityType: string, params: IListingParams = {}) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${MODULES_SECTION}`, {
			params: { ...params, entity_type: entityType },
		});
	}

	// ---------------------------------------------------------------- folders

	createFolder(name: string, destination: FolderDestination) {
		const body: ICreateFolder = { name, ...destination };

		return this.httpClient.client.post<IFolder>(`${this.namespace}/folders`, body);
	}

	/**
	 * A dropped folder's whole tree, made in one request before its files go up.
	 *
	 * Parents precede their children in `paths`, and the server makes all of
	 * them in one transaction; a taken name at the top is one
	 * `folder_name_conflict` for the whole request, with a suggestion.
	 */
	createFolderTree(destination: FolderDestination, paths: string[]) {
		return this.httpClient.client.post<{ folders: IFolderTreeEntry[] }>(`${this.namespace}/folders/tree`, { ...destination, paths });
	}

	renameFolder(folderId: number, name: string) {
		return this.httpClient.client.patch<IFolder>(`${this.namespace}/folders/${folderId}`, { name });
	}

	/** `name`: the server's suggestion, taken after a `folder_name_conflict` — the folder moves under it. */
	moveFolder(folderId: number, destination: MoveDestination, name?: string) {
		return this.httpClient.client.post<{ folder: IFolder } & IUndoable>(`${this.namespace}/folders/${folderId}/move`, {
			...destination,
			...(name && { name }),
		});
	}

	/** Recursive; the files are second records over the same content, so a copy costs no quota. */
	copyFolder(folderId: number, destination: FolderDestination, name?: string) {
		return this.httpClient.client.post<IFolder>(
			`${this.namespace}/folders/${folderId}/copy`,
			name === undefined ? destination : { ...destination, name },
		);
	}

	/** Into the trash, with the subtree. */
	deleteFolder(folderId: number) {
		return this.httpClient.client.delete<IUndoable>(`${this.namespace}/folders/${folderId}`);
	}

	/**
	 * Past the trash, with the subtree.
	 *
	 * A path of its own rather than a flag on the soft delete: an unknown flag
	 * would be dropped and the folder soft deleted while the dialog said it was
	 * gone for good, which is the one lie the user cannot check.
	 */
	deleteFolderPermanently(folderId: number) {
		return this.httpClient.client.delete<IUndoable>(`${this.namespace}/folders/${folderId}/permanent`);
	}

	// ------------------------------------------------------------------ files

	/**
	 * Where a folder is for the person asking: their own drive, the company's,
	 * or «Доступні мені». A link to a folder carries no section — the owner's
	 * `personal` is somebody else's own drive — so the page asks this first.
	 */
	locateFolder(folderId: number) {
		return this.httpClient.client.get<{ section: DiskSection; folder_id: number }>(`${this.namespace}/disk/folders/${folderId}/locate`);
	}

	getFile(fileId: number) {
		return this.httpClient.client.get<IFile>(`${this.namespace}/files/${fileId}`);
	}

	/**
	 * One file into a folder or a drive's root.
	 *
	 * A request per file on purpose: the queue shows each file's progress and
	 * cancels each on its own, and the server reserves quota per file. `signal`
	 * is what makes «Скасувати» true — an aborted request is not stored and
	 * releases its reservation. `onProgress` reports 0..100.
	 */
	uploadFile(file: File, destination: UploadDestination, onProgress?: (percent: number) => void, signal?: AbortSignal) {
		const form = new FormData();
		form.append('files[]', file);

		Object.entries(destination).forEach(([key, value]) => form.append(key, String(value)));

		return this.httpClient.client.post<IFile[]>(`${this.namespace}/files`, form, {
			signal,
			onUploadProgress: (event) => {
				// `total` is absent when the length is not known; leave the bar
				// where it is rather than animate it backwards to zero.
				if (onProgress && event.total) {
					onProgress(Math.round((event.loaded * 100) / event.total));
				}
			},
		});
	}

	renameFile(fileId: number, name: string) {
		return this.httpClient.client.patch<IFile>(`${this.namespace}/files/${fileId}/name`, { name });
	}

	/** `name`: the server's suggestion, taken after a `file_name_conflict` — the file moves under it. */
	moveFile(fileId: number, destination: MoveDestination, name?: string) {
		return this.httpClient.client.post<{ file: IFile } & IUndoable>(`${this.namespace}/files/${fileId}/move`, {
			...destination,
			...(name && { name }),
		});
	}

	/**
	 * Without a name, a copy beside the original is made as «… (копія)» in one
	 * request; a name is sent only after the user accepted a suggestion.
	 */
	copyFile(fileId: number, destination: FolderDestination, name?: string) {
		return this.httpClient.client.post<IFile>(
			`${this.namespace}/files/${fileId}/copy`,
			name === undefined ? destination : { ...destination, name },
		);
	}

	deleteFile(fileId: number) {
		return this.httpClient.client.delete<IUndoable>(`${this.namespace}/files/${fileId}`);
	}

	/** See deleteFolderPermanently on why this is a path of its own. */
	deleteFilePermanently(fileId: number) {
		return this.httpClient.client.delete<IUndoable>(`${this.namespace}/files/${fileId}/permanent`);
	}

	/**
	 * A short-lived address to show the file from (`inline`) or to save it
	 * (`attachment`). Asking for one records the file as opened by this viewer.
	 */
	signedUrl(fileId: number, disposition: Disposition) {
		return this.httpClient.client.get<{ url: string }>(`${this.namespace}/files/${fileId}/signed-url`, { params: { disposition } });
	}

	// ----------------------------------------------------------- mass actions

	/** «Видалити» over a selection — into the trash, or past it. */
	massDelete(selection: ISelection, permanent = false) {
		return this.httpClient.client.post<IMassResult>(`${this.namespace}/disk/mass_deletion`, { selection, permanent });
	}

	/**
	 * «Перемістити» over a selection — or «Створити нову папку», which names a
	 * folder to make and moves everything into it in the same transaction.
	 */
	massMove(selection: ISelection, destination: IMassMoveDestination) {
		return this.httpClient.client.post<IMassMoveResult>(`${this.namespace}/disk/mass_move`, { selection, destination });
	}

	/** «Надати доступ» over a selection: the grants are added to each object, others left alone. */
	massAccess(selection: ISelection, grants: Pick<IGrant, 'grantee_type' | 'grantee_id' | 'permissions'>[]) {
		return this.httpClient.client.post<IMassResult>(`${this.namespace}/disk/mass_access`, { selection, grants });
	}

	/** «Завантажити» over a selection, or on one folder: a signed address of one archive. */
	archive(selection: ISelection) {
		return this.httpClient.client.post<{ url: string }>(`${this.namespace}/disk/archive`, { selection });
	}

	/** Takes back what the notice's token names: a move, a delete, a permanent delete. */
	undo(token: string) {
		return this.httpClient.client.post<void>(`${this.namespace}/disk/undo/${encodeURIComponent(token)}`);
	}

	// ------------------------------------------------------------------ access

	/** Everything the sharing panel shows: its mode, the grants, the external links. */
	access(type: ShareableType, id: ShareableId) {
		const { path, params } = accessRoute(type, id);

		return this.httpClient.client.get<IAccessState>(`${this.namespace}${path}/access`, { params });
	}

	/** «Список користувачів»: every person who can reach the object, whatever way they reach it. */
	accessPeople(type: ShareableType, id: ShareableId, params: IPageParams & { q?: string } = {}) {
		const { path, params: key } = accessRoute(type, id);

		return this.httpClient.client.get<IAccessPeople>(`${this.namespace}${path}/access/people`, { params: { ...key, ...params } });
	}

	/** «Зберегти»: the panel's whole new state in one transaction; what is left out is removed. */
	saveAccess(type: ShareableType, id: ShareableId, update: IAccessUpdate) {
		const { path, params } = accessRoute(type, id);

		return this.httpClient.client.put<IAccessState>(`${this.namespace}${path}/access`, update, { params });
	}

	/** «Налаштувати» / «Додати зовнішнє посилання»: made at once, so its address can be copied before saving. */
	createExternalLink(type: ShareableType, id: ShareableId, payload: IExternalLinkPayload = {}) {
		const { path, params } = accessRoute(type, id);

		return this.httpClient.client.post<IExternalLink>(`${this.namespace}${path}/external-links`, payload, { params });
	}

	// ------------------------------------------------------- picker and attach

	/** Search across every drive the picker can reach. */
	picker(params: IPageParams & { q?: string } = {}) {
		return this.httpClient.client.get<IFilePage>(`${this.namespace}/disk/picker`, { params });
	}

	/**
	 * The picker's «Додати»: ticked files, ticked folders with everything in them,
	 * and a «Вибрати всі» — as the files they amount to, in one request.
	 */
	/** Everything picked — ticked files and folders, and each «Вибрати всі» — as files, in one request. */
	resolvePicker(selections: ISelection[]) {
		return this.httpClient.client.post<{ files: IFile[]; truncated: boolean }>(`${this.namespace}/disk/picker/resolve`, { selections });
	}

	/** Disk files onto an entity as second records over the same content; the originals stay where they are. */
	massAttach(fileIds: number[], entityType: string, entityId: string) {
		return this.httpClient.client.post<IMassResult & { files: IFile[] }>(`${this.namespace}/files/mass_attach`, {
			file_ids: fileIds,
			entity_type: entityType,
			entity_id: entityId,
		});
	}

	// ------------------------------------------------------------------ quota

	/** The space's figures, level and notice — for every member, in one request. */
	quota() {
		return this.httpClient.client.get<IQuota>(`${this.namespace}/disk/quota`);
	}

	// ------------------------------------------------------------------ trash

	trash(params: ITrashParams = {}) {
		return this.httpClient.client.get<ITrashListing>(`${this.namespace}/disk/trash`, { params });
	}

	/** Inside a trashed folder, read-only. */
	trashFolder(folderId: number, params: ITrashParams = {}) {
		return this.httpClient.client.get<ITrashListing>(`${this.namespace}/disk/trash/folders/${folderId}`, { params });
	}

	/** «Відновити» over one row or many; `name` only for one, after a name conflict. */
	restoreFromTrash(selection: ISelection, name?: string) {
		return this.httpClient.client.post<IMassRestoreResult>(
			`${this.namespace}/disk/trash/mass_restore`,
			name === undefined ? { selection } : { selection, name },
		);
	}

	/** «Видалити остаточно» over one row or many. */
	purgeFromTrash(selection: ISelection) {
		return this.httpClient.client.post<IMassResult>(`${this.namespace}/disk/trash/mass_deletion`, { selection });
	}

	/** «Очистити кошик»: the server empties it on its own; `trashSweep` reports how far it got. */
	emptyTrash() {
		return this.httpClient.client.delete<ITrashSweep>(`${this.namespace}/disk/trash`);
	}

	trashSweep() {
		return this.httpClient.client.get<ITrashSweep>(`${this.namespace}/disk/trash/sweep`);
	}

	// ---------------------------------------------------------------- storage

	/** The Storage tab's bar: every stored byte in exactly one segment, by kind inside each. */
	storageUsage() {
		return this.httpClient.client.get<IStorageUsage>(`${this.namespace}/disk/stats/usage`);
	}

	/** The Storage tab's table: folders and files from every drive, or one segment's. */
	storageItems(params: IStorageItemsParams = {}) {
		return this.httpClient.client.get<IStorageItems>(`${this.namespace}/disk/stats/items`, { params });
	}
}
