# DM Guru Campaign Planner + FoundryVTT Companion Module

## Context
A good campaign/adventure planner has been a DM Guru goal for a long time. The original Campaign / Adventure /
Encounter models were removed in commit `64b97d39` (2020-11-26), so this starts fresh. The Foundry side already
has map hosting, Patreon-gated premium access and a dnd5e v13 actor export (`Monster#export_foundry_vtt`).

The user plans **from a need**:
- *Time-boxed arc:* "a ~6-week campaign where the PCs survive and stop a zombie apocalypse in Greyhawk".
- *Open sandbox:* "a homebrew Greyhawk campaign with main + side quests, a BBEG, minor villains, NPCs, etc."

Decisions already made:
- The planner is **free** for logged-in DMs.
- **The planner has no AI; the site's older AI tools are unchanged.** The planner's own AI (draft a plan, prep
  suggestions, recaps), the bring-your-own OpenAI key and the hosted key were removed on 2026-10-19.
- Foundry sync is Patreon-premium, alongside the existing premium maps.
- Foundry integration is **full two-way sync**.
- The planner is **2024-only** and works with the 2024 Player's Handbook, Dungeon Master's Guide and Monster
  Manual through book references (name and page), never their text or stat blocks.
- It uses DM Guru's existing generators as helpers: random names, tavern names, adventure hooks, and the NPC
  stat-block generator.
- Everything ships in one PR.

## Status (2026-10-19)
- **Phase 0 (done):** map admin endpoints locked down, Patreon linked to accounts, personal API tokens and
  `GET /v1/foundry/me`.
- **Phase 1 (done):** planner models and API, the campaign wizard with templates, campaign tabs (Overview,
  Story, Quests, Cast, Places, Secrets, Sessions, Books), session prep (8 steps) and run mode, Three Clue Rule
  check, dashboard widgets (Next Session, Campaign Clocks), book references.
- **Phase 2 (dropped):** the planner has no AI.
- **Phases 3 and 4 (done):**
  - DM Guru sync endpoints: `GET /v1/foundry/campaigns`, `GET` and `POST /v1/foundry/campaigns/:uuid/changes`.
  - The module (0.1.0) is at github.com/jesshmusic/dorman-lakelys-campaign-planner. It links with a pasted API
    token.
  - Tested end to end in a live Foundry v14 world: linking, full pull, pushes from Foundry, pulls from DM Guru
    and the conflict dialog.
- **Compendium index (done):** the module sends the index of the DM's SRD 5.2 and 2024 core book compendiums.
  Planner searches use it, and picks become draggable compendium links in the session journals. Each campaign
  chooses its compendiums (a sidebar on New Campaign, and a list on Overview). See "The 2024 core books".
- **Party (done):**
  - The module sends each Foundry world's Player Character actors (not NPCs, even ones a player owns) to the
    DM's account, when the GM loads the world and a few seconds after a sheet changes.
  - A sheet holds what the player built: stats, saves, skills, class levels, spellcasting and slots, the names
    of spells, features and gear, personality and backstory. It leaves out rules text, and values that change
    every round, like current HP.
  - Each campaign picks its party from them: a name, class, level and player list on New Campaign ("Who's
    playing?") and on the Party tab, which also shows each party member's full sheet.
  - Session prep step 1 lists the party with quick stats, bonds and flaws.
- **Guided setup (done, web and Foundry):**
  - New Campaign is a six-step guide: what kind of game, the pitch, the table (party, players, levels, sessions),
    the world (setting and truths), your books (compendiums), then review and create.
  - Each step has a short "Why this matters" with an example. The copy for every step lives in
    `pages/campaigns/setup/setupSteps.ts`.
  - The answers are saved in the browser as the DM goes, so leaving the page doesn't lose them.
  - Creating the campaign opens it.
  - The Overview tab shows a "Getting started" checklist (party, threat, cast, secrets, first session) until it's
    done or hidden.
  - The Foundry module has the same guide, opened from the Connect window and the Campaign Dashboard.
    Its copy lives in the module's `scripts/setup.mjs`; keep it in step with `setupSteps.ts`.
    - It creates the campaign through `POST /v1/foundry/campaigns`. Creating is free, like on the web; listing
      and syncing stay premium.
    - The party's character sheets go with the request, and are saved like `POST /v1/foundry/characters` saves
      them.
    - A `request_id` makes a retried create return the same campaign.
    - Errors come back with the fields they're about, so the guide can return to the right step.
    - With premium, the world links to the new campaign and opens the Dashboard.
    - Drafts are kept per world in a client setting.
  - Campaigns have at most six truths. Older campaigns with more can still be edited.

- **Planning in Foundry, no account (done, module):**
  - Most DMs will find this through the module, and some won't want a website at all. They can plan entirely in
    Foundry. Dungeon Master Guru is the step up: planning on the website, sync with Foundry, compendium search,
    party sheets and map thumbnails.
  - The module's guide can create a campaign in the world itself: the same journals, records and template
    structure as Dungeon Master Guru (its templates are ported to `scripts/local.mjs`).
  - The Campaign Dashboard runs it, saving changes to the journals, and adds threats, secrets, quests, NPCs, places,
    factions and sessions.
  - The Journal sidebar has Campaign, New, Open and help buttons. Open switches between campaigns in the world and
    on Dungeon Master Guru.
  - A "How it works" window explains both ways to plan, and opens once on a GM's first load.

- **Maps, actors, treasure and quests (done on the web; module in progress):**
  - Places, sessions and quests use Foundry scenes as maps: a place has one (`foundry_scene_uuid`,
    `foundry_scene_name`), sessions and quests up to 20 (`foundry_scenes`). The DM picks them on the website, from a
    searchable grid of their scenes' thumbnails grouped by world (`ScenePicker`, from `GET /v1/foundry_scenes`), or
    in Foundry by dropping a scene. Both ways sync (`location`, `session` and `quest` pushes).
  - In Foundry, the DM drops an actor on an NPC for their stat block. It syncs (`npc` push); the website shows it but
    doesn't edit it.
  - Sessions have treasure coins (`treasure_currency`: pp, gp, ep, sp, cp), and treasure links have a quantity.
  - Quests hold their maps, the NPCs involved (besides the giver), monsters for their encounters (DM Guru SRD
    monsters or book references) and a reward: items with how many (SRD items or book references), coins
    (`reward_currency`), XP (`reward_xp`) and/or a milestone ("level up when done"), plus the reward notes
    (`reward`).
    - NPCs, monsters and items are `campaign_quest_links`, shaped like session links and synced as part of the
      quest (changing one bumps the quest). Deleting the NPC, book reference, monster or item removes its links.
    - On the web, "Plan quest" on the Quests tab edits them, like session prep; each quest card shows them, and run
      mode shows each open quest's reward.
    - Foundry can change any of a quest's fields and its links, like a session's (see "Editing DM Guru campaigns from
      Foundry").
- **Send to Dungeon Master Guru (done on the web; module in progress):**
  - A campaign planned in Foundry without an account is uploaded whole with `POST /v1/foundry/campaigns/import`
    (`CampaignImporter`). Like creating one, it's free; listing and syncing stay premium. `request_id` and `party`
    work as they do for `POST /v1/foundry/campaigns`.
  - The body is the campaign and `records: { factions, references, locations, npcs, fronts, quests, sessions,
    secrets }`, in the shapes the sync pull returns. Each record has a local `id` that the others use to point at it
    (`factionId`, a link's `linkableId`); `uuid`, `syncVersion` and unknown keys are ignored.
  - It all saves in one transaction, in dependency order, with those references pointed at the new records. Parents
    (places, quests) are set in a second pass, then the sessions' and quests' links with their quantities. A
    reference to an id that wasn't sent is left empty, and a link to one is skipped. Links to monsters and items keep
    their DM Guru ids.
  - The `201` response is the new campaign (as `create` returns it) plus `ids`, mapping each local id, the campaign's
    and every record's, to its new uuid. The module re-tags its journals with them and pulls with `since=0`.
  - Any problem saves nothing and returns `422` with every error, each naming the collection and record
    ("Quests: Find the crypt: Name can't be blank"). It takes up to 500 records per collection and 100 links per
    session or quest.
- **Scene thumbnails (done):**
  - The module sends a 640×360 WebP thumbnail of every scene in the world that has a map image, made with
    Foundry's `Scene#createThumbnail`, to `POST /v1/foundry/scenes` (premium, like sync), so the website can offer
    them as maps. It sends again only when what the thumbnail shows changes: the scene's size, levels or tiles, not
    tokens or walls. `DELETE /v1/foundry/scenes?world=&uuid=` removes a scene deleted in Foundry, with its image.
  - Dungeon Master Guru keeps them in S3's public `thumbnails/scenes/` path (`FoundryScene`, up to 500 per world),
    so they show on the Places and Quests tabs, in session prep and in run mode while Foundry is closed. The
    campaign's `sceneThumbnails` maps the UUIDs of the scenes it uses (places', sessions' and quests' maps) to them.
  - Scenes without a map image, and 3D Canvas scenes, get no thumbnail; they show by name.
- **Planner modals and search selects (done, web):**
  - Plan the quest, session prep, and every add and edit form open in a modal. Nothing saves until Save; Cancel
    asks before throwing changes away. Session prep's Prep tab shows the plan read-only, with a "Prep this
    session" button; run mode's session log still saves as you type.
  - Dropdowns filter as you type (react-select, `components/SearchSelect.tsx`). Linking NPCs, secrets and
    places is a multi-select; monster and item search fills in as you type, with the campaign's book references
    first.
  - Compendium search matches the start of words, so "gh" finds Ghoul but not Knight.
- **Device-code linking (done):** the DM links Foundry with a code instead of pasting an API token, in an
  OAuth-style device flow (RFC 8628). The module's Connect window has **Get a code**; pasting a token still works.
  - The module calls `POST /v1/foundry/link` (no auth; 10 a minute per IP, then `429`) with
    `{ world: { id, title } }`. It gets a secret `deviceCode`, a `userCode` like `WXYZ-2345` (8 characters, no
    0/O/1/I/L), `verificationUrl` (`<site>/link`, on the host it called), `verificationUrlComplete`
    (`/link?code=…`), `expiresIn: 600` and `interval: 5`.
  - The DM opens `/link`, signs in if needed (Auth0 brings them back to the code), and sees "Dorman Lakely's
    Campaign Planner in the world 'Dev' wants to connect to your account" with Connect and Cancel. The page uses
    `GET /v1/device-links/:code` and `POST /v1/device-links/:code/approve` or `/deny`; the code works with or
    without its dash, in any case. Approving returns `422` if the DM already has 10 API tokens.
  - The module polls `POST /v1/foundry/link/token` with `{ deviceCode }`. Until then it gets `400` with
    `authorization_pending`, `slow_down` (polled faster than the interval), `access_denied`, or `expired_token`
    (after 10 minutes, an unknown code, or one already used). Once approved it gets
    `200 { token, user: { name } }` exactly once: a new API token named "Foundry: <world title>".
  - `DeviceLink` stores only a SHA-256 digest of the device code. Expired links are deleted whenever a new one
    starts.
- **Editing DM Guru campaigns from Foundry (done):** the module's Campaign Planner and Dashboard edit a synced
  campaign fully, when this browser is connected. Its pushes can change any field, add and delete records, and set a session's or
  quest's links (`op: create`, `update` and `delete` on `POST /v1/foundry/campaigns/:uuid/changes`; see "Two-way
  sync protocol"). Deleting a record, there or on the website, now bumps the records whose pointers it clears.
  New records get a UUID v4 made in Foundry from `crypto.getRandomValues` (`crypto.randomUUID` is missing on
  Foundry servers reached over plain HTTP).
- **Patreon membership sync (done):** premium follows the patron's membership of the DM Guru campaign only
  (`PATREON_CAMPAIGN_ID`), with `patron_status` `active_patron` and at least $5. A Patreon webhook
  (`POST /v1/patreon/webhook`, HMAC-MD5 signed with `PATREON_WEBHOOK_SECRET`) re-reads a patron's membership on
  every `members:*` event, and the daily `patreon:refresh_memberships` task renews tokens before they expire, so
  premium no longer lapses when the Patreon access token does. The dashboard's Patreon card says whether the
  membership is in sync, lapsed or revoked.

## What's left
**To ship this PR**
- Watch CI on the latest push, resolve Copilot's review comments, then merge.
- Production setup:
  - run the migrations
  - lock CORS down from `origins '*'` (`config/initializers/cors.rb`) to the Foundry origins that need it
  - Patreon membership sync (below)

**Patreon membership sync (production setup)**
- **`PATREON_CAMPAIGN_ID`**: the ID of the DM Guru Patreon campaign. Premium and the tier come only from a
  patron's membership of this campaign; pledges to other creators are ignored. Get it with the creator access
  token from the Patreon developer portal: `GET https://www.patreon.com/api/oauth2/v2/campaigns` (it's
  `data[0].id`). If it isn't set, the app logs a warning and uses the patron's first membership, which may belong
  to another creator, so set it before deploying.
- **`PATREON_WEBHOOK_SECRET`**: the secret Patreon shows for the webhook below. Until it is set,
  `POST /v1/patreon/webhook` answers 401 to everything.
- **Register the webhook** in the Patreon developer portal (Webhooks): URL
  `https://dungeonmaster.guru/v1/patreon/webhook`, triggers `members:create`, `members:update`, `members:delete`,
  `members:pledge:create`, `members:pledge:update` and `members:pledge:delete`. Copy its secret into
  `PATREON_WEBHOOK_SECRET`.
- **Heroku Scheduler**: add a daily job `bundle exec rake patreon:refresh_memberships`. It renews Patreon tokens
  expiring within 7 days (or lapsed within the last 30) and re-reads each membership.
- After deploying, link a test patron and confirm premium follows their pledge (the `memberships.campaign`
  include hasn't been checked against live Patreon yet).

**To release the module**
- Release 0.2.0 with `npm run release:minor`. The unreleased changes include the Campaign Planner, planning
  without an account, quests, scene thumbnails, Send to Dungeon Master Guru, connecting with a code, editing
  synced campaigns, and the welcome message (see the module's CHANGELOG).
- Register the package on foundryvtt.com, and add the `FOUNDRY_PACKAGE_TOKEN` secret to the repo for the
  release workflow.
- Add the module to `app/services/foundry_module_stats_fetcher.rb` after its first release.

**Planned but not built**
- One source for the setup guide's words, shared by the website and the module (today they're copied).
- Player-facing pages: the shareable player guide, and player-visible journal pages.
- From phase 1: a campaign-scoped `NotesWidget`, and linking places to Cartography maps.
- From phase 5: treasure hoards, an in-world calendar, and export as a Foundry Adventure compendium.

## Suggestions
**Other ideas**
- Search the compendium index from the NPC form, so a stat block doesn't have to be added on the Books tab
  first.
- Show encounter difficulty for the party's level next to a session's monsters. This is a number only; the DM
  still places monsters on the map.
- Push changes to Foundry over ActionCable instead of polling every 2 minutes.
- Index homebrew and adventure compendiums the DM chooses, not just the official 2024 packs.
- Default the brief's "Players" to the size of the chosen party.

## Research takeaways (what to build on)
| Source | Idea we borrow |
|---|---|
| Sly Flourish, *Return of the Lazy DM* | 8-step session prep. Unrevealed secrets carry forward. Campaign level: one-page pitch, **six truths**, **fronts** with 3 grim portents |
| The Alexandrian | "Prep situations, not plots". **Three Clue Rule**: 3+ clues per key revelation. Node-based design scales to whole campaigns |
| Dungeon World fronts | Danger → impending doom → grim portents → stakes questions → cast |
| Blades in the Dark | **Progress clocks** for factions and threats that advance between sessions |
| Johnn Four, 5-Room Dungeon | One-shot / dungeon template: guardian → puzzle → setback → climax → reward |
| Kanka / World Anvil / LegendKeeper | Wikis are crowded. Kanka's nested quests + calendars and LegendKeeper's timelines and boards are the bar for entity UX |
| Archivist Sync, RoleCall Sync, SessionFlow | Foundry precedent. Archivist uses an API token, two-way sync and journal sheets. RoleCall splits GM and player pages. SessionFlow is an in-Foundry session workspace. None of them pairs structured prep with SRD content + statblocks |

**Positioning:** "Plan the campaign you want as a runnable, Lazy-DM-shaped plan with real 5e statblocks → run it
in Foundry, where what happens at the table flows back."

## Product shape
**New Campaign wizard:**
- Brief fields: premise, setting (free text + six truths), mode, length/cadence, party size, start and target
  level, tone, edition (2014/2024).
- Starting point: blank or a template (3-act arc / sandbox / 5-room one-shot).
- Setting lore is supplied by the DM. Greyhawk is not in SRD 5.2, so we ship no setting text.

**Campaign home tabs:**
1. **Overview**: pitch, six truths, player-facing one-page guide (shareable read-only link).
2. **Story**: villain ladder (BBEG → lieutenants → minor villains). Each villain or faction owns a **front** with
   portents and a **clock**.
3. **Quests**: board with main/side lanes and status columns; nested quests; giver NPC, location, reward,
   level band.
4. **Cast**: NPCs with role, motive, secret and voice. "Generate statblock" reuses `NpcConceptGenerator` →
   `Monster`.
5. **Places**: nested locations, optionally linked to a Foundry scene or a Dorman Lakely Cartography `FoundryMap`.
6. **Secrets & Clues**: pool grouped by revelation, with a **Three-Clue lint** (warns when a revelation has fewer
   than 3 clues).
7. **Sessions**: in arc mode, a timeline of N planned sessions. Each session is an 8-step prep page that pulls
   from the tabs above. **Run mode** is for use at the table: tick revealed secrets, advance clocks, keep a log.

**Example — zombie arc:**
- Brief: 6 weekly sessions, 4 PCs, levels 3→8, survival horror.
- Front: a Nerull cult. Its "Plague Spreads" clock has 6 segments and fills one segment per session if
  unchecked. Portents: villages fall → refugees flood the city → walls breached → ritual at the source.
- Sessions: S1 Outbreak → S2 Refuge → S3 Spread → S4 The Source → S5 The Cult → S6 End the Plague. Each session
  has a level target and is seeded from secrets that span sessions.

**Example — Greyhawk sandbox:**
- Same model with no fixed session count.
- The quest board and villain roster drive play. The DM preps "next session" from what is open.

## Data model (Rails; follows the `Monster` ownership pattern + Pundit)
Every planner table has:
- `campaign_id`
- `uuid` (sync id)
- `sync_version` (bigint from one shared Postgres sequence, bumped in `before_save`)
- `lock_version`
- `deleted_at` (tombstones for sync)
- rich-text columns as sanitized HTML

| Table | Fields | Notes |
|---|---|---|
| `campaigns` | `user_id`, name, slug, premise, setting_name, setting_notes, `truths` jsonb, `mode` (arc/sandbox/oneshot), planned_sessions, cadence, party_size, start_level, target_level, tone, edition, status, `share_token` | |
| `campaign_npcs` | role (bbeg/villain/ally/patron/neutral), motive, secret, appearance, voice, `monster_id`, `faction_id` | `monster_id` is an optional statblock |
| `campaign_locations` | `parent_id`, description, features jsonb, `foundry_map_id`, foundry_scene_uuid | |
| `campaign_factions` | | |
| `fronts` | owner (villain or faction), goal, doom, stakes jsonb, clock_segments, clock_filled | |
| `portents` | ordered, triggered_at | |
| `quests` | kind (main/side), status, `parent_id`, act, position, giver_npc_id, location_id, reward, level_min/max, `foundry_scenes` jsonb, `reward_currency` jsonb, reward_xp, milestone | |
| `secrets` | revelation, text, revealed_at, revealed_session_id, polymorphic `subject` | |
| `campaign_sessions` | number, scheduled_on, status (planned/prepped/played), level, strong_start, scenes jsonb, log, recap | |
| `session_links` | polymorphic join: session ↔ npc / location / monster / item / secret / quest | Lazy DM steps 5–8 |
| `quest_links` | polymorphic join: quest ↔ npc / book reference / monster / item, with a quantity | NPCs involved, monsters, reward items |
| `campaign_links` | polymorphic source → target | Cross-references used for the wiki-style "mentioned in" |
| `api_tokens` | user_id, name, token_digest, scopes, last_used_at | For Foundry |

Also link `patreon_users` to `users`; today they are keyed by a Foundry-generated string.

API: `/v1/campaigns` and nested resources (jbuilder, `camelize: :lower`, `{count, results}`), plus
`/v1/foundry/...` sync endpoints. Frontend: new `pages/campaigns/` using the redux-api + axios patterns, and new
sidebar section and routes in `navigation/DMRoutes.tsx`.

## The 2024 core books
DM Guru has the SRD 5.2 monsters, items and spells, but not the full Player's Handbook, Dungeon Master's Guide
or Monster Manual. The planner uses them without copying them:
- **Book references** (`campaign_references`): name, book, category (monster, magic item, spell, table, rule),
  page, optional CR and notes. NPCs can use one as their stat block, and session prep steps 7 (monsters) and 8
  (treasure) can link them. Nothing from the books' text is stored.
- **Compendium index (`compendium_entries`), sent by the module:**
  - It covers dnd5e's free SRD 5.2 packs (`actors24`, `spells24`, `equipment24`, `tables24`) plus the official
    `dnd-players-handbook`, `dnd-dungeon-masters-guide` and `dnd-monster-manual` packs the DM has.
  - Each entry is a name, category, CR, short detail (creature type, spell level, rarity) and compendium UUID.
    Stat blocks and book text never leave Foundry, and the entries are private to that DM.
  - The official packs use the same UUIDs in every world (e.g. `Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000`),
    so a link works in any of the DM's worlds.
  - The module sends a pack again when its package version changes. `GET` and `POST /v1/foundry/compendium`
    are premium, like sync.
- **Searching:** `GET /v1/compendium` searches the DM's index. A book entry hides the SRD entry of the same
  name. Session prep (monsters, treasure) and the Books tab use it, and fall back to DM Guru's own SRD when there
  is no index.
- **Per campaign:** `campaigns.excluded_compendium_packs` lists the compendiums a campaign leaves out. It stores
  the ones turned off, so a book indexed later is on by default.
- **In Foundry:**
  - Picking an entry creates a book reference with its `foundry_uuid`. Session journals link to it, e.g.
    `@UUID[Compendium.dnd-monster-manual.actors.Actor.…]{Zombie}`. Click it to open the stat block, or drag it
    onto a scene to place a token.
  - Monsters and items picked from DM Guru's own SRD list link to the compendium entry of the same name.

## Foundry module — Dorman Lakely's Campaign Planner
**Where it lives** (same conventions as the other Dorman Lakely modules):
- Title "Dorman Lakely's Campaign Planner", id `dorman-lakelys-campaign-planner`.
- Developed in the working modules folder: `~/Library/Application Support/FoundryVTT/Data/modules/dorman-lakelys-campaign-planner`.
- Its own repo: `github.com/jesshmusic/dorman-lakelys-campaign-planner`.
- TypeScript, Foundry 14 (minimum and verified), dnd5e.
- Add it to the module list in `app/services/foundry_module_stats_fetcher.rb` so it shows up on the stats page.

**Linking:**
- Device-code flow (built; see "Device-code linking" under Status). The module shows a code; the DM
  enters it at `dungeonmaster.guru/link`; that issues an `api_token`.
- Store the token in a **client/user-scoped setting, never world-scoped**, because world settings reach every
  player's browser.
- Only the GM client talks to DM Guru. Foundry's own sockets relay to players.

**Mapping** (all documents get `flags['dm-guru'] = {uuid, syncVersion, base}`):
- Campaign → a folder in the Journal and Actor sidebars.
- NPC, location, faction and quest → JournalEntry with an "Overview" page (player-visible page ownership) and a
  "GM Notes" page (GM only).
- NPC with a statblock → dnd5e Actor via `Monster#export_foundry_vtt`. That export needs `img`,
  `prototypeToken` and spells added.
- Session → JournalEntry with the 8-step pages.
- **Campaign Dashboard** (ApplicationV2) for fronts and clocks, the quest board, the secrets checklist, and the
  session log. Clocks can optionally be shown to players.
- Location ↔ Scene link. If it is a Cartography map, offer download/activate.

**Two-way sync protocol:**
- Pull: `GET /v1/foundry/campaigns/:uuid/changes?since=<cursor>` returns upserts + tombstones and a new cursor.
- Push: `POST /v1/foundry/campaigns/:uuid/changes` with `{ changes: [CHANGE, ...] }` (up to 100; the rest are
  ignored) edits a DM Guru campaign fully from Foundry (`CampaignSync`, `CampaignSync::Change`,
  `CampaignSync::Links`). A CHANGE has an optional `op`:
  - **update** (the default): `{ op?: "update", type, uuid, baseVersion, attributes }`. If the record's
    `syncVersion` isn't `baseVersion`, it comes back in `conflicts` with `current`, the server's copy.
  - **create**: `{ op: "create", type, uuid, attributes }`. `uuid` is a UUID v4 made in Foundry (any case; stored
    lower-case). One that's malformed, or already used by anything in the campaign (the campaign, any record, a
    deleted record's tombstone) or by any record of its type anywhere, is an error. It goes in `applied` with
    `current`, including its new `id` and `syncVersion`. A new session takes the next number.
  - **delete**: `{ op: "delete", type, uuid }`. Destroys the record as the website does: its links go, other records'
    pointers to it are cleared (their `sync_version`s bumped, so the next pull carries them), and it leaves a
    tombstone. Its uuid goes in `deleted` as sent; one that's already gone (or was never in this campaign) does too.
  - `type` is `campaign`, `faction`, `location`, `npc`, `front`, `quest`, `secret`, `session` or `reference`. The
    campaign can be updated but not created or deleted. `attributes` take the pull's camelCase keys
    (`CampaignSync::WRITABLE`); any other key is an error for that change:
    - campaign: `name premise pitch settingName settingNotes truths tone partySize startLevel targetLevel
      plannedSessions cadence status`
    - faction: `name goal description notes`
    - location: `name description features notes parentId foundrySceneUuid foundrySceneName`
    - npc: `name role description motive secret appearance voice notes factionId statBlockReferenceId
      foundryActorUuid foundryActorName`
    - front: `name goal doom description portents stakes clockSegments clockFilled npcId factionId`
    - quest: `name kind status act description reward notes levelMin levelMax parentId giverNpcId locationId
      foundryScenes rewardCurrency rewardXp milestone links`
    - secret: `text revelation revealed revealedSessionUuid position` (an unknown session uuid clears it)
    - session: `title scheduledOn level status characterNotes strongStart scenes treasure treasureCurrency
      foundryScenes log recap links`
    - reference: `name book category page challengeRating foundryUuid notes`
  - Ids (`parentId`, `factionId`, `npcId`, `giverNpcId`, `locationId`, `statBlockReferenceId`) are DM Guru record ids
    as the pull returns them, as text or a number; null or `""` clears one. Another campaign's record, or one that
    doesn't exist, is an error.
  - `links` (sessions and quests) is the whole new list, `[{ linkableType, linkableId, quantity }]` (other keys are
    ignored), up to 100. Links not in it are removed (each leaves a tombstone), new ones are added, and every link
    takes its quantity (none when left out) and its position in the list. Leaving `links` out keeps them as they
    are. A link the website couldn't make (a type the session or quest can't link, another campaign's record,
    someone else's homebrew, a record listed twice) makes the whole change an error.
  - Response: `{ applied: [{ type, uuid, current }], conflicts: [{ type, uuid, current }], errors: [{ uuid,
    errors: [...] }], deleted: [uuid], cursor }`. Each change is its own transaction, so one that fails undoes only
    itself. It holds the campaign's row lock, so no other edit lands between its version check and its save.
- Field-level **3-way merge in the module**, using the last-synced snapshot in `flags.base`:
  - auto-merge when only one side changed a field
  - when both changed the same field, show a conflict dialog (keep mine / keep DM Guru / both)
- Triggers:
  - debounced push on `update*` / `create*` / `delete*` hooks for flagged documents
  - poll every ~30s while the GM is connected
  - a "Sync now" button
  - later: ActionCable push
- Things created in Foundry, such as an improvised NPC, can be sent to DM Guru with a one-click "Send to DM Guru".
- Deleting a record (on the website or from Foundry) clears the campaign's other records' pointers to it, such as
  an NPC's `faction_id` or a quest's `giver_npc_id`, and bumps their `sync_version`s (`CampaignRecord`), so the next
  pull carries them. Deleting the whole campaign leaves that to the database.
- Known gap: session and quest links removed along with their target leave no tombstone of their own. Their
  session or quest is bumped, so the next pull carries its new list, and the target's tombstone covers them.
- Server checks: token + `user.premium?` + campaign ownership. Sanitize HTML both ways.

## Phases
0. **Prerequisites:**
   - Lock down the Foundry map admin endpoints:
     - `FoundryMapsController` and `FoundryMapTagsController` create/update/destroy/upload actions have no auth
     - `GET /v1/maps/:id` returns signed file URLs that bypass the premium check
   - Link Patreon to `users`.
   - Add `api_tokens` and token management in the User Dashboard.
1. **Planner core (free):**
   - models, API and specs
   - wizard with templates
   - campaign home tabs, sessions with 8-step prep + run mode
   - Three-Clue lint
   - dashboard widgets: "Next session" and "Clocks"
   - book references for the 2024 PHB, DMG and Monster Manual
   - not done: reviving `NotesWidget` scoped to a campaign, and linking places to Cartography maps in the UI
2. **AI (dropped):** the planner has no AI; the site's older AI tools are unchanged.
3. **Foundry module v1:** link account, pull-only import, Campaign Dashboard app.
4. **Two-way sync:** push, merge/conflict UI, "Send to DM Guru". The protocol is already in place from phase 1's
   sync columns.
5. **Later:**
   - finish treasure hoards (`treasure_utility.rb` TODOs) for step 8
   - encounter builder from party level
   - in-world calendar
   - export a campaign as a Foundry Adventure compendium

## Verification (per phase)
- RSpec model and request specs for every new model and endpoint: ownership scoping, Pundit, premium gating,
  sync cursor and conflict cases.
- Jest specs for every new component.
- `yarn lint`, `yarn format:check`, `bundle exec rubocop`, `NO_COVERAGE=true yarn test`,
  `NO_COVERAGE=true bundle exec rspec`.
- Manual check in the app: create the zombie-arc example end to end, run session 1 in run mode, and confirm
  the clock and secrets update.
- Foundry: link a dev world, import the campaign, tick a secret and advance a clock in Foundry, then confirm they
  appear on the web. Edit the same field on both sides and confirm the conflict dialog appears.

## Sources
- Sly Flourish: [The Eight Steps (2023)](https://slyflourish.com/eight_steps_2023.html),
  [Understanding the Six Truths](https://slyflourish.com/understanding_the_six_truths.html),
  [Prepping and Running Lazy Campaigns](https://slyflourish.com/prepping_and_running_lazy_campaigns.html),
  [One-Page Campaign Guide](https://slyflourish.com/one_page_campaign_guide.html)
- The Alexandrian: [Node-Based Scenario Design](https://thealexandrian.net/creations/misc/node-design/node-design2.html),
  [Node-Based Campaigns](https://thealexandrian.net/wordpress/45268/roleplaying-games/the-secret-life-of-nodes-part-2-node-based-campaigns),
  [Don't Prep Plots](https://thealexandrian.net/wordpress/4147/roleplaying-games/dont-prep-plots)
- [Dungeon World: Fronts](https://roll20.net/compendium/dw/Fronts) ·
  [Blades in the Dark: Progress clocks](https://roll20.net/compendium/BITD/Progress%20clocks) ·
  [Five Room Dungeon formula](https://bestiarumgames.com/blogs/news/better-ttrpg-dungeon-design-with-five-room-dungeon)
- Campaign tools: [LegendKeeper: World Anvil alternatives](https://www.legendkeeper.com/best-world-anvil-alternatives/),
  [LegendKeeper timelines](https://legendkeeper.com/legendkeeper-timelines-are-here),
  [Kanka quests](https://docs.kanka.io/en/latest/entries/quests.html),
  [Archivist session recaps](https://myarchivist.ai/dnd-session-recap)
- Foundry: [Archivist Sync](https://foundryvtt.com/packages/archivist-sync),
  [RoleCall Sync](https://foundryvtt.com/packages/rolecall-sync),
  [SessionFlow](https://www.foundryvtt-hub.com/package/sessionflow/),
  [MD to Journal](https://foundryvtt.com/packages/md-to-journal),
  [JournalEntryPage API (v14)](https://foundryvtt.com/api/classes/foundry.documents.JournalEntryPage.html)
