# CLAUDE.md

`@uspacy/sdk` — TypeScript client for the Uspacy REST API, consumed by every Uspacy frontend.
No backend, database or Docker here: the SDK is a webpack-built library published to GitHub Packages.

## Setup

```sh
export NPM_AUTH_TOKEN=<github token>   # REQUIRED: .npmrc interpolates it; yarn install fails without it
                                        # ("Failed to replace env in config"). Any value works for a plain install.
yarn install --frozen-lockfile          # Yarn 1 (yarn.lock); `prepare` installs the husky pre-commit hook
yarn build                              # webpack -> lib/index.js, then postbuild emits .d.ts into lib/
```

- Node: the version in the GitHub Actions variable `CORE_TAG` (22.23.4 as of 2026-10). CI reads it; there is
  no `.nvmrc` on purpose, so match it locally by hand.
- `yarn start:dev` — webpack watch + declarations watch, for linking into a consumer app.
- `yarn build:docs` — TypeDoc into `docs/` (deployed to GitHub Pages from `main` by CI).
- `lib/`, `docs/`, `.env` are gitignored — never commit build output.

## Verification

Run before every commit; all must exit 0:

```sh
yarn eslint src      # NOT `yarn eslint .` — after a build it lints lib/*.d.ts and reports ~9000 false errors
yarn typecheck       # tsc --noEmit
yarn build           # catches webpack/declaration-emit failures
```

- `yarn eslint:fix` autofixes `src` (formatting, import order).
- `yarn eslint` runs with `--max-warnings=0`: warnings (unsorted imports, unused vars, `console`) fail it.
- The husky pre-commit hook runs the same eslint on staged `*.{ts,js}` via lint-staged.
- There is no test suite. Do not add test tooling unless the developer asks for it.
- CI on PRs to `main` only checks that the `package.json` version is not already published.

## Conventions

- **Versioning.** Every PR to `main` bumps the patch `version` in `package.json` (0.0.288 -> 0.0.289);
  the `check-version` workflow fails otherwise, and merging to `main` auto-publishes.
- **`stage` branch** publishes with the `alpha` dist-tag. Merge into `stage` only when the developer says so.
  Alpha versions use the format `0.0.999-alpha.N` and go up by one: `0.0.999-alpha.235` -> `0.0.999-alpha.236`.
- **Public API = file paths.** Consumers deep-import `@uspacy/sdk/lib/models/<file>` (~2500 imports across
  the frontends) and `@uspacy/sdk/lib/services/...`. Renaming/moving a file in `src/models` or `src/services`,
  or removing/renaming an exported type, field or method, breaks other repos: agree it with the developer first.
  Prefer adding optional fields and new methods.
- Layout:
  - `src/services/<Name>Service/index.ts` — one `@injectable()` class per backend area, with
    `private namespace = '/<backend>/v1'` and calls via `this.httpClient.client`. Optional request DTOs in
    `dto/` next to it. Return the axios promise; do not unwrap `.data`.
  - `src/models/<kebab-case>.ts` — request/response interfaces (`I`-prefixed) and types.
  - `src/core/` — HttpClient, tokens, session, storage (browser/node variants), config.
  - `src/helpers/` — shared body builders, e.g. `getMassActionsData` for mass actions.
- **A new service is not reachable until it is added to the `Uspacy` constructor in `src/index.ts`**
  (`public readonly xService: XService`). `CouchdbService`, `InviteService` exist but are not wired.
- Write path params as `:name` in the URL and pass `{ urlParams: { name } }` in the axios config;
  HttpClient substitutes and URI-encodes them.
- HttpClient sets `baseURL` from the JWT `domain` claim. Use `{ useAuth: false }` for unauthenticated
  calls and `authToken` to override the token. The localStorage key `REACT_APP_FORCE_API_URL`
  (`{ url, allowOnlyForPaths }`) redirects requests to a local backend.
- **Do not change without the developer's explicit approval** (a bug here hits auth or data in every frontend):
  - `src/core/**`: HttpClient (token refresh, 401 retry, cross-tab lock, logout + `window.location.reload`),
    TokensService, SessionService, SessionStorage, StorageService, ConfigService.
  - `AuthService.login` / `refreshToken` and anything that writes tokens or the remember-session flag.
  - Persisted identifiers: IndexedDB name `Uspacy`, stores `tokens` / `notifications`, keys `token` /
    `refreshToken`, cookie `USPACY.APP.rememberSession`, PouchDB partition key `${domain}-${userId}-${type}`
    (`PouchdbService`). Renaming any of them logs users out or orphans their stored data.
    `MigrationsService` reads `refreshToken` straight from the `tokens` store, bypassing TokensService.
  - Public property names on the `Uspacy` class in `src/index.ts` (consumers call `uspacySdk.<name>`) and
    the extension interfaces `IConfig`, `IStorageService`, `ISessionStorage`.
  - Hardcoded hosts: `getResourcesDomain` in `src/helpers` (`*.uspa.cy` / `*.staging.uspacy.tech`) and
    `couchDbUrl` in ConfigService.
  - Build/publish config: `package.json` `main` / `types` / `files`, `tsconfig*.json`, `webpack.config.js`
    (the `tsyringe` alias), `.npmrc`, `.github/workflows/*`.
- Traps:
  - `src/index.ts` creates the `uspacySdk` singleton at import time, so module-level side effects in a
    service constructor run in every consumer.
  - `ConfigService.config` spreads defaults **after** the user config, so `appPrefix` / `couchDbUrl`
    passed to `createInstance` are ignored. This is intentional; do not "fix" it.
  - `strictNullChecks` is off, so tsc will not catch null/undefined bugs.
- **Never commit or push without the developer's explicit confirmation** — ask every time, even after earlier approvals.
- **Git naming.** Branches: `feat/<ticket>_<short_name>` or `fix/<ticket>_<short_name>`, where `<ticket>`
  is the Uspacy task number. PR title: `[<ticket>]: <short summary of the PR>`; take the number from the
  branch name, and if it is not there, ask the developer. Commit message: a short description of what this
  specific commit does, with no ticket prefix.
- All PR titles and descriptions, commit messages, and replies to review comments are written in English, regardless of the language of the prompt or the conversation.
