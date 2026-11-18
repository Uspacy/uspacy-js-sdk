/**
 * The shapes the Disk API actually answers with.
 *
 * Keys are snake_case on the wire in both directions, as the backend writes
 * them: the Disk's routes run no case converter, and neither does this client.
 * The contract is docs/backend-final.uk.md.
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
 * So the drive travels in the query: `?type=` in the page's own address, and
 * `entity_type` in the API's (docs/backend-final.uk.md, п. 10).
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
export type FolderDestination = { parent_id: number } | { section: RootSection };

/**
 * A module thing's own place an upload can land in: the «Завдання» folder of a
 * group's disk. Files only — such a place has no folders of its own — and the
 * file is the entity's, under that source (docs/backend-final.uk.md, п. 11).
 */
export interface IEntityDestination {
	entity_type: string;
	entity_id: string;
	source: string;
}

/** Everywhere an upload can land. */
export type UploadDestination = FolderDestination | IEntityDestination;

export const isEntityDestination = (destination: UploadDestination): destination is IEntityDestination => 'entity_id' in destination;

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
export type ModuleDestination = { section: typeof MODULES_SECTION; entity_type: string };

/** Everywhere a move can end. */
export type MoveDestination = FolderDestination | ModuleDestination;

export const isModuleDestination = (destination: MoveDestination): destination is ModuleDestination =>
	'entity_type' in destination && destination.section === MODULES_SECTION;

/** Whether two destinations name the same place. */
export const sameDestination = (one: MoveDestination | null, other: MoveDestination | null): boolean => {
	if (one === null || other === null) {
		return false;
	}

	if ('parent_id' in one || 'parent_id' in other) {
		return 'parent_id' in one && 'parent_id' in other && one.parent_id === other.parent_id;
	}

	if (isModuleDestination(one) || isModuleDestination(other)) {
		return isModuleDestination(one) && isModuleDestination(other) && one.entity_type === other.entity_type;
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
	/**
	 * Whether somebody other than the owner reaches the object through a grant
	 * or through the entity it hangs off — the design's «shared» mark on a
	 * folder's tile. The server's call, like the rest of the summary: a company
	 * drive's folder is everybody's by the drive's own rule and is not marked,
	 * a folder somebody shared out of it is.
	 */
	shared?: boolean;
	/** The first few people with access, for the chip's avatars — «Марта +13». */
	user_ids?: number[];
	/** How many people have access in all, through any grant, the drive's rule or the entity. */
	people_count?: number;
}

/** «Список користувачів»: everybody who can reach an object, a page at a time. */
export interface IAccessPeople {
	user_ids: number[];
	meta: IListingMeta;
}

/**
 * Where an object lives: the folder it is in, or its drive when it sits at the
 * top of one — the details panel's «Розташування».
 *
 * `label` is the folder's or the drive's name as the server would print it;
 * `folderId` is null at a drive's root. Sent by the server because neither a
 * file nor a folder carries its parent, and a drive's name is not something
 * this side may derive from a section code (CON-8).
 */
export interface IObjectLocation {
	label: string;
	section: DiskSection;
	folder_id: number | null;
	/** In a module: the drive, so the chip opens it… */
	entity_type?: string | null;
	/** …and the entity, when the place is one. */
	entity_id?: string | null;
}

export interface IFolder {
	id: number;
	name: string;
	section: DiskSection;
	owner_id: number | null;
	creator_id: number | null;
	created_at: string | null;
	updated_at: string | null;
	/**
	 * How many things are directly inside — "184 елементи" under a folder card.
	 *
	 * Sent with every folder (docs/backend-final.uk.md, п. 3). Optional only so a
	 * response without it still renders: the card draws the line when the number
	 * is there and leaves it out when it is not, rather than counting the loaded
	 * page: that would be a different number for every folder with more than a
	 * page of children, and wrong in the direction that looks right.
	 *
	 * Items, not files: the design's word is «елементи», and a folder holding
	 * four subfolders and nothing else is not empty.
	 */
	file_count?: number | null;
	/**
	 * Who can reach the folder — the «ДОСТУП» column (docs/backend-final.uk.md,
	 * п. 3.3). The column is drawn only for a listing that sends it on at least
	 * one row.
	 */
	access?: IAccessSummary | null;
	/** The folder or drive this one sits in (п. 3.4); see IObjectLocation. */
	place?: IObjectLocation | null;
	/** Who last changed the folder or what is in it — «Ким змінено». */
	modified_by?: number | null;
	/** Bytes in the subtree, trash excluded — «Розмір папки», and the Storage tab's size column. */
	size?: number | null;
	/** True when the drive's own rule is switched off for this folder — see IAccessState. */
	restricted?: boolean;
	/** What this viewer may do with the folder; the menus offer only that. */
	permissions?: IRowPermissions | null;
	/** Whether the picker lets this viewer attach it. */
	attachable?: boolean;
	/** When this viewer last opened the folder, ISO — «Останні». */
	last_opened_at?: string | null;
	/** «Доступні мені»: when the grant that brought it here was made, and by whom. */
	shared_at?: string | null;
	shared_by?: number | null;
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
	entity_type: string | null;
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
	entity_id: string | null;
	upload_id: string | null;
	owner_id: number | null;
	creator_id: number | null;
	original_filename: string;
	/**
	 * Unix seconds, not an ISO string like a folder's `updatedAt`. The backend
	 * writes `time()` and serialises the column untouched. Read it through
	 * fromUnixSeconds().
	 */
	last_modified: number | null;
	size: number;
	url: string;
	width: number | null;
	height: number | null;
	/** Who can reach the file — the «ДОСТУП» column (п. 3.3); see IFolder.access. */
	access?: IAccessSummary | null;
	/** The folder or drive the file sits in (п. 3.4); see IObjectLocation. */
	place?: IObjectLocation | null;
	/** When the record was created, ISO — the panel's «Створено». The live resource carries only `lastModified`. */
	created_at?: string | null;
	/** When this viewer last opened the file, ISO — the panel's «Відкрито». Null when they never have. */
	last_opened_at?: string | null;
	/** Who last replaced, renamed or moved the file — «Ким змінено». */
	modified_by?: number | null;
	/** Pages in a document — the viewer's «із N»; null where the type has none or it is not known yet. */
	page_count?: number | null;
	/** A signed, short-lived preview for the grid's tile; null until generated, and for types with none. */
	thumbnail_url?: string | null;
	/** The thing the file hangs off, named by its owning service — the entity chip. */
	entity?: IEntityRef | null;
	restricted?: boolean;
	permissions?: IRowPermissions | null;
	attachable?: boolean;
	shared_at?: string | null;
	shared_by?: number | null;
}

/** What this viewer may do with one object, resolved by the server with the listing. */
export interface IRowPermissions {
	verbs: ShareVerb[];
	can_share: boolean;
}

/** The thing a file hangs off, as its owning service names it. */
export interface IEntityRef {
	type: string;
	id: string;
	name: string;
	name_resolved: boolean;
	/** A glyph token owned by the design: task, chat, mail, lead, deal… Unknown tokens draw a generic mark. */
	icon: string | null;
}

/** Just enough of an ancestor to draw the path bar. */
export interface IBreadcrumb {
	id: number;
	name: string;
}

/**
 * The window a listing came from — the same four fields the trash answers
 * with, snake_case like every other key.
 *
 * `per_page` is the size the *server* used, which is not always the size that
 * was asked for — it clamps to 200 rather than refusing — so a pager must
 * compute its range from this and never from the number it sent. `last_page` is
 * how a client knows the forward arrow has somewhere to go without fetching
 * the next page to find out.
 *
 * The index signature stays: this is a server shape and a field added to it
 * must not make the type stop compiling here.
 */
export interface IListingMeta {
	page: number;
	per_page: number;
	total: number;
	last_page: number;
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
	breadcrumbs_truncated: boolean;
	folders: IFolder[];
	files: IFile[];
	meta: IListingMeta;
	/** Null when the listing has rows. See IEmptyState. */
	empty_state: IEmptyState | null;
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
	entity_type: string;
	/** Null on a drive; the entity's own id one level down. Opaque, and a string. */
	entity_id: string | null;
	name: string;
	/** False when `name` is the identifier because nobody could resolve one. */
	name_resolved: boolean;
	/** Files under this node *this viewer may see*, which is not the total. */
	file_count: number;
	/** The glyph token the design owns — `task`, `chat`, `deal`… See ModuleGlyph. */
	icon?: string | null;
	/**
	 * The drives this one groups, when it groups any — the second level the
	 * sidebar draws under "Центр комунікацій".
	 *
	 * Optional and absent rather than empty on a leaf, because "this drive has
	 * no sub-drives" and "this response does not describe sub-drives" are the
	 * same thing to a reader and the server says neither today: `/disk/modules/
	 * drives` answers one flat list. Which drives group which is the owning
	 * service's knowledge, not this repository's (CON-8), so it arrives here as
	 * data or not at all — see docs/backend-final.uk.md.
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
	 * drive the live endpoint describes today (docs/backend-final.uk.md); the
	 * option then falls back to the level's own name.
	 */
	entities_name?: string | null;
	/**
	 * When this entity's files were last touched, ISO, as the design's date
	 * column shows it. Absent where the projection does not carry it.
	 */
	modified_at?: string | null;
	/** Who touched them last. Absent for the same reason. */
	owner_id?: number | null;
	/** How the platform opens this thing. Absent where nobody said. See IModuleDrawer. */
	drawer?: IModuleDrawer | null;
	/** Who can reach the entity's files — its participants — and so whether its tile carries the «shared» mark. */
	access?: IAccessSummary | null;
	/** What the viewer may do with the entity: open it always; share it only with `can_share`. */
	permissions?: IRowPermissions | null;
	/** For «Про папку»: the bytes of its files the viewer sees. */
	size?: number;
	/** For «Розташування»: the module drive it is in. */
	place?: IObjectLocation | null;
	/** Who added or changed its newest file. */
	modified_by?: number | null;
	/** When the viewer last opened it on the Disk. */
	last_opened_at?: string | null;
	/** Who added its first file, and when. */
	creator_id?: number | null;
	created_at?: string | null;
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
	entity_code: string;
}

export interface IModuleListing {
	section: DiskSection;
	/** Null at the top, where the entries are drives; the opened drive one level in. */
	drive: IModuleNode | null;
	entries: IModuleNode[];
	meta: IListingMeta;
	/** Null when the listing has rows. See IEmptyState. */
	empty_state: IEmptyState | null;
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

export type ShareableType = 'file' | 'folder' | 'drive' | 'entity';

/** A module's thing, shared as the folder it is drawn as: addressed by its type and id, never in a path. */
export interface IEntityKey {
	entity_type: string;
	entity_id: string;
}

/**
 * What names the thing being shared: a file's or a folder's id, or — for a
 * whole drive — its section. A drive has no row and so no numeric id; the
 * design's «Надати доступ» on «Мій диск» shares the caller's own personal
 * drive, which the section says completely.
 */
export type ShareableId = number | RootSection | IEntityKey;

/**
 * The four things the design's "Доступ" list lets a grant allow.
 *
 * "Повний доступ" is not a fifth verb: it is all four together, and it is also
 * what lets the holder manage the object's access.
 */
export type ShareVerb = 'view' | 'create' | 'edit' | 'delete';

export const SHARE_VERBS: ShareVerb[] = ['view', 'create', 'edit', 'delete'];

/**
 * What a grant can allow on a kind of object.
 *
 * - `view` — see it, open it, download it;
 * - `create` — add files and folders inside; a folder's, a drive's and a module
 *   thing's, never a file's, which has no inside;
 * - `edit` — change it: rename it, replace it, move it;
 * - `delete` — delete it.
 *
 * «Повний доступ» is every verb the object can have, and also the right to
 * manage its access.
 */
export const verbsFor = (type: ShareableType): ShareVerb[] => (type === 'file' ? ['view', 'edit', 'delete'] : [...SHARE_VERBS]);

/** Who a grant can name under «Вибрати користувачів». «Усі в Просторі» is a mode, not a grantee. */
export type GranteeType = 'user' | 'department' | 'role';

/**
 * The three cards of the sharing panel.
 *
 * - `private` — «Лише ви»: the drive's own rule is switched off and nobody is granted anything.
 * - `chosen` — «Вибрати користувачів»: the rule is off and `grants` say who may do what.
 * - `space` — «Усі в Просторі»: everybody in the space may do `space_permissions`.
 */
export type AccessMode = 'private' | 'chosen' | 'space';

export interface IGrant {
	grantee_type: GranteeType;
	grantee_id: number;
	/** The person's, department's or role's name; sent by the server, ignored on the way in. */
	grantee_label?: string;
	permissions: ShareVerb[];
}

/**
 * One external link, with its own term and switch. `url` arrives every time.
 *
 * A link has no access level of its own: whoever holds it may look at the file
 * or folder and download it — the one level there is.
 */
export interface IExternalLink {
	id: number;
	url: string;
	/** Null is "no term": the link stands until it is switched off or deleted. */
	expires_at: string | null;
	active: boolean;
}

/** What a link is created with, or what a saved panel says about one. */
export interface IExternalLinkPayload {
	expires_at?: string | null;
	active?: boolean;
}

/** A link as the panel saves it: which one, and everything it should now say. */
export type IExternalLinkSettings = { id: number } & Required<IExternalLinkPayload>;

/**
 * Everything the sharing panel shows, read in one request and saved in one.
 *
 * Saving is a replacement: grants and links that are not in the body are gone
 * afterwards. That is what makes «Зберегти» one request and one transaction,
 * whatever the user changed.
 */
export interface IAccessState {
	mode: AccessMode;
	grants: IGrant[];
	/** What everybody may do under `space`; null in the other modes. */
	space_permissions: ShareVerb[] | null;
	external_links: IExternalLink[];
	/** Access that reaches the object from a folder above it or from its drive, said in a sentence. */
	inherited?: { label: string; from: IObjectLocation } | null;
}

/** The body of a save: the state without what only the server can say. */
export interface IAccessUpdate {
	mode: AccessMode;
	grants: Pick<IGrant, 'grantee_type' | 'grantee_id' | 'permissions'>[];
	space_permissions: ShareVerb[] | null;
	external_links: IExternalLinkSettings[];
}

// ------------------------------------------------------------ mass actions

/**
 * The listing a «Вибрати всі N» was made in, so the server can find the
 * objects itself: a drive and folder, a search, a module drive or entity, the
 * trash — and the filter row's parameters, as the listing sent them.
 */
export interface ISelectionScope {
	section?: DiskSection;
	folder_id?: number | null;
	entity_type?: string;
	entity_id?: string;
	source?: string;
	/** With `entity_type`: the drive's things as the rows — the «Відображати: Завдання» level — not its files. */
	entities?: boolean;
	q?: string;
	[filter: string]: string | number | boolean | null | undefined;
}

/**
 * Which objects a mass action is about — as CRM's mass actions take them.
 *
 * Either the ids that were ticked, or the whole listing a «Вибрати всі» was made
 * in, minus what was unticked afterwards. A folder stands for its subtree.
 */
export type ISelection =
	| {
			all: false;
			folder_ids: number[];
			file_ids: number[];
			/** A module drive's things, ticked as rows — their files, for «Надати доступ» and «Завантажити». */
			entity_keys?: IEntityKey[];
	  }
	| {
			all: true;
			scope: ISelectionScope;
			except_folder_ids: number[];
			except_file_ids: number[];
			/** With `scope.entities`: the things unticked after «Вибрати всі». */
			except_entity_keys?: IEntityKey[];
	  };

/** One object a mass action could not act on, and why, in the refusal's own terms. */
export interface IMassFailure {
	type: 'folder' | 'file' | 'entity';
	/** A folder's or a file's id; for a module's thing, `tasks:5062`. */
	id: number | string;
	name: string;
	code: string;
	message: string;
	suggestion?: string;
}

/**
 * The answer to a mass action: what was done, what was not and why, and how
 * to take it back. A refusal on one object does not stop the others.
 */
export interface IMassResult {
	done: { folders: number[]; files: number[]; entities?: IEntityKey[] };
	failed: IMassFailure[];
	/** Hand to `undo` while the notice is up; null when there is nothing to take back. */
	undo_token: string | null;
}

/** «Створити нову папку» over a selection: the folder is made and everything moved into it, at once. */
export interface INewFolderDestination {
	new_folder: { name: string } & FolderDestination;
}

export type IMassMoveDestination = MoveDestination | INewFolderDestination;

export interface IMassMoveResult extends IMassResult {
	/** The folder «Створити нову папку» made; absent for an ordinary move. */
	folder?: IFolder;
}

/** What a reversible single action answers with: the token its notice's «Скасувати» sends back. */
export interface IUndoable {
	undo_token: string | null;
}

/** One folder of a tree made in one request, by the path it was asked for under. */
export interface IFolderTreeEntry {
	path: string;
	folder: IFolder;
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
	file_count: number;
	owner_id: number | null;
	created_at: string | null;
	updated_at: string | null;
	access?: IAccessSummary | null;
}
