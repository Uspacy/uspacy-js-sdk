/**
 * The shapes the quota, the trash and the storage dashboard answer with.
 *
 * In a file of their own rather than appended to `disk.ts`, because they are a
 * different part of the product read by different screens, and because they
 * arrived together in the backend's last two phases (6 and 7) and are easier to
 * check against those phases as one file.
 *
 * Taken from the controllers rather than the specification, for the reason
 * `disk.ts` gives: the controller is what arrives. They write snake_case keys
 * and `ConvertResponseToCamelCase` — in the `api` group every `files/v1` route
 * runs under — rewrites every key on the way out, recursively and keys only, so
 * `used_bytes` arrives as `usedBytes` while a *value* such as
 * `restored_to_section_root` or `module:deal` arrives untouched. The backend's
 * own feature tests read the camelCase paths (`quota.quotaBytes`,
 * `notice.code`), which is the check that this is true rather than assumed.
 *
 * @see files-backend app/Http/Controllers/V1/TrashController.php
 * @see files-backend app/Http/Controllers/V1/StorageStatsController.php
 */

import { DiskSection, IAccessSummary, IBreadcrumb, IEmptyState, IFile, IFolder } from './disk';

/**
 * The page window every Phase 7 listing answers with.
 *
 * Four fields, all always present — unlike `IListingMeta`, which the older
 * listings fill from a paginator and which therefore carries an index
 * signature. These are built by hand in the controllers (`'meta' => [...]`), so
 * the type can say exactly what is there.
 */
export interface IPageMeta {
	page: number;
	perPage: number;
	total: number;
	lastPage: number;
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
 * Note what is **not** here: when an object was deleted. FileResource and
 * FolderResource carry no `deletedAt`, and the trash serialises through them,
 * so there is no date to show and no way to say how long something has left
 * before the nightly sweep removes it. The ordering is the backend's — most
 * recently deleted first — and the screen says so instead of drawing a column
 * it has no data for.
 */
export interface ITrashListing {
	folders: ITrashedFolder[];
	files: ITrashedFile[];
	meta: IPageMeta;
	/** Null while anything is in the trash; `trash_empty` and a sentence otherwise. */
	emptyState: IEmptyState | null;
	/**
	 * Present on the contents of one trashed folder and absent on the trash
	 * itself: the folder being looked into, and the trashed folders above it up
	 * to the row the trash lists. See `DiskService.trashFolder`.
	 */
	folder?: ITrashedFolder | null;
	breadcrumbs?: IBreadcrumb[];
}

/**
 * The thing in another module a trashed object hung off — the trash table's
 * «СУТНІСТЬ» chip.
 *
 * The name and the glyph are the owning service's, as they are on a module
 * drive: CON-8 forbids this repository from mapping an entity type to anything,
 * so the chip draws the `glyph` token it was handed and no glyph at all for a
 * token it does not know. Not served yet — see docs/backend-requests.md.
 */
export interface ITrashEntity {
	type: string;
	id: string;
	name: string;
	glyph?: string | null;
}

/**
 * What the trash says about a row beyond what the object itself carries.
 *
 * Both optional, because neither is served yet (docs/backend-requests.md): the
 * live trash serialises through the ordinary resources, and a response without
 * these still renders — with an em dash in each of the two columns.
 */
export interface ITrashMark {
	/** When the object was deleted, ISO. The «ДАТА ВИДАЛЕННЯ» column. */
	deletedAt?: string | null;
	entity?: ITrashEntity | null;
}

export type ITrashedFolder = IFolder & ITrashMark;

export type ITrashedFile = IFile & ITrashMark;

/**
 * What a request for the trash may carry.
 *
 * The page window is served. `search` and the filter row's parameters are not
 * (ListTrashRequest takes neither): the design draws the Disk's search and
 * filter bar over the trash, so they are sent, the live backend drops them in
 * silence, and docs/backend-requests.md asks for them.
 */
export interface ITrashParams {
	page?: number;
	perPage?: number;
	search?: string;
	type?: string;
	ownerId?: string;
	access?: string;
	modifiedFrom?: string;
	modifiedTo?: string;
	createdFrom?: string;
	createdTo?: string;
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
	folderId: number | null;
	/**
	 * The drive the object is in now, which is what the restore notice's
	 * «Перейти» opens. Optional: a file carries no section and the live
	 * response does not say — see docs/backend-requests.md.
	 */
	section?: DiskSection | null;
	relocated: boolean;
	/** `restored_to_section_root` and its sentence when relocated; null otherwise. */
	notice: INotice | null;
}

export interface IFileRestore extends IRestoreOutcome {
	file: IFile;
}

export interface IFolderRestore extends IRestoreOutcome {
	folder: IFolder;
}

/**
 * What one pass of "empty the trash" did, and what it left.
 *
 * `skipped` is objects the caller can see in the trash and may not destroy —
 * somebody else's deletions from a shared drive. They stay, and the screen has
 * to say so, or it reports an empty trash that is visibly not empty.
 *
 * `remaining` is work a further pass would do, and **not** what is left in the
 * trash: the backend caps one pass at a batch, and excludes from this figure
 * everything this caller could never destroy, precisely so that a client may
 * loop while it is above zero and be certain the loop ends (TrashService).
 */
export interface ITrashSweep {
	purged: { files: number; folders: number };
	skipped: number;
	/** Folders held back until what they contain has gone. Counted in `remaining`. */
	deferred: number;
	remaining: number;
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
 * has to parse it. `kind` is the backend's UsageScopeKind (`total`, `section`,
 * `module`, `user` today) and is typed as a string rather than that union on
 * purpose: nothing on this side branches on it, and a kind added later must not
 * fail to render.
 */
export interface IUsageScope {
	key: string;
	kind: string;
	value: string;
}

/**
 * The key that names the space as a whole.
 *
 * The one key this application ever writes rather than receives, and only to
 * recognise it in a URL — it is `SpaceUsage::SCOPE_TOTAL`, the address of the
 * headline figure, and not a module, a section or a person.
 */
export const SPACE_SCOPE_KEY = 'total';

/**
 * How old a figure is.
 *
 * `live` is the counter the quota is enforced from, exact when read.
 * `reconciled` was written by the nightly reconciliation, and `measuredAt` says
 * when. `not_measured` means the reconciliation has never run here, so a zero is
 * "not counted yet" rather than "nothing stored" — a different sentence, and the
 * state a new space is actually in.
 */
export type UsageFreshness = 'live' | 'reconciled' | 'not_measured';

/**
 * Where the space stands against its limit, as one word.
 *
 * Four cases and two of them both mean "uploads are refused", kept apart
 * because the ways out differ: `exhausted` is fixed by freeing space or buying
 * more, `not_initialised` by a value arriving from billing that nothing the user
 * does can hurry (QuotaLevel). A union rather than a string because the screen
 * draws each one differently; the renderers still fall through to "show the
 * backend's message" for a level this file has not heard of.
 */
export type QuotaLevel = 'not_initialised' | 'ok' | 'warning' | 'exhausted';

/**
 * The two ways out the backend names, as the codes it sends.
 *
 * Both the banner (`quota.ctas`) and a refused upload (`cta` in the 413 body)
 * carry these, and mapping them to destinations is this application's job —
 * the Disk does not sell storage and has no business knowing where that is
 * done. A code not listed here is not rendered, because there is nowhere this
 * side could honestly send it.
 */
export const QUOTA_CTA = {
	purchaseStorage: 'purchase_storage',
	freeUpSpace: 'free_up_space',
} as const;

/**
 * The space's limit and what is left of it, at one instant.
 *
 * Present on the dashboard only when the figure asked for is the space as a
 * whole, which only an administrator may read — so an ordinary user's
 * dashboard has `quota: null`. The banner does not depend on it: it reads
 * IQuotaBanner, which every member may.
 */
export interface IQuotaStatus {
	level: QuotaLevel;
	/**
	 * Null when the space has never been told a quota. Not zero and not
	 * unlimited: a progress bar has no denominator in that state and must draw
	 * it as its own thing rather than as full.
	 */
	quotaBytes: number | null;
	/** Floored at zero by the server: a space past its limit has none, not a negative amount. */
	availableBytes: number | null;
	/** 1.0 or more when full; above 1 is a valid working state (R8), not an error. */
	usedFraction: number | null;
	/** The fraction at which the warning fires, as this deployment configured it. */
	warningThreshold: number;
	/** The banner sentence, already translated; null when there is nothing to say. */
	message: string | null;
	/**
	 * The ways out, as codes — `purchase_storage`, `free_up_space` — and empty
	 * when there is nothing to offer. The same codes a refused upload carries,
	 * so a banner and a block agree. Mapping a code to a destination is this
	 * application's job; see QuotaCtas.
	 */
	ctas: string[];
}

/**
 * The banner, and nothing it was computed from: `GET /disk/quota`.
 *
 * Every member may read it — PRD Feature 8 shows the banner to whoever opens
 * the Disk — which is exactly why it carries no byte counts: the space's
 * figures are an administrator's (Feature 9). The fields mean what they mean on
 * IQuotaStatus, and the dashboard's `message` and `ctas` are the same words,
 * because the backend builds both in one place.
 *
 * `message` is null when there is nothing true to say. That includes
 * `not_initialised` while the limit is not enforced — the state of every space
 * until billing sends quotas — because "uploads are on hold" would be false.
 */
export type IQuotaBanner = Pick<IQuotaStatus, 'level' | 'message' | 'ctas'>;

/**
 * What the figure asked for holds.
 *
 * `overageBytes` is a marked-out *part* of `usedBytes`, never a figure beside it
 * (R5): integration content admitted past the limit so that a customer does not
 * stop receiving mail. Adding the two together, or drawing them as two bars,
 * reintroduces in the interface the double count the accounting was built to
 * avoid.
 *
 * `trashBytes` is what is in the trash and still counted — an upper bound on
 * what emptying the trash would free, since content a live record still names
 * is released only when that record goes too (R3). It is the figure that moves
 * when somebody deletes a file, because `usedBytes` correctly does not.
 */
export interface IConsumption {
	usedBytes: number;
	overageBytes: number;
	trashBytes: number;
	freshness: UsageFreshness;
	/** When `usedBytes` was reconciled; null when it is live or was never measured. */
	measuredAt: string | null;
}

/**
 * One row of the breakdown.
 *
 * `label` is the server's: a section name it translated, a module name the
 * owning service resolved, or — when nothing could be resolved, and always for
 * a person's drive, since the Disk does not know what people are called — the
 * identifier out of the key, with `labelResolved: false` to say so. No label is
 * computed on this side, for the CON-8 reason every module list in this
 * repository gives.
 */
export interface IStorageBreakdownEntry {
	scope: IUsageScope;
	label: string;
	labelResolved: boolean;
	usedBytes: number;
	overageBytes: number;
}

/**
 * The breakdown: per module, per drive, per person, heaviest first, paged.
 *
 * **`partition` is false, and that is a statement rather than a flag to
 * branch on.** A company file attached to a deal is counted under the company
 * Disk and under the deal's module, once each, so the rows overlap and do not
 * add up to the headline. A stacked bar of them would be wrong, and the screen
 * says so beside the table.
 */
export interface IStorageBreakdown {
	partition: boolean;
	freshness: UsageFreshness;
	measuredAt: string | null;
	entries: IStorageBreakdownEntry[];
	meta: IPageMeta;
	/** `breakdown_not_measured` or `breakdown_empty`, with the server's sentence. */
	emptyState: IEmptyState | null;
	/** A caveat on a complete page — `entity_labels_unavailable` today. */
	notice: INotice | null;
}

/**
 * The dashboard.
 *
 * `administrator` says which of the two answers the viewer got. An
 * administrator asking for nothing in particular is shown the space, with the
 * quota and the breakdown; anybody else is shown their own personal drive, with
 * neither (PRD Feature 9, criteria :296 and :297).
 */
export interface IStorageStats {
	scope: IUsageScope;
	administrator: boolean;
	consumption: IConsumption;
	/** Only for the space as a whole. */
	quota: IQuotaStatus | null;
	/** Only for the space as a whole. */
	breakdown: IStorageBreakdown | null;
}

/**
 * The heaviest files behind one figure.
 *
 * File *records*, heaviest first. The figure above them counts stored content,
 * so in a space where something was copied or attached the list does not add
 * up to its heading: one blob referenced by three files is three rows here and
 * one contribution there (R3). Trashed files are absent — their bytes are in
 * `trashBytes` instead.
 */
export interface IHeaviestFiles {
	scope: IUsageScope;
	files: IFile[];
	meta: IPageMeta;
	emptyState: IEmptyState | null;
}

/**
 * One entity of a module drive by how much it holds — a task, a deal, a chat:
 * the module drive's equivalent of a folder in the drill-down.
 *
 * `usedBytes` sums the records' own sizes, the column the heaviest-files list
 * orders by, so a group is exactly the rows of that list sharing an entity, and
 * the groups add up to it. Like that list they count live records, so they need
 * not add up to the figure on the row, which counts stored content once and
 * includes the trash.
 */
export interface IHeaviestEntity {
	entityType: string;
	/**
	 * Null or empty for records that name the type and no entity — kept as one
	 * group so nothing goes missing, and with nothing to open.
	 */
	entityId: string | null;
	/** The name, or the identifier when nobody could resolve one (`labelResolved: false`). */
	label: string;
	labelResolved: boolean;
	usedBytes: number;
	fileCount: number;
	/** The newest record of the group, in Unix seconds. */
	lastModified: number | null;
}

/** `GET /disk/stats/entities` — a module figure by entity, heaviest first. */
export interface IHeaviestEntities {
	scope: IUsageScope;
	entities: IHeaviestEntity[];
	meta: IPageMeta;
	emptyState: IEmptyState | null;
	/** `entity_labels_unavailable` when nothing on the page could be named; see the breakdown's. */
	notice: INotice | null;
}

/**
 * What the dashboard may be asked for.
 *
 * `scope` is a key exactly as a breakdown row handed it over; leaving it out
 * asks for whatever this viewer is entitled to. There is deliberately no `kind`
 * here although the endpoint accepts one: narrowing the breakdown to one kind of
 * row would mean this application holding the list of kinds, and the breakdown
 * is rendered as data, not as a menu of categories this side decided exist.
 */
export interface IStatsParams {
	scope?: string;
	page?: number;
	perPage?: number;
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
	usedBytes: number;
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
	labelResolved: boolean;
	usedBytes: number;
	types: IStorageTypeUsage[];
}

/** `GET /disk/stats/usage` — the Storage tab's headline, bar and legend. */
export interface IStorageUsage {
	usedBytes: number;
	/** Null while the space has no quota: the bar then has no remainder to draw. */
	quotaBytes: number | null;
	segments: IStorageUsageSegment[];
	/** `storage_empty` and the server's two sentences when nothing is stored at all. */
	emptyState: IEmptyState | null;
}

/** Where an item of the storage-wide listing lives: the segment it is counted in. */
export interface IStorageLocation {
	scope: IUsageScope;
	label: string;
	labelResolved: boolean;
	/** The module's entity type, for the chip's glyph; null on a structural drive. */
	entityType: string | null;
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
	segment: Pick<IStorageUsageSegment, 'scope' | 'label' | 'labelResolved'> | null;
	folders: IStorageFolder[];
	files: IStorageFile[];
	meta: IPageMeta;
	emptyState: IEmptyState | null;
}

/**
 * What the storage-wide listing may be asked for.
 *
 * `scope` is a segment's key, passed back unchanged. The rest is the listing's
 * own vocabulary — the sort keys, the search term and the filter row's
 * parameters — because the table and the header over it are the Disk's.
 */
export interface IStorageItemsParams extends IStatsParams {
	sort?: string;
	order?: 'asc' | 'desc';
	q?: string;
	[filter: string]: string | number | undefined;
}
