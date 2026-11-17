import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import {
	DiskSection,
	DiskSortKey,
	Disposition,
	FolderDestination,
	GranteeType,
	IDiskListing,
	IEntitySource,
	IExternalLink,
	IExternalLinkPayload,
	IFile,
	IFilePage,
	IFolder,
	IListingIds,
	IModuleListing,
	IShare,
	IStorageTotals,
	MODULES_SECTION,
	MoveDestination,
	ShareableId,
	ShareableType,
	SharePermission,
	ShareVerb,
	SortOrder,
} from '../../models/disk';
import {
	IFileRestore,
	IFolderRestore,
	IHeaviestEntities,
	IHeaviestFiles,
	IQuotaBanner,
	IStatsParams,
	IStorageItems,
	IStorageItemsParams,
	IStorageStats,
	IStorageUsage,
	ITrashListing,
	ITrashParams,
	ITrashSweep,
} from '../../models/disk-storage';

export interface IPageParams {
	page?: number;
	perPage?: number;
	sort?: DiskSortKey;
	order?: SortOrder;
}

/**
 * Creating a folder: a name, and exactly one destination.
 *
 * The destination is spread into the body rather than held in a field of its
 * own, because the wire format is flat — `{ name, parentId }` or
 * `{ name, section }` — and the union is what stops a third combination from
 * being expressible. See FolderDestination.
 */
export type ICreateFolder = { name: string } & FolderDestination;

/**
 * The Uspacy Disk: files and folders, drives per module, sharing, external links, the trash and the
 * storage dashboard — `files-backend`, under `/files/v1`.
 *
 * Ported from disk-frontend's own client, method for method, so the Disk can move onto the SDK
 * without changing what it asks for. Like every service here, a method answers with the http
 * client's response; the caller reads `.data`.
 *
 * Several routes are requests the design needs and the backend does not serve yet. Each says so in
 * its own comment, and disk-frontend's `docs/backend-requests.md` is the list.
 */
@injectable()
export class DiskService {
	private namespace = '/files/v1';

	constructor(private httpClient: HttpClient) {}

	// ---------------------------------------------------------------- listing

	/** The root of a drive. `section` is `company`, `personal`, or a module section. */
	listSection(section: DiskSection, params: IPageParams = {}) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${encodeURIComponent(section)}`, { params });
	}

	listFolder(section: DiskSection, folderId: number, params: IPageParams = {}) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${encodeURIComponent(section)}/folders/${folderId}`, { params });
	}

	search(section: DiskSection, query: string, params: IPageParams = {}) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${encodeURIComponent(section)}/search`, {
			params: { ...params, q: query },
		});
	}

	/**
	 * Every id a listing holds, across all of its pages — what "Вибрати всі 156"
	 * needs and no other endpoint can answer.
	 *
	 * ## Why this exists at all
	 *
	 * The selection toolbar offers to select the whole listing, which the design
	 * draws next to the count. A page of fifty is all the client has; the other
	 * hundred and six rows are ids it has never been sent, and paging through
	 * the listing to collect them would be three more requests to answer a
	 * question the server can answer in one — and would race anything that
	 * changes between the first page and the last.
	 *
	 * Ids only, deliberately. The objects are not wanted: the actions send one
	 * request per id, and the listing already has the rows the user can see. A
	 * response carrying a hundred and fifty-six full resources to select them
	 * would be the same information at twenty times the size.
	 *
	 * ## Not served yet — see docs/backend-requests.md
	 *
	 * The route answers 404 until the backend adds it, which the toolbar reports
	 * like any other refusal rather than silently selecting the page it already
	 * had. The mock answers it, so the state is reviewable.
	 *
	 * `params` is the listing's own — the sort does not matter for a set of ids,
	 * but the filters do, and they travel the same way. A selection over "the
	 * whole listing" means the listing as it is currently narrowed, not the
	 * folder's entire contents.
	 */
	listingIds(section: DiskSection, scope: { folderId?: number | null; search?: string } = {}, params: IPageParams & Record<string, unknown> = {}) {
		const { folderId = null, search = '' } = scope;
		/*
		 * The three listing paths, spelled the same way the three methods above
		 * spell them — a module drive and one of its entities are the `modules`
		 * section narrowed by parameters, so they need no branch of their own
		 * here any more than they do there.
		 */
		// eslint-disable-next-line no-nested-ternary
		const base =
			search !== ''
				? `/disk/${encodeURIComponent(section)}/search`
				: folderId === null
				? `/disk/${encodeURIComponent(section)}`
				: `/disk/${encodeURIComponent(section)}/folders/${folderId}`;

		return this.httpClient.client.get<IListingIds>(`${this.namespace}${base}/ids`, { params: search === '' ? params : { ...params, q: search } });
	}

	breadcrumbs(folderId: number) {
		return this.httpClient.client.get<{ breadcrumbs: { id: number; name: string }[] }>(`${this.namespace}/folders/${folderId}/breadcrumbs`);
	}

	/**
	 * Which module drives this space has.
	 *
	 * Render what this returns. Do not filter it against a list of known modules
	 * and do not map its ids to labels of your own — backend CON-8 requires that
	 * a module introduced after release appears with no code change here, and a
	 * local whitelist is a defect that works perfectly until the day it does not.
	 */
	moduleDrives(params: IPageParams = {}) {
		return this.httpClient.client.get<IModuleListing>(`${this.namespace}/disk/modules/drives`, { params });
	}

	/**
	 * The entities inside one drive.
	 *
	 * `entityType` is a required argument rather than a key in a bag, because
	 * `entity_type` is `required` in ListModuleEntitiesRequest. Typed as
	 * `IPageParams & Record<string, unknown>` it was optional, so forgetting it
	 * compiled and answered 422 — a contract the server enforces and the type
	 * declined to.
	 *
	 * `ListModuleDrivesRequest`, which this inherits from, deliberately does not
	 * take the leftover parameters as filters: a drive is a `GROUP BY`, so a
	 * filter on a file column would be accepted, ignored, and answered with the
	 * unfiltered list. That is why nothing else is forwarded here.
	 */
	moduleEntities(entityType: string, params: IPageParams = {}) {
		return this.httpClient.client.get<IModuleListing>(`${this.namespace}/disk/modules/entities`, { params: { ...params, entityType } });
	}

	/**
	 * The files attached to one entity — the third level of a module drive.
	 *
	 * Not a fourth endpoint: it is the ordinary section listing under `modules`,
	 * filtered by the two columns `files` already declares as filters. That is
	 * what keeps the deepest level of this structure sorting, paging and
	 * authorising exactly like every other folder in the Disk, instead of growing
	 * a third opinion about all three.
	 *
	 * `entityId` is a string because `files.entity_id` is a varchar — see IFile.
	 */
	moduleEntityFiles(entityType: string, entityId: string, params: IPageParams = {}, source?: string) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${MODULES_SECTION}`, {
			params: { ...params, entityType, entityId, ...(source !== undefined && { source }) },
		});
	}

	/**
	 * The places one entity's files come from, as the folders the design draws
	 * on a group's Disk tab: «Стрічка новин», «Завдання».
	 *
	 * `moduleEntityFiles` then takes a source's `code` to list the files of
	 * one of them. Not served yet — see docs/backend-requests.md.
	 */
	moduleEntitySources(entityType: string, entityId: string) {
		return this.httpClient.client.get<{ sources: IEntitySource[] }>(`${this.namespace}/disk/${MODULES_SECTION}/sources`, {
			params: { entityType, entityId },
		});
	}

	/**
	 * Every file in one module drive, ungrouped — what the design's "Відображати:
	 * усі файли" shows instead of the drive's entities.
	 *
	 * The same endpoint as the level below with one filter dropped rather than
	 * two: a drive's files are the `modules` section narrowed to an entity type,
	 * exactly as an entity's files are that narrowed again by an id. So it pages,
	 * orders and authorises identically, and the two views of a module drive
	 * cannot drift apart over what a file in it is.
	 */
	moduleDriveFiles(entityType: string, params: IPageParams = {}) {
		return this.httpClient.client.get<IDiskListing>(`${this.namespace}/disk/${MODULES_SECTION}`, { params: { ...params, entityType } });
	}

	// ---------------------------------------------------------------- folders

	createFolder(name: string, destination: FolderDestination) {
		return this.httpClient.client.post<IFolder>(`${this.namespace}/folders`, { name, ...destination });
	}

	renameFolder(folderId: number, name: string) {
		return this.httpClient.client.patch<IFolder>(`${this.namespace}/folders/${folderId}`, { name });
	}

	/**
	 * Move, which rewrites the path of every row beneath this folder.
	 *
	 * A POST rather than a PATCH on the folder, matching the backend: it is not
	 * an edit of a field but a rewrite of a subtree, and the separate path keeps
	 * the rename endpoint from ever growing a `parentId`.
	 *
	 * This took `parentId: number | null` until F1.5 and was wrong both ways.
	 * Passing `null` for "the drive root" sent `{ parentId: null }` with no
	 * section, which the backend refuses — `section` is `required_without` — so
	 * moving anything back to a root answered 422. The destination type is what
	 * makes both halves unsayable.
	 */
	moveFolder(folderId: number, destination: MoveDestination) {
		return this.httpClient.client.post<IFolder>(`${this.namespace}/folders/${folderId}/move`, destination);
	}

	deleteFolder(folderId: number) {
		return this.httpClient.client.delete<void>(`${this.namespace}/folders/${folderId}`);
	}

	/** The folder half of `deleteFilePermanently`, with the same caveat and the same shape. */
	deleteFolderPermanently(folderId: number) {
		return this.httpClient.client.delete<void>(`${this.namespace}/folders/${folderId}/permanent`);
	}

	/** The folder half of `undoFilePermanentDelete`, putting the subtree back with it. */
	undoFolderPermanentDelete(folderId: number) {
		return this.httpClient.client.post<void>(`${this.namespace}/folders/${folderId}/permanent/undo`, {});
	}

	// ------------------------------------------------------------------ files

	getFile(fileId: number) {
		return this.httpClient.client.get<IFile>(`${this.namespace}/files/${fileId}`);
	}

	/**
	 * Upload one file into a place on the Disk.
	 *
	 * The destination is a FolderDestination, the same union a move takes, and
	 * for the same reason: the backend validates `parentId` and `section` as
	 * mutually exclusive, so the type is what keeps a third combination from
	 * being sayable. Until this took one, the upload sent `file`, `section` and
	 * `folderId` — none of which StoreFileRequest names — and every upload from
	 * the Disk answered 422. The test that should have caught it mocked the
	 * contract instead of reading it.
	 *
	 * `files[]` and not `file`: the endpoint takes an array, because it is also
	 * the pre-Disk entity upload, which sends several at once. One file per
	 * request here is a choice made in useUpload, not a limit of the API.
	 *
	 * Resolves to nothing. The response is the created records, and nobody reads
	 * them — the listing is reloaded instead, because it is the listing that
	 * decides where a new file sorts and on which page it lands.
	 *
	 * `onProgress` reports 0..100. It is wired here rather than left to the call
	 * site because the only place the bytes are visible is the axios config, and
	 * an upload without a progress bar is the shape users read as "frozen".
	 *
	 * Two refusals must reach the UI distinguishable: `quota_exceeded` and
	 * `quota_not_initialised`. They have different causes and different fixes —
	 * freeing space helps with the first and does nothing for the second — so
	 * rendering them with one message throws away the only actionable part.
	 */
	/**
	 * `signal` is what makes "cancel" in the upload queue true rather than
	 * cosmetic.
	 *
	 * Without it the request runs to completion after the user cancels: the
	 * bytes still go up, the server still stores the file, and — the part that
	 * matters — the upload still holds its quota reservation while it finishes,
	 * so the queue cannot safely start the next item. Aborting the request ends
	 * the reservation with it, which is why the queue may carry on past a
	 * cancel instead of being abandoned with it.
	 *
	 * Axios reads `signal` in both copies in this tree (0.27 and 1.x), so this
	 * needs no version branch. An aborted request rejects, and the queue treats
	 * that rejection as the cancellation it asked for rather than as a failure.
	 */
	uploadFile(file: File, destination: FolderDestination, onProgress?: (percent: number) => void, signal?: AbortSignal) {
		const form = new FormData();
		form.append('files[]', file);

		Object.entries(destination).forEach(([key, value]) => form.append(key, String(value)));

		return this.httpClient.client.post<unknown>(`${this.namespace}/files`, form, {
			signal,
			onUploadProgress: (event) => {
				// `total` is absent when the body length is not known, which is
				// not an error and not zero — reporting 0 there would animate a
				// bar backwards. Leave the bar where it is and let completion
				// move it.
				if (onProgress && event.total) {
					onProgress(Math.round((event.loaded * 100) / event.total));
				}
			},
		});
	}

	/**
	 * The legacy entity-attachment update, and not a rename.
	 *
	 * `PATCH /files/{id}` is UpdateFileRequest, which requires `entity_id` and
	 * `entity_type`: it re-points a file at an entity. Nothing in this API writes
	 * `original_filename`, so **a file cannot be renamed** — see the note on
	 * FileRowMenu. Left here under its real description rather than removed,
	 * because CON-7 keeps this endpoint for the pre-Disk callers.
	 */
	updateFile(fileId: number, body: Record<string, unknown>) {
		return this.httpClient.client.patch<IFile>(`${this.namespace}/files/${fileId}`, body);
	}

	/** Soft. `File` uses SoftDeletes, so this puts the file in the trash. */
	deleteFile(fileId: number) {
		return this.httpClient.client.delete<void>(`${this.namespace}/files/${fileId}`);
	}

	/**
	 * Permanent, and not served yet — see docs/backend-requests.md.
	 *
	 * The UI offers "delete without moving to the trash", and nothing here can
	 * do it: the only irreversible act this API has is emptying the whole trash.
	 * So the request goes to the sub-resource that request asks for and is
	 * refused until it exists, which the dialog shows like any other refusal.
	 *
	 * A sub-resource rather than a flag on `DELETE /files/{id}`, deliberately:
	 * an unknown query parameter or body field is ignored, so a flag would soft
	 * delete today while the screen claimed permanence — worse than no feature.
	 * An unknown path cannot be mistaken for a success.
	 */
	deleteFilePermanently(fileId: number) {
		return this.httpClient.client.delete<void>(`${this.namespace}/files/${fileId}/permanent`);
	}

	/**
	 * The undo the design's notice offers after a destroy, also not served yet.
	 *
	 * It can only work if the backend holds the row for a grace window rather
	 * than dropping it — see docs/backend-requests.md, where it is written down
	 * as a request the backend may well answer "no" to. Asked for all the same:
	 * the decision is theirs to record, and leaving the button out would make it
	 * for them.
	 */
	undoFilePermanentDelete(fileId: number) {
		return this.httpClient.client.post<void>(`${this.namespace}/files/${fileId}/permanent/undo`, {});
	}

	/**
	 * Move, which takes a destination and not a folder id.
	 *
	 * MoveFileRequest extends FolderDestinationRequest — the same class the
	 * folder endpoints use — so this is `{ parentId }` or `{ section }`, never
	 * both and never neither. This sent `{ folderId }` until F2, a field the
	 * request does not name, so it fell through to nothing and every move
	 * answered 422 for a missing `section`.
	 */
	moveFile(fileId: number, destination: MoveDestination) {
		return this.httpClient.client.post<IFile>(`${this.namespace}/files/${fileId}/move`, destination);
	}

	/**
	 * Copy, which is a second record over the same stored content.
	 *
	 * No additional quota is consumed (ADR-5), so the UI must not say the file
	 * was duplicated — nothing was.
	 *
	 * `name` is optional and is what makes the conflict refusal usable. A copy
	 * keeps the original's name, so copying into a folder that already holds it
	 * is refused with `file_name_conflict` and a `suggestion`; without a way to
	 * say "call it this instead" the user would be told what is wrong and given
	 * no request that fixes it.
	 */
	copyFile(fileId: number, destination: FolderDestination, name?: string) {
		return this.httpClient.client.post<IFile>(
			`${this.namespace}/files/${fileId}/copy`,
			name === undefined ? destination : { ...destination, name },
		);
	}

	/**
	 * Attach a file that is already on the Disk to an entity.
	 *
	 * This creates a second record over the same stored content, not a copy, so
	 * it consumes no additional quota (backend ADR-5, R3). The UI must not tell
	 * the user the file was duplicated, and must not show the two records as two
	 * different files.
	 */
	attachToEntity(fileId: number, entityType: string, entityId: string) {
		return this.httpClient.client.post<IFile>(`${this.namespace}/files/${fileId}/attach`, { entityType, entityId });
	}

	/**
	 * "Choose from Disk": the files a user may attach, across the whole Disk.
	 *
	 * Not an `IDiskListing`, and the difference is the endpoint's own design
	 * rather than an omission. It answers with files and a page — no section, no
	 * folder, no breadcrumbs, no folders — because it names no place: a listing
	 * is reached by naming a folder, a picker by asking for everything. Typed as
	 * a listing, `folders` and `emptyState` were `undefined` at runtime while the
	 * compiler promised an array and an object.
	 *
	 * Files only. Attaching a folder is a later feature, and offering folders in
	 * a picker that cannot attach them would be offering a dead end.
	 *
	 * `q` is optional here and required by the search endpoint, deliberately: a
	 * picker opens before the user has typed anything and must still show them
	 * something to choose from.
	 */
	picker(params: IPageParams & { q?: string } = {}) {
		return this.httpClient.client.get<IFilePage>(`${this.namespace}/disk/picker`, { params });
	}

	/**
	 * A short-lived signed storage URL for one file, asked for with the bearer
	 * header and handed back as data.
	 *
	 * ## Why not navigate to /download
	 *
	 * That is what this client did until now, and on staging it answered
	 * `{"error":"Unauthorized."}` for the user's own file. The route is behind
	 * `auth:jwt`, the token lives in the Authorization header, and a browser
	 * navigation sends no headers of ours — so the gateway refused it before it
	 * reached the service. `fetch` can carry the header but cannot read a 302's
	 * Location, which is why /download could never be the answer from here.
	 *
	 * The repair everyone reaches for is `?token=<jwt>`, which the guard would
	 * accept — AuthHeaders, QueryString, InputSource — and which puts the
	 * **session** token in the access log, the history and the Referer of every
	 * request the page makes afterwards. So the backend answers this route with
	 * the signed URL as JSON instead, and the browser goes straight to storage
	 * with no token of ours anywhere in it.
	 *
	 * `attachment` to save, `inline` to show. The disposition is baked into the
	 * signature, so it has to be asked for here rather than added afterwards; the
	 * backend's default is `inline`, which for a PDF opens it in place of the
	 * page when the user asked to save it.
	 */
	signedUrl(fileId: number, disposition: Disposition) {
		return this.httpClient.client.get<{ url: string }>(`${this.namespace}/files/${fileId}/signed-url`, { params: { disposition } });
	}

	// ----------------------------------------------------------------- shares

	shares(type: ShareableType, id: ShareableId) {
		return this.httpClient.client.get<{ shares: IShare[] }>(`${this.namespace}/disk/${type}/${id}/shares`);
	}

	/**
	 * Grant, or change an existing grant's level.
	 *
	 * An upsert: re-sharing to the same grantee at a different level is how a
	 * level is changed, and there is no second endpoint for it. A client that
	 * revoked before re-granting would leave a window in which the grantee had
	 * nothing.
	 */
	share(
		type: ShareableType,
		id: ShareableId,
		grantee: { granteeType: GranteeType; granteeId: number; permission: SharePermission; permissions?: ShareVerb[] },
	) {
		return this.httpClient.client.post<IShare>(`${this.namespace}/disk/${type}/${id}/shares`, grantee);
	}

	/**
	 * Take one grant back.
	 *
	 * Answers the same whether or not a row was there, so a second press is not
	 * an error. Note that this does not necessarily remove the grantee's access:
	 * grounds are additive, and they may still reach the object through the
	 * entity it hangs off or through the section (backend R10). A confirmation
	 * dialog promising they will lose access would be lying.
	 */
	revokeShare(type: ShareableType, id: ShareableId, grantee: { granteeType: GranteeType; granteeId: number }) {
		return this.httpClient.client.delete<void>(`${this.namespace}/disk/${type}/${id}/shares`, { data: grantee });
	}

	// --------------------------------------------------------- external links

	/**
	 * Mint a public link.
	 *
	 * The URL in the response is the only time it exists on this side: the
	 * backend stores a digest, not the token, so nothing can reproduce it. The
	 * dialog that shows it is the user's one chance to copy it and must say so.
	 *
	 * Do not log it, do not put it in an analytics event, and do not append it
	 * to any URL. The backend went to real trouble to keep it out of its own
	 * request log; shipping it to a third party from here undoes that.
	 */
	createExternalLink(type: ShareableType, id: ShareableId, payload: IExternalLinkPayload = {}) {
		return this.httpClient.client.post<IExternalLink>(`${this.namespace}/disk/${type}/${id}/external-link`, payload);
	}

	/** Every link to the object at once. The only revoke a one-link backend has. */
	revokeExternalLink(type: ShareableType, id: ShareableId) {
		return this.httpClient.client.delete<void>(`${this.namespace}/disk/${type}/${id}/external-link`);
	}

	/**
	 * The object's links, as the design's panel lists them.
	 *
	 * The three calls below are what "several links, each switched on and off
	 * and given its own term" needs of a backend: a listing, an edit and a
	 * delete addressed to one link. A backend that has only create and
	 * revoke-all answers these with a 404, and the panel then works with the
	 * one link it made in this sitting, as it did before.
	 */
	externalLinks(type: ShareableType, id: ShareableId) {
		return this.httpClient.client.get<{ links: IExternalLink[] }>(`${this.namespace}/disk/${type}/${id}/external-links`);
	}

	updateExternalLink(type: ShareableType, id: ShareableId, linkId: number, payload: IExternalLinkPayload) {
		return this.httpClient.client.patch<IExternalLink>(`${this.namespace}/disk/${type}/${id}/external-links/${linkId}`, payload);
	}

	deleteExternalLink(type: ShareableType, id: ShareableId, linkId: number) {
		return this.httpClient.client.delete<void>(`${this.namespace}/disk/${type}/${id}/external-links/${linkId}`);
	}

	// ------------------------------------------------------------------ quota

	/**
	 * The quota banner, for whoever is asking — administrator or not.
	 *
	 * Level, sentence and ways out, no figures. Cheap enough to read on every
	 * visit to the Disk: one counter row and the stored quota, no outgoing
	 * lookups, unlike the dashboard, which also names its breakdown rows.
	 */
	quotaBanner() {
		return this.httpClient.client.get<IQuotaBanner>(`${this.namespace}/disk/quota`);
	}

	/**
	 * The legacy consumption figure — and not the quota, which is why nothing in
	 * the quota UI reads it.
	 *
	 * `GET /totals/size` predates the Disk. Its `size` is a plain sum of every
	 * file's size, trashed ones included, and its `limit` is the tariff's
	 * configured allowance. The quota is enforced from neither: it is the
	 * `space_usage` counter, which counts stored content once however many
	 * records name it (R3), against the value billing sent. The two can disagree
	 * about whether the space is full — this one has no "not initialised" state
	 * at all — and a screen that drew both would contradict itself. The quota's
	 * own figures come from `storageStats()`, below.
	 *
	 * Unwrapped here because the endpoint answers through a bare `JsonResource`,
	 * whose default wrapping puts the fields under `data` (the backend's
	 * Phase7AccessReviewTest reads `data.size`). Until F6 this returned the
	 * envelope and typed it as the fields, so `totals().size` was `undefined` at
	 * runtime and a number to the compiler. Nothing called it, which is the only
	 * reason that went unseen.
	 *
	 * Kept because the backend keeps it on purpose: it is the one consumption
	 * figure an ordinary user may read about the space. The banner does not draw
	 * from it; it reads `quotaBanner()`.
	 */
	totals() {
		return this.httpClient.client.get<{ data: IStorageTotals }>(`${this.namespace}/totals/size`);
	}

	// ------------------------------------------------------------------ trash

	/**
	 * What this viewer deleted and may still see, newest first.
	 *
	 * Typed so that no ordering can be sent. The trash has one order — most
	 * recently deleted — and a `sort` passed here would not be refused: it would
	 * be dropped by `validated()` in silence and the caller would believe the
	 * trash was sorted by name.
	 *
	 * The page window is served. `search` and the filter row's parameters are
	 * what the mockup's header over the trash needs and ListTrashRequest does
	 * not take yet — see ITrashParams and docs/backend-requests.md.
	 */
	trash(params: ITrashParams = {}) {
		return this.httpClient.client.get<ITrashListing>(`${this.namespace}/disk/trash`, { params });
	}

	/**
	 * What one trashed folder holds — the row menu's «Відкрити» on a folder.
	 *
	 * Not served yet (docs/backend-requests.md): the trash lists roots only, and
	 * the ordinary folder listing answers 404 for a deleted folder. The answer
	 * is the trash's own shape with the folder and the trashed folders above it
	 * added, so the screen that draws the trash draws this with the same table.
	 */
	trashFolder(folderId: number, params: ITrashParams = {}) {
		return this.httpClient.client.get<ITrashListing>(`${this.namespace}/disk/trash/folders/${folderId}`, { params });
	}

	/**
	 * Put a file back where it was, or say where it went instead.
	 *
	 * Read `relocated` on the answer, not just the status. When the folder the
	 * file was deleted from is itself gone, the restore succeeds into the top of
	 * the file's drive and says so; a caller that reported only "restored" would
	 * send the user to a folder that no longer exists. See IRestoreOutcome.
	 *
	 * `name` exists for the conflict. A trashed file releases its name, so the
	 * place it came from may have taken it in the meantime, and the restore is
	 * then refused with `file_name_conflict` and the server's `suggestion` — which
	 * is only a way forward if the caller can come back with it accepted. Sent
	 * only when given: an absent field means "the name it had", and an empty
	 * string is not a name.
	 */
	restoreFile(fileId: number, name?: string) {
		return this.httpClient.client.post<IFileRestore>(`${this.namespace}/disk/trash/files/${fileId}/restore`, name === undefined ? {} : { name });
	}

	/**
	 * Put a folder back with everything that went to the trash with it.
	 *
	 * One request for the whole subtree, because deleting it was one act; the
	 * listing shows the folder and not its contents for the same reason. The
	 * relocation and the name conflict are the same as for a file, with
	 * `folder_name_conflict` as the code.
	 */
	restoreFolder(folderId: number, name?: string) {
		return this.httpClient.client.post<IFolderRestore>(
			`${this.namespace}/disk/trash/folders/${folderId}/restore`,
			name === undefined ? {} : { name },
		);
	}

	/**
	 * One pass of "empty the trash": permanent, and bounded.
	 *
	 * Bounded because the backend destroys at most one batch per request — an
	 * unbounded purge of a large trash would run until something timed out,
	 * having destroyed an unknown prefix. `remaining` says whether another pass
	 * would do anything, and is defined so that looping on it terminates; the
	 * loop is the caller's (useTrash), so that this stays one request.
	 *
	 * The per-object version is `purgeTrashedFile` / `purgeTrashedFolder` below,
	 * which the backend does not serve yet.
	 */
	emptyTrash() {
		return this.httpClient.client.delete<ITrashSweep>(`${this.namespace}/disk/trash`);
	}

	/**
	 * «Видалити остаточно» on one row of the trash, and not served yet.
	 *
	 * The backend omitted a per-object permanent delete on purpose — the one
	 * irreversible single-object act, a row away from the reversible one — and
	 * the mockup now draws it, behind a confirmation. So the request goes to the
	 * resource docs/backend-requests.md asks for and is refused until it exists;
	 * the confirmation stays open on the refusal like every other.
	 *
	 * Its own resource under `/disk/trash` rather than `/files/{id}/permanent`:
	 * that one destroys a live object, and route model binding does not resolve
	 * a soft-deleted row for it.
	 */
	purgeTrashedFile(fileId: number) {
		return this.httpClient.client.delete<void>(`${this.namespace}/disk/trash/files/${fileId}`);
	}

	/** The same for a folder, which takes the subtree that went to the trash with it. */
	purgeTrashedFolder(folderId: number) {
		return this.httpClient.client.delete<void>(`${this.namespace}/disk/trash/folders/${folderId}`);
	}

	/**
	 * The «Скасувати» the mockup's notice carries after a row is purged: the
	 * object goes back into the trash, not back to its drive. Not served, and
	 * the backend may answer that it cannot be — see docs/backend-requests.md
	 * and `undoFilePermanentDelete`, which is the same question.
	 */
	undoTrashedFilePurge(fileId: number) {
		return this.httpClient.client.post<void>(`${this.namespace}/disk/trash/files/${fileId}/undo`, {});
	}

	undoTrashedFolderPurge(folderId: number) {
		return this.httpClient.client.post<void>(`${this.namespace}/disk/trash/folders/${folderId}/undo`, {});
	}

	// ------------------------------------------------------------------ stats

	/**
	 * The storage dashboard: the figure, the quota, the breakdown.
	 *
	 * With no `scope` the backend chooses by who is asking — the space for an
	 * administrator, their own personal drive for anybody else — and says which
	 * in `administrator`. Naming a scope is how a figure other than the default
	 * is asked for, and is the request an ordinary user is refused, with
	 * `not_space_administrator`, for anything but their own drive.
	 *
	 * The quota and the breakdown arrive only for the space as a whole. That is
	 * also where the banner's level, message and CTAs come from: the backend has
	 * no other place that says whether the space is past its threshold.
	 *
	 * `scope` goes in the query string and never in the path, for the backend's
	 * reason: a module key carries an entity type, which may hold a slash or a
	 * word this API already routes.
	 */
	storageStats(params: IStatsParams = {}) {
		return this.httpClient.client.get<IStorageStats>(`${this.namespace}/disk/stats`, { params });
	}

	/**
	 * The heaviest files behind one figure — the drill-down.
	 *
	 * Takes the key a breakdown row handed back, unchanged, and is refused on the
	 * same grounds as the dashboard: the two endpoints share one rule, so a row an
	 * ordinary user cannot see is a drill-down they cannot open. Heaviest first
	 * is the whole question, so there is no ordering to choose.
	 */
	heaviestFiles(params: IStatsParams = {}) {
		return this.httpClient.client.get<IHeaviestFiles>(`${this.namespace}/disk/stats/files`, { params });
	}

	// ----------------------------------------------------------- storage tab

	/**
	 * The Storage tab's headline: what is used, of how much, and by which place.
	 *
	 * A partition — each stored byte in exactly one segment — which is what lets
	 * the design draw it as one stacked bar; the breakdown `storageStats()`
	 * carries overlaps and cannot be. Each segment is split by kind of content
	 * for the card the bar shows on hover. Not served yet: see
	 * docs/backend-requests.md.
	 */
	storageUsage() {
		return this.httpClient.client.get<IStorageUsage>(`${this.namespace}/disk/stats/usage`);
	}

	/**
	 * Folders and files across every drive, each with the place it lives in.
	 *
	 * With a `scope` — a segment's key, unchanged — the same listing narrowed to
	 * that place. In the query string for the reason `storageStats()` gives.
	 * Not served yet: see docs/backend-requests.md.
	 */
	storageItems(params: IStorageItemsParams = {}) {
		return this.httpClient.client.get<IStorageItems>(`${this.namespace}/disk/stats/items`, { params });
	}

	/**
	 * Renaming a file, which the Storage tab's row menu draws for every row.
	 *
	 * Not served yet — nothing in the backend writes `original_filename` — so
	 * against the live API this is refused and the dialog says so. See
	 * docs/backend-requests.md.
	 */
	renameFile(fileId: number, name: string) {
		return this.httpClient.client.patch<IFile>(`${this.namespace}/files/${fileId}/name`, { name });
	}

	/**
	 * A folder copied with everything in it, into a folder or a drive's root.
	 *
	 * The design's row menu offers «Копіювати» on a folder as on a file, and
	 * answers with «Регламенти (копія)» beside the original. The same request
	 * shape as `copyFile`, and the same conflict: a name already taken there is
	 * refused with a `suggestion`, which `name` then carries. Not served yet —
	 * see docs/backend-requests.md.
	 */
	copyFolder(folderId: number, destination: FolderDestination, name?: string) {
		return this.httpClient.client.post<IFolder>(
			`${this.namespace}/folders/${folderId}/copy`,
			name === undefined ? destination : { ...destination, name },
		);
	}

	/**
	 * A signed URL for a folder as one archive, the shape `signedUrl()` answers
	 * with for a file. Not served yet: see docs/backend-requests.md.
	 */
	folderArchiveUrl(folderId: number) {
		return this.httpClient.client.get<{ url: string }>(`${this.namespace}/disk/folders/${folderId}/archive`);
	}

	/**
	 * A module figure by entity — which tasks, deals or chats hold the space.
	 *
	 * Only a module's key is accepted (anything else is a 422), so the scope is
	 * required here rather than defaulted: there is no viewer default to fall
	 * back to, the space and a drive having no entities to group by.
	 */
	heaviestEntities(params: IStatsParams & { scope: string }) {
		return this.httpClient.client.get<IHeaviestEntities>(`${this.namespace}/disk/stats/entities`, { params });
	}

	// --------------------------------------------------------------- internal

	/*
	 * One place where an axios rejection becomes a DiskRefusal.
	 *
	 * Wrapping each verb rather than installing an interceptor on the shared
	 * client: that client belongs to the SDK and is used by every other service
	 * in the page, so an interceptor added here would change how unrelated code
	 * sees its own errors.
	 */
}
