/**
 * The shapes the Disk API actually answers with.
 *
 * Taken from the backend's resources rather than from the specification, because
 * the two have drifted before and the resource is what arrives. Keys are
 * camelCase on the wire: the authenticated API converts at the boundary
 * (`ConvertResponseToCamelCase`), and the public link page is written camelCased
 * by hand because that stack deliberately runs no converters.
 *
 * @see files-backend app/Http/Resources/
 */

/**
 * Which drive is being looked at.
 *
 * A string rather than a closed union, and that is not laziness. Backend CON-8
 * forbids the product from holding a whitelist of sections or entity types
 * anywhere: a module added after release has to appear without a code change.
 * The named constants below are the two that are structural — every space has
 * exactly one of each — and everything else comes from `/disk/modules/drives`.
 */
export type DiskSection = string;

export const COMPANY_SECTION = 'company';
export const PERSONAL_SECTION = 'personal';

/**
 * The two assembled views the design lists between the structural drives and
 * the modules: everything somebody shared with me, and what I touched last.
 *
 * Sections by address and not by nature — neither has a root a folder could be
 * created in, which is why neither is a `RootSection` below. They are named
 * here rather than spelled out at each call site for the same reason the two
 * structural drives are, and the mock answers both so the screens are
 * reviewable; the live backend has to grow them before the rows can ship.
 */
export const SHARED_SECTION = 'shared';
export const RECENT_SECTION = 'recent';

/**
 * The section every module drive lives under — and there is exactly one of it.
 *
 * This is the correction that matters most in F4, so it is worth stating
 * plainly: **a module drive is not a section.** `DiskSection` has four values on
 * the backend and `modules` is one of them; the drive within it is addressed by
 * `entity_type` carried as a *value*, never as a path segment.
 *
 * The reason is the backend's, and it applies here unchanged. An entity type is
 * a free string with no whitelist (CON-8) — it is whatever a customer once named
 * a smart object, in whatever alphabet, possibly containing a slash. In a path
 * it would decide which route matched: a type called `folders` would collide
 * with `/disk/:section/folders/:folderId`, and a type with a slash would not
 * route at all. Neither failure arrives with a deploy; both arrive the day
 * somebody names a smart object badly, in production, to one customer.
 *
 * So the drive travels as `?type=`, mirroring ListModuleEntitiesRequest exactly.
 */
export const MODULES_SECTION = 'modules';

/**
 * The two drives that can hold a folder at their top level.
 *
 * Not a violation of the CON-8 rule above, and worth saying why, because it
 * looks like one. "Shared with me" and the module drives are views assembled
 * from shares and from entity attachments — they have no root row, so there is
 * nothing for a folder to be created in. The backend says the same thing with
 * `Rule::in([SECTION_COMPANY, SECTION_PERSONAL])`, so this mirrors a server
 * rule rather than inventing a client one. CON-8 forbids a local list of
 * *modules*; this is a list of the two structural drives, which is a closed set
 * by construction.
 */
export type RootSection = typeof COMPANY_SECTION | typeof PERSONAL_SECTION;

export const isRootSection = (section: DiskSection): section is RootSection => section === COMPANY_SECTION || section === PERSONAL_SECTION;

/**
 * Where a folder is going: inside another folder, or at the top of a drive.
 *
 * A union rather than one object with two optional fields, and that is the whole
 * point of the type. The backend refuses a request carrying both — `parent_id`
 * is `prohibits:section`, and `section` is `required_without:parent_id`
 * (FolderDestinationRequest) — and it refuses one carrying neither. An object
 * with two optionals can express both of those, so the rule would only be
 * enforced at runtime, in a 422 that a user discovers on the caller's behalf.
 *
 * The backend's reason for the exclusivity is worth keeping in view here: a
 * folder's section is derived from its parent, so a request naming both is
 * either redundant or contradictory, and quietly preferring one is how a client
 * comes to believe it filed something in the company drive that went into a
 * personal one.
 */
export type FolderDestination = { parentId: number } | { section: RootSection };

/**
 * A module drive as the place something is moved to.
 *
 * The design's "Виберіть куди перемістити" lists the modules under the two
 * drives and lets any of them — and any of their sub-drives — be chosen, so the
 * picker offers them and the move is sent as it was picked. A module drive has
 * no root row for a folder to be created in, which is why this is not a
 * `FolderDestination`: only a move can name it, and a backend that cannot file
 * an object under a module answers with a refusal the dialog shows.
 */
export type ModuleDestination = { section: typeof MODULES_SECTION; entityType: string };

/** Everywhere a move can end. */
export type MoveDestination = FolderDestination | ModuleDestination;

export const isModuleDestination = (destination: MoveDestination): destination is ModuleDestination =>
	'entityType' in destination && destination.section === MODULES_SECTION;

/** Whether two destinations name the same place. */
export const sameDestination = (one: MoveDestination | null, other: MoveDestination | null): boolean => {
	if (one === null || other === null) {
		return false;
	}

	if ('parentId' in one || 'parentId' in other) {
		return 'parentId' in one && 'parentId' in other && one.parentId === other.parentId;
	}

	if (isModuleDestination(one) || isModuleDestination(other)) {
		return isModuleDestination(one) && isModuleDestination(other) && one.entityType === other.entityType;
	}

	return one.section === other.section;
};

/**
 * The orderings the backend can actually produce.
 *
 * Five, not three, and the values are the `DiskSort` enum's cases verbatim —
 * anything else is refused by `Rule::enum` rather than ignored, so a typo here
 * is a 422 rather than an unsorted listing.
 *
 * `type` and `owner` are real and are not offered by the table yet: sorting by a
 * column that is not on screen is a control whose effect the user cannot see.
 * They arrive with the columns.
 *
 * Two of these mean nothing to a folder — a folder has no extension and no size
 * — and the backend orders folders by name for both rather than refusing, so a
 * client never has to know which sort applies to which half of a listing it is
 * showing as one list.
 */
export type DiskSortKey = 'name' | 'type' | 'size' | 'date' | 'owner';

export type SortOrder = 'asc' | 'desc';

export interface ISortState {
	sort: DiskSortKey;
	order: SortOrder;
}

/** What the backend defaults to when a listing names no ordering. */
export const DEFAULT_SORT: ISortState = { sort: 'name', order: 'asc' };

/**
 * Who can reach an object, as the server's own sentence — «Усі в Просторі»,
 * «Лише ви», a department's name. The design's «ДОСТУП» column.
 *
 * `code` is for the few things the UI does with the answer other than print
 * it; `label` arrives translated and is rendered as it is, so a kind of
 * access added later appears under its own name.
 */
export interface IAccessSummary {
	code: string;
	label: string;
	shared?: boolean;
}

export interface IObjectLocation {
	label: string;
	section: DiskSection;
	folderId: number | null;
}

export interface IFolder {
	id: number;
	name: string;
	section: DiskSection;
	ownerId: number | null;
	creatorId: number | null;
	createdAt: string | null;
	updatedAt: string | null;
	/**
	 * How many things are directly inside — "184 елементи" under a folder card.
	 *
	 * Optional because `FolderResource` does not send it yet (see
	 * docs/backend-requests.md). The card draws the line when the number is
	 * there and leaves it out when it is not, rather than counting the loaded
	 * page: that would be a different number for every folder with more than a
	 * page of children, and wrong in the direction that looks right.
	 *
	 * Items, not files: the design's word is «елементи», and a folder holding
	 * four subfolders and nothing else is not empty.
	 */
	fileCount?: number | null;
	/**
	 * Who can reach the folder — the «ДОСТУП» column. Absent on the live
	 * listings, which carry no such field yet (docs/backend-requests.md); the
	 * column is drawn only for a listing that sends it on at least one row.
	 */
	access?: IAccessSummary | null;
	place?: IObjectLocation | null;
}

/**
 * `url` has two shapes and the one that arrives depends on a backend flag:
 * a permanent public storage URL while `secure_delivery_enabled` is off, and the
 * authenticated delivery route once it is on. Neither is what a download should
 * navigate to — see DiskService.signedUrl() — and only the first can be loaded
 * as it is. See isDirectlyLoadable.
 */
export interface IFile {
	id: number;
	entityType: string | null;
	/**
	 * A string, and not a number, because `files.entity_id` is a varchar(255).
	 *
	 * It was a bigint until 2023, when it was widened so that a file could hang
	 * off a chat message — whose ids are not numbers. Typing it as a number here
	 * described the column as it stopped being three years ago, and the values
	 * that do not survive the round trip are exactly the ones the widening was
	 * for. See AttachFileRequest, which validates it as a string for the same
	 * reason and says so.
	 */
	entityId: string | null;
	uploadId: string | null;
	ownerId: number | null;
	creatorId: number | null;
	originalFilename: string;
	/**
	 * Unix seconds, not an ISO string like a folder's `updatedAt`. The backend
	 * writes `time()` and serialises the column untouched. Read it through
	 * fromUnixSeconds().
	 */
	lastModified: number | null;
	size: number;
	url: string;
	width: number | null;
	height: number | null;
	/** Who can reach the file — the «ДОСТУП» column. Absent until the listing sends it; see IFolder.access. */
	access?: IAccessSummary | null;
	place?: IObjectLocation | null;
	createdAt?: string | null;
	lastOpenedAt?: string | null;
}

/** Just enough of an ancestor to draw the path bar. */
export interface IBreadcrumb {
	id: number;
	name: string;
}

/**
 * The window a listing came from: Laravel's paginator, camelCased at the API
 * boundary, the same four fields the trash answers with.
 *
 * `perPage` is the size the *server* used, which is not always the size that
 * was asked for — it clamps to 200 rather than refusing — so a pager must
 * compute its range from this and never from the number it sent. `lastPage` is
 * how a client knows the forward arrow has somewhere to go without fetching
 * the next page to find out.
 *
 * The index signature stays: this is a server shape and a field added to it
 * must not make the type stop compiling here.
 */
export interface IListingMeta {
	page: number;
	perPage: number;
	total: number;
	lastPage: number;
	[key: string]: unknown;
}

/**
 * Why a listing is empty, said by the server.
 *
 * `code` is the branchable part and `message` is already translated in the
 * space's language — the same division as a refusal. Rendering the message and
 * keeping the code is what lets an empty search say "nothing matched" and an
 * empty folder say "nothing here yet" without this application deciding which
 * emptiness it is looking at.
 */
export interface IEmptyState {
	code: string;
	message: string;
	/**
	 * The second line, when the place can say something more useful than the
	 * title — «Тут з'являтимуться файли, які додані до завдань.»
	 *
	 * It is the server's for the CON-8 reason: the sentence names the module,
	 * and a sentence per module written here would be the whitelist. Absent, the
	 * empty state falls back to describing its own buttons, which is what a
	 * drive that can be uploaded to has to say instead.
	 */
	hint?: string | null;
	/**
	 * The glyphs to draw in the illustration, in the order the design places
	 * them: lower left first, then upper right.
	 *
	 * Tokens, not entity types — `folder`, `task`, `mail` — so that two modules
	 * may share one and a module nobody has drawn for simply has none. An
	 * unknown token draws nothing rather than a placeholder, which is what keeps
	 * a module invented after this shipped from arriving with a broken picture.
	 */
	glyphs?: string[] | null;
}

/**
 * Every id a listing holds, across all of its pages.
 *
 * What "Вибрати всі 156" selects, and the only thing that endpoint returns —
 * see DiskService.listingIds on why ids rather than rows. Two arrays rather
 * than one list of keys, because the server speaks in tables and the client is
 * the thing that knows a selection is keyed by `file-7` / `folder-3`.
 */
export interface IListingIds {
	folders: number[];
	files: number[];
}

export interface IDiskListing {
	section: DiskSection;
	folder: IFolder | null;
	breadcrumbs: IBreadcrumb[];
	/**
	 * True when the trail was cut at the first ancestor the viewer may not see.
	 *
	 * A folder shared out of somebody's private drive is reachable; the folders
	 * above it are not, and their names describe a drive the viewer has no
	 * business seeing — so the backend stops the trail there. It says so with
	 * this flag precisely so a client does not present a cut trail as a whole
	 * one, which is the one place in the Disk where a partial path would read as
	 * a complete one.
	 */
	breadcrumbsTruncated: boolean;
	folders: IFolder[];
	files: IFile[];
	meta: IListingMeta;
	/** Null when the listing has rows. See IEmptyState. */
	emptyState: IEmptyState | null;
}

/**
 * One entry in the module projection: a drive, or an entity inside one.
 *
 * The two levels are one type because the backend serialises them with one
 * function — a drive is "the files attached to things of this type", an entity
 * is "the files attached to this one thing", and the only structural difference
 * is that `entityId` is null on a drive. That nullability *is* the level, and it
 * is the only honest way to ask which one you are holding.
 *
 * `name` is a label the backend resolved; the frontend must not map a type to a
 * label of its own, for the CON-8 reason above. A type nobody has taught the
 * backend about still arrives here with something renderable — which is what
 * `nameResolved` is for: when it is false, `name` is the identifier rather than
 * a name, and a UI that wants to draw a placeholder differently has the fact it
 * needs instead of having to guess from the shape of the string.
 *
 * ## This type used to be `{ id, name, [key: string]: unknown }`
 *
 * There is no `id` on the wire and there never was — the fields are
 * `entity_type`, `entity_id`, `name`, `name_resolved`, `file_count`. The index
 * signature is what let that compile: it types every access as `unknown` rather
 * than as an error, so `entry.id` was `undefined` at runtime and `string` to the
 * compiler, and useDrives turned it into the literal string `'undefined'` for
 * every module drive in the sidebar. An index signature on a response type is
 * not permissiveness, it is the deletion of the check the type existed for.
 */
export interface IModuleNode {
	/** The address, never the title. Rendering this shows a service identifier. */
	entityType: string;
	/** Null on a drive; the entity's own id one level down. Opaque, and a string. */
	entityId: string | null;
	name: string;
	/** False when `name` is the identifier because nobody could resolve one. */
	nameResolved: boolean;
	/** Files under this node *this viewer may see*, which is not the total. */
	fileCount: number;
	/**
	 * The drives this one groups, when it groups any — the second level the
	 * sidebar draws under "Центр комунікацій".
	 *
	 * Optional and absent rather than empty on a leaf, because "this drive has
	 * no sub-drives" and "this response does not describe sub-drives" are the
	 * same thing to a reader and the server says neither today: `/disk/modules/
	 * drives` answers one flat list. Which drives group which is the owning
	 * service's knowledge, not this repository's (CON-8), so it arrives here as
	 * data or not at all — see docs/backend-requests.md.
	 *
	 * A child is a drive in its own right, addressed by its own `entityType`
	 * exactly like its parent. The nesting is presentation; it buys the UI no
	 * new vocabulary.
	 */
	children?: IModuleNode[];
	/**
	 * What the things in this drive are called, in the plural — «Чати та листи»
	 * under "Центр комунікацій" — for the "Відображати:" option that shows them.
	 *
	 * The owning service's word, like `name`, and not derivable from the
	 * children's names. Absent wherever the server has none, which is every
	 * drive the live endpoint describes today (docs/backend-requests.md); the
	 * option then falls back to the level's own name.
	 */
	entitiesName?: string | null;
	/**
	 * When this entity's files were last touched, ISO, as the design's date
	 * column shows it. Absent where the projection does not carry it.
	 */
	modifiedAt?: string | null;
	/** Who touched them last. Absent for the same reason. */
	ownerId?: number | null;
	/** How the platform opens this thing. Absent where nobody said. See IModuleDrawer. */
	drawer?: IModuleDrawer | null;
	access?: IAccessSummary | null;
}

/**
 * Which service owns a module, and under what code, so the platform's drawer
 * can open one of its things.
 *
 * It is a field on the response rather than a map here, and that is the whole
 * point: `service` has three values and `entityCode` is the owning service's
 * own vocabulary, so pairing either with an entity type is knowledge only the
 * backend has. A `switch (entityType)` in a component would open a smart object
 * created next year into nothing at all, and would do it silently.
 *
 * `service` is the drawer's own union rather than a free string, because the
 * drawer is the consumer and accepts exactly those three. A fourth would be a
 * change in the platform, not in a customer's data.
 */
export interface IModuleDrawer {
	// The multi-drawer service that opens the entity; the union the store's drawers slice declares
	service: 'task' | 'crm' | 'messenger';
	/** The owning service's name for this kind of thing, e.g. `tasks`, `deals`. */
	entityCode: string;
}

export interface IModuleListing {
	section: DiskSection;
	/** Null at the top, where the entries are drives; the opened drive one level in. */
	drive: IModuleNode | null;
	entries: IModuleNode[];
	meta: IListingMeta;
	/** Null when the listing has rows. See IEmptyState. */
	emptyState: IEmptyState | null;
	/**
	 * A degradation, not an emptiness — and the distinction is the whole reason
	 * this is a separate field rather than folded into `emptyState`.
	 *
	 * It says the page is complete and its entries are right, but that none of
	 * them could be named. A populated drive that reported itself as empty would
	 * be the worse lie, so a client must render both, and must not treat the
	 * presence of one as the absence of the other.
	 *
	 * Same `{code, message}` shape as `emptyState`, deliberately: the backend
	 * builds both with one function precisely so the two cannot drift, and giving
	 * them different types here would undo that at the boundary. It was typed
	 * `string | null` until F4, which was not a narrowing but a different type —
	 * rendering it put an object into JSX, and React throws on that.
	 */
	notice: IEmptyState | null;
}

/**
 * A page of files and nothing else — what the picker answers with.
 *
 * Deliberately not `IDiskListing` with the other fields made optional. The
 * picker names no place, so it has no section, no folder and no trail; typing
 * those as "sometimes there" would invite a caller to check for them, and the
 * check would never once succeed. See DiskService.picker.
 */
export interface IFilePage {
	files: IFile[];
	meta: IListingMeta;
}

/**
 * How storage should serve a signed URL: shown in place, or saved. The
 * backend's `Disposition` enum verbatim — it is validated with `Rule::enum`, so
 * anything else is a 422 rather than a fallback.
 */
export type Disposition = 'inline' | 'attachment';

export type ShareableType = 'file' | 'folder' | 'drive';

/**
 * What names the thing being shared: a file's or a folder's id, or — for a
 * whole drive — its section. A drive has no row and so no numeric id; the
 * design's «Надати доступ» on «Мій диск» shares the caller's own personal
 * drive, which the section says completely.
 */
export type ShareableId = number | RootSection;

/**
 * Who a grant can name, as the design's panel offers them.
 *
 * `user` and `department` are stored by the backend today. `role` and
 * `everyone` are drawn by the design as ordinary choices, so the panel offers
 * them as such and sends them like any other grant; a backend that cannot
 * honour one answers `grantee_type_unsupported`, and the panel shows that
 * sentence rather than hiding the choice in advance.
 */
export type GranteeType = 'user' | 'department' | 'role' | 'everyone';

/** The level a stored grant carries on the wire. */
export type SharePermission = 'view' | 'edit';

/**
 * The four things the design's "Доступ" list lets a grant allow.
 *
 * "Повний доступ" is not a fifth verb: it is all four together.
 */
export type ShareVerb = 'view' | 'create' | 'edit' | 'delete';

export const SHARE_VERBS: ShareVerb[] = ['view', 'create', 'edit', 'delete'];

/**
 * The single level a set of verbs amounts to.
 *
 * The wire still carries one level, so the set is sent beside it rather than
 * instead of it: anything that changes the object is `edit`, and looking alone
 * is `view`.
 */
export const levelOf = (verbs: ShareVerb[]): SharePermission => (verbs.some((verb) => verb !== 'view') ? 'edit' : 'view');

/** The verbs a stored grant allows: its own list if it has one, otherwise what its level means. */
export const verbsOf = (share: { permission: SharePermission; permissions?: ShareVerb[] | null }): ShareVerb[] => {
	if (Array.isArray(share.permissions) && share.permissions.length > 0) {
		return SHARE_VERBS.filter((verb) => (share.permissions as ShareVerb[]).includes(verb));
	}

	return share.permission === 'edit' ? [...SHARE_VERBS] : ['view'];
};

export interface IShare {
	id: number;
	shareableType: ShareableType;
	shareableId: ShareableId;
	granteeType: GranteeType;
	granteeId: number;
	permission: SharePermission;
	/** The exact verbs, when the backend stores them; absent, `permission` is all there is. */
	permissions?: ShareVerb[] | null;
	createdBy: number;
	createdAt: string | null;
	updatedAt: string | null;
}

/**
 * The response to creating an external link.
 *
 * `url` arrives exactly once. The backend stores only a digest of the token, so
 * there is no endpoint that can produce this URL again — the dialog that shows
 * it is the only chance the user gets, and the UI has to say so.
 */
export interface IExternalLink {
	url: string;
	/** Null is "no term": the design lets a link stand until it is turned off or deleted. */
	expiresAt: string | null;
	/**
	 * The link's own identifier. An object can carry several links, and this is
	 * what addresses one of them. Absent from a backend that still keeps one
	 * link per object and answers with the address alone.
	 */
	id?: number;
	/** Whether the link works. Absent means it does; a link past its term does not, whatever this says. */
	active?: boolean;
	/** What the link's holder may do, when the backend stores it. */
	permissions?: ShareVerb[] | null;
}

/**
 * What may be asked for when minting a link: when it stops working.
 *
 * `expiresAt`, an ISO timestamp, and nothing else — StoreExternalLinkRequest
 * validates exactly one field. This said `expiresInDays` and `cta` until the
 * link UI was built, and neither exists on the backend: the first would have
 * been dropped and every link given the default term while the user believed
 * they had chosen one.
 *
 * Optional, and bounded by the backend rather than here: it must be after now
 * and within the configured maximum (90 days as shipped), and a value outside
 * that is refused with a sentence naming the limit — not clamped. Sending
 * nothing is legitimate and gets the default term (30 days as shipped), never
 * "no expiry": an external link that does not end is not a thing this product
 * creates.
 */
export interface IExternalLinkPayload {
	/** An ISO timestamp, or null to take a term away again. Left out, the term is not touched. */
	expiresAt?: string | null;
	/** What the link's holder may do, as the design's "Доступ" field picks it. */
	permissions?: ShareVerb[];
	/** The design's «Активувати» switch. */
	active?: boolean;
}

export interface IStorageTotals {
	size: number;
	[key: string]: unknown;
}

/**
 * One of the places an entity's files come from, drawn as a folder: a group's
 * «Стрічка новин» and «Завдання».
 *
 * A group's files are not attached to the group itself. They hang off its
 * posts and its tasks, and the design's Disk tab on a group shows those two as
 * folders with the files inside. Which sources an entity has, and what they
 * are called, is the owning service's knowledge (CON-8), so they arrive as
 * data: `code` is what the files request is narrowed by, `name` is printed.
 */
export interface IEntitySource {
	code: string;
	name: string;
	fileCount: number;
	ownerId: number | null;
	createdAt: string | null;
	updatedAt: string | null;
	access?: IAccessSummary | null;
}
