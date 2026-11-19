/**
 * The shapes the quota, the trash and the storage dashboard answer with.
 *
 * In a file of their own rather than appended to `disk.ts`, because they are a
 * different part of the product read by different screens, and because they
 * arrived together in the backend's last two phases (6 and 7) and are easier to
 * check against those phases as one file.
 *
 * snake_case both ways, as in `disk.ts`: the Disk routes run without the case
 * conversion middleware, so a key is spelled here as the server writes it.
 * The contract is docs/backend-final.uk.md (пп. 12, 13).
 */

import { DiskSection, IAccessSummary, IBreadcrumb, IEmptyState, IEntityRef, IFile, IFolder, IMassResult, IObjectLocation } from './disk';

/**
 * The page window the trash and the storage listings answer with.
 *
 * Four fields, all always present — unlike `IListingMeta`, which the older
 * listings fill from a paginator and which therefore carries an index
 * signature. These are built by hand in the controllers (`'meta' => [...]`), so
 * the type can say exactly what is there.
 */
export interface IPageMeta {
	page: number;
	list: number;
	total: number;
	last_page: number;
}

/**
 * A short, already translated sentence with the code it was chosen by.
 *
 * The same `{code, message}` shape as `IEmptyState`, and named apart only
 * because "notice" is not an emptiness — a restore that landed somewhere other
 * than where it was left has succeeded. Aliased rather than redeclared so the
 * two cannot drift, which is the property the backend builds both with one
 * function to keep.
 */
export type INotice = IEmptyState;

// ------------------------------------------------------------------ trash

/**
 * One page of the trash: the roots of what was deleted, folders first.
 *
 * Roots, not every trashed row. Deleting a folder trashes its subtree in one
 * act, and restoring the folder brings the subtree back, so the listing shows
 * the folder and not the ten thousand things inside it (TrashListing).
 *
 * Each row carries when it was deleted (ITrashMark: `deleted_at`), and the
 * listing says how long rows are kept (`retention_days`): the «Дата видалення»
 * column and the notice over the table. Most recently deleted first unless
 * sorted (docs/backend-final.uk.md, п. 12).
 */
export interface ITrashListing {
	folders: ITrashedFolder[];
	files: ITrashedFile[];
	meta: IPageMeta;
	/** How long the trash keeps a row before destroying it — the notice over the table. */
	retention_days?: number;
	/** Null while anything is in the trash; `trash_empty` and a sentence otherwise. */
	empty_state: IEmptyState | null;
	/**
	 * Present on the contents of one trashed folder and absent on the trash
	 * itself: the folder being looked into, and the trashed folders above it up
	 * to the row the trash lists. See `DiskService.trashFolder`.
	 */
	folder?: ITrashedFolder | null;
	breadcrumbs?: IBreadcrumb[];
}

/** The thing a trashed object hung off — the «СУТНІСТЬ» chip. The same reference a file carries in a listing. */
export type ITrashEntity = IEntityRef;

/**
 * What the trash says about a row beyond what the object itself carries.
 *
 * Sent on every trash row (docs/backend-final.uk.md, п. 12). Optional only so a
 * row without them still renders — with an em dash in each of the two columns.
 */
export interface ITrashMark {
	/** When the object was deleted. The «ДАТА ВИДАЛЕННЯ» column. */
	deleted_at?: number | null;
	entity?: ITrashEntity | null;
}

export type ITrashedFolder = IFolder & ITrashMark;

export type ITrashedFile = IFile & ITrashMark;

/**
 * What a request for the trash may carry.
 *
 * The page window, the search (`q`) and the filter row's parameters — the
 * same vocabulary as every listing (docs/backend-final.uk.md, пп. 4, 12). A
 * parameter the server does not know is a 422, not a silent drop.
 */
export interface ITrashParams {
	page?: number;
	list?: number;
	q?: string;
	type?: string;
	owner_id?: string;
	access?: string;
	updated_at_period?: [number, number];
	created_at_period?: [number, number];
}

/**
 * Where a restored object went, and whether that is where it was.
 *
 * `relocated` is the field that answers PRD Feature 10's sixth criterion. When
 * the folder the object was deleted from has itself gone, the object comes back
 * at the top of its drive instead, the request still succeeds, and this is
 * `true` with a `notice` saying so. A client that read only the 200 would tell
 * the user their file was restored and send them to look for it in a folder
 * that no longer exists.
 *
 * `folderId` is where it is now: a folder id, or null for the top of a drive.
 * Null does not by itself mean relocated — a file that was never in a folder
 * goes back to the top of its drive, which is exactly where it was.
 */
export interface IRestoreOutcome {
	type?: 'folder' | 'file';
	id?: number;
	folder_id: number | null;
	/** The drive the object is in now. */
	section?: DiskSection | null;
	/**
	 * Where it is now, as «Розташування» says it (п. 3.4) — what the restore
	 * notice's «Перейти» opens. A drive's section and a folder id cannot name a
	 * group's root or a module drive; a place can.
	 */
	place?: IObjectLocation | null;
	relocated: boolean;
	/** `restored_to_section_root` and its sentence when relocated; null otherwise. */
	notice: INotice | null;
}

/** Restoring a selection from the trash: the mass result, and where each object came back to. */
export interface IMassRestoreResult extends IMassResult {
	restored: (IRestoreOutcome & { type: 'folder' | 'file'; id: number })[];
}

/**
 * The emptying of the trash, which the server runs on its own once asked:
 * `total` is fixed when it starts, `purged` climbs to it, and `skipped` is what
 * this caller may see and may not destroy — somebody else's deletion on a shared
 * drive — which stays and has to be said.
 */
export interface ITrashSweep {
	status: 'running' | 'done';
	total: number;
	purged: number;
	skipped: number;
}

// ------------------------------------------------------------------ stats

/**
 * One consumption figure's address, as three fields.
 *
 * `key` is the only part a client sends back: a breakdown row hands its own key
 * to the drill-down, unchanged. It is never assembled here and never taken
 * apart here — a module key carries an entity type, which is a free string a
 * customer chose (CON-8) and may contain a colon of its own, so splitting on
 * one would be wrong for exactly the rows that matter.
 *
 * `kind` and `value` are what the key means, said by the server so that nobody
 * has to parse it. `kind` is `section`, `module` or `trash` (docs/backend-final.uk.md,
 * п. 15) and is typed as a string rather than that union on purpose: a kind
 * added later must not fail to render. The whole space is no scope at all — a
 * `segment` of null.
 */
export interface IUsageScope {
	key: string;
	kind: string;
	value: string;
}

/**
 * Where the space stands against its limit, as one word.
 *
 * Four cases and two of them both mean "uploads are refused", kept apart
 * because the ways out differ: `exhausted` is fixed by freeing space or buying
 * more, `not_initialised` by a value arriving from billing that nothing the user
 * does can hurry. A union rather than a string because the screen draws each one
 * differently; the renderers still fall through to "show the backend's message"
 * for a level this file has not heard of.
 */
export type QuotaLevel = 'not_initialised' | 'ok' | 'warning' | 'exhausted';

/**
 * The two ways out the backend names, as the codes it sends.
 *
 * Both the quota (`ctas`) and a refused upload (`cta` in the 413 body) carry
 * these, and mapping them to destinations is this application's job.
 */
export const QUOTA_CTA = {
	purchaseStorage: 'purchase_storage',
	freeUpSpace: 'free_up_space',
} as const;

/**
 * The space's figures and level, for every member, in one request: the
 * sidebar's «12,6 ГБ із 50 ГБ», its bar and «Вільно 37,4 ГБ», the notice over
 * the listing and the buttons under it.
 */
export interface IQuota {
	level: QuotaLevel;
	used_bytes: number;
	/** Null when the space has no limit set. */
	quota_bytes: number | null;
	available_bytes: number | null;
	/** 0..1, for the bar. */
	used_fraction: number | null;
	/** The notice's sentence; null at `ok`. */
	message: string | null;
	ctas: string[];
}

// ---------------------------------------------------------------- storage tab

/**
 * One kind of content inside a place — video, documents, photos, the rest.
 *
 * `type` is the server's code for the bucket and `label` its sentence for it.
 * The screen colours the four it has been drawn (`video`, `documents`, `photo`,
 * `other`) and draws any other in the neutral grey, so a bucket added later
 * appears under its own name rather than disappearing.
 */
export interface IStorageTypeUsage {
	type: string;
	label: string;
	used_bytes: number;
}

/**
 * One place's share of the space: a drive, a module, the trash.
 *
 * A **partition**, unlike the breakdown above: every stored byte is counted in
 * exactly one segment, so the segments add up to `IStorageUsage.usedBytes` and
 * may be drawn as one stacked bar — which is the thing the design draws.
 * `types` splits the segment the same way and adds up to it.
 */
export interface IStorageUsageSegment {
	scope: IUsageScope;
	label: string;
	label_resolved: boolean;
	used_bytes: number;
	types: IStorageTypeUsage[];
}

/** `GET /disk/stats/usage` — the Storage tab's headline, bar and legend. */
export interface IStorageUsage {
	used_bytes: number;
	/** Null while the space has no quota: the bar then has no remainder to draw. */
	quota_bytes: number | null;
	segments: IStorageUsageSegment[];
	/** `storage_empty` and the server's two sentences when nothing is stored at all. */
	empty_state: IEmptyState | null;
}

/** Where an item of the storage-wide listing lives: the segment it is counted in. */
export interface IStorageLocation {
	scope: IUsageScope;
	label: string;
	label_resolved: boolean;
	/** The place's glyph token, as on a module drive. */
	icon?: string | null;
}

export type { IAccessSummary };

interface IStorageItemFields {
	location: IStorageLocation;
	access: IAccessSummary | null;
}

export type IStorageFolder = IFolder & IStorageItemFields;

export type IStorageFile = IFile & IStorageItemFields;

/** `GET /disk/stats/items` — folders and files across every drive, or inside one segment. */
export interface IStorageItems {
	/** The segment the listing was narrowed to, with its name; null for the whole space. */
	segment: Pick<IStorageUsageSegment, 'scope' | 'label' | 'label_resolved'> | null;
	folders: IStorageFolder[];
	files: IStorageFile[];
	meta: IPageMeta;
	empty_state: IEmptyState | null;
}

/**
 * What the storage-wide listing may be asked for.
 *
 * `scope` is a segment's key, passed back unchanged. The rest is the listing's
 * own vocabulary — the sort keys, the search term and the filter row's
 * parameters — because the table and the header over it are the Disk's.
 */
export interface IStorageItemsParams {
	scope?: string;
	page?: number;
	list?: number;
	sort?: string;
	order?: 'asc' | 'desc';
	q?: string;
	[filter: string]: string | number | number[] | undefined;
}
