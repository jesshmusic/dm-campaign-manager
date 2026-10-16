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
- **AI is free when the DM brings their own OpenAI key.** The hosted AI key and Foundry sync are
  Patreon-premium.
- Foundry integration is **full two-way sync**.
- The planner is **2024-only** and works with the 2024 Player's Handbook, Dungeon Master's Guide and Monster
  Manual through book references (name and page), never their text or stat blocks.
- It uses DM Guru's existing generators as helpers: random names, tavern names, adventure hooks, and the NPC
  stat-block generator.
- Everything ships in one PR.

## Status (2026-10-16)
- **Phase 0 (done):** map admin endpoints locked down, Patreon linked to accounts, personal API tokens and
  `GET /v1/foundry/me`.
- **Phase 1 (done):** planner models and API, the campaign wizard with templates, campaign tabs (Overview,
  Story, Quests, Cast, Places, Secrets, Sessions, Books), session prep (8 steps) and run mode, Three Clue Rule
  check, dashboard widgets (Next Session, Campaign Clocks), book references.
- **Phase 2 (done):** bring-your-own OpenAI key, AI outline, prep suggestions and recaps.
- **Phases 3 and 4 (done):**
  - DM Guru sync endpoints: `GET /v1/foundry/campaigns`, `GET` and `POST /v1/foundry/campaigns/:uuid/changes`.
  - The module (0.1.0) is at github.com/jesshmusic/dorman-lakelys-campaign-planner. It links with a pasted API
    token.
  - Tested end to end in a live Foundry v14 world: linking, full pull, pushes from Foundry, pulls from DM Guru,
    the conflict dialog, and an AI-drafted plan and recap syncing into the journals.
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
  - Session prep step 1 lists the party with quick stats, bonds and flaws. The AI brief includes the party.
- **Guided setup (done, web and Foundry):**
  - New Campaign is a six-step guide: what kind of game, the pitch, the table (party, players, levels, sessions),
    the world (setting and truths), your books (compendiums), then review and create.
  - Each step has a short "Why this matters" with an example. The copy for every step lives in
    `pages/campaigns/setup/setupSteps.ts`.
  - The answers are saved in the browser as the DM goes, so leaving the page doesn't lose them.
  - After creating, the guide offers an AI draft of the plan.
  - The Overview tab shows a "Getting started" checklist (party, threat, cast, secrets, first session) until it's
    done or hidden.
  - The Foundry module has the same guide without AI, opened from the Connect window and the Campaign Dashboard.
    Its copy lives in the module's `scripts/setup.mjs`; keep it in step with `setupSteps.ts`.
    - It creates the campaign through `POST /v1/foundry/campaigns`. Creating is free, like on the web; listing
      and syncing stay premium.
    - The party's character sheets go with the request, and are saved like `POST /v1/foundry/characters` saves
      them.
    - A `request_id` makes a retried create return the same campaign.
    - Errors come back with the fields they're about, so the guide can return to the right step.
    - With premium, the world links to the new campaign and opens the Dashboard.
    - Drafts are kept per world in a client setting.
  - Campaigns have at most six truths. Older campaigns with more can still be edited, and AI plans never drop the
    truths a campaign already has.

- **Planning in Foundry, no account (done, module):**
  - Most DMs will find this through the module, and some won't want a website at all. They can plan entirely in
    Foundry; Dungeon Master Guru is the step up for AI.
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
    - Foundry pushes a quest's `status`, `foundryScenes`, `rewardCurrency`, `rewardXp` and `milestone`. Like session
      links, quest links aren't pushed from Foundry.
- **Scene thumbnails (done):**
  - The module sends a 640×360 WebP thumbnail of every scene in the world that has a map image, made with
    Foundry's `Scene#createThumbnail`, to `POST /v1/foundry/scenes` (premium, like sync), so the website can offer
    them as maps. It sends again only when what the thumbnail shows changes: the scene's size, levels or tiles, not
    tokens or walls. `DELETE /v1/foundry/scenes?world=&uuid=` removes a scene deleted in Foundry, with its image.
  - Dungeon Master Guru keeps them in S3's public `thumbnails/scenes/` path (`FoundryScene`, up to 500 per world),
    so they show on the Places and Quests tabs, in session prep and in run mode while Foundry is closed. The
    campaign's `sceneThumbnails` maps the UUIDs of the scenes it uses (places', sessions' and quests' maps) to them.
  - Scenes without a map image, and 3D Canvas scenes, get no thumbnail; they show by name.

## What's left
**To ship this PR**
- Watch CI on the latest push, resolve Copilot's review comments, then merge.
- Production setup:
  - run the migrations
  - set Active Record encryption keys in credentials or ENV, so they don't depend on `secret_key_base`
  - set `OPENAI_API_KEY` for premium members' hosted AI
  - lock CORS down from `origins '*'` (`config/initializers/cors.rb`) to the Foundry origins that need it

**To release the module**
- Release 0.2.0 with `npm run release:minor`. The unreleased changes are the compendium index and the
  draggable links.
- Register the package on foundryvtt.com, and add the `FOUNDRY_PACKAGE_TOKEN` secret to the repo for the
  release workflow.
- Add the module to `app/services/foundry_module_stats_fetcher.rb` after its first release.

**Planned but not built**
- "Send to Dungeon Master Guru" for a campaign made in Foundry: an upload endpoint that maps its local ids to new
  records, after which it syncs like any linked campaign. (Next.)
- Editing a local campaign's records in Foundry (today the Dashboard adds them; details are typed into the pages).
- One source for the setup guide's words, shared by the website and the module (today they're copied).
- Device-code linking, so DMs don't paste an API token.
- "Send to DM Guru" for things made in Foundry, like an improvised NPC.
- Player-facing pages: the shareable player guide, and player-visible journal pages.
- A monthly cap on the hosted AI key for premium members (there is an hourly limit).
- From phase 1: a campaign-scoped `NotesWidget`, and linking places to Cartography maps.
- From phase 5: treasure hoards, an in-world calendar, and export as a Foundry Adventure compendium.

## Suggestions
**Other ideas**
- Search the compendium index from the NPC form, so a stat block doesn't have to be added on the Books tab
  first.
- Let the AI choose monsters and treasure from the DM's compendium index, so its suggestions arrive already
  linked.
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
| Archivist Sync, RoleCall Sync, SessionFlow | Foundry precedent. Archivist uses an API token, two-way sync and journal sheets. RoleCall splits GM and player pages. SessionFlow is an in-Foundry session workspace. None of them pairs structured prep with SRD content + statblocks + AI |

**Positioning:** "Describe the campaign you want → get a runnable, Lazy-DM-shaped plan with real 5e statblocks →
run it in Foundry, where what happens at the table flows back."

## Product shape
**New Campaign wizard:**
- Brief fields: premise, setting (free text + six truths), mode, length/cadence, party size, start and target
  level, tone, edition (2014/2024).
- Starting point: blank, a template (3-act arc / sandbox / 5-room one-shot), or **Generate (premium)**.
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

## AI — bring your own OpenAI key (free) or hosted (premium)
**Gating:**
- Anyone can use the AI features with their **own OpenAI key**, at no cost to DM Guru.
- Patreon premium gets the **hosted key** with a monthly cap, plus Foundry sync.
- Premium therefore stays attractive, and AI costs stay neutral for free users.

**Key storage and use:**
- Add `users.openai_api_key`, using Rails 7 Active Record Encryption (`encrypts :openai_api_key`).
  - Encryption isn't configured yet. Run `bin/rails db:encryption:init` and put the keys in credentials/ENV.
  - The existing `:_key` entry in `config/initializers/filter_parameter_logging.rb` already filters it from logs.
- Settings UI in the User Dashboard:
  - paste the key, validate it with a cheap `GET /v1/models`, then save
  - only ever show `sk-…last4`; never include the key in JSON
  - remove-key button
  - optional model picker
- Add one factory, `OpenAIClient.for(user)`. It returns the user's key, else the hosted key when
  `user.premium?`, else raises `OpenAIClient::NoKeyError`; the UI turns that into "Add your key or join Patreon".
  - The constructor already takes `api_key:`.
  - Swap the 6 `ENV.fetch('OPENAI_API_KEY')` call sites to use it: `name_gen.rb`, `npc_action_generator.rb`,
    `commoner_description_generator.rb`, `npc_concept_generator.rb`, `cr_calc.rb`, `dashboard_controller.rb:56`.
  - That also opens the existing NPC generators to BYOK users.
- Keys stay server-side. The Foundry module requests AI through DM Guru and never sees the key.
- Users with their own key get relaxed rate limits.
- Specs:
  - key never serialized
  - encrypted at rest
  - `for(user)` resolution order
  - validation failure path

**Features:**
- Add system-message support to `app/models/utilities/openai_client.rb`.
- **Generate campaign from brief.** Run it in stages, with each call under Cloudflare's ~100s limit, driven from
  the client the way chunked upload was:
  - outline: truths, BBEG, fronts, quest arc mapped to N sessions
  - expand each section in turn: NPCs, places, secrets pool satisfying the Three Clue Rule, side quests
  - review/approve before saving, reusing the `ConceptApprovalModal` pattern
- **Fill this step:** suggestions for any of the 8 prep steps, using current campaign state.
- **Post-session:** log → recap, plus a *proposed diff* (secrets revealed, clocks advanced, quest status) for
  the DM to approve.
- Every request uses OpenAI **structured outputs** (`CampaignAssistantSchemas`), so replies always have the
  expected keys and allowed values. Without them, models sometimes mangled keys (`"_quests_"`, `"scenes "`).
  The outline asks for each revelation with exactly 3 clues, and applying it skips NPCs, places and truths the
  campaign already has.
- Rate-limit the same way as `cr_calc`, and spec with `instance_double(OpenAIClient)` like
  `spec/requests/admin/v1/dashboard_spec.rb`.

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
- AI suggestions (phase 2) can name 2024 creatures and items, but never page numbers, which it would guess.

## Foundry module — Dorman Lakely's Campaign Planner
**Where it lives** (same conventions as the other Dorman Lakely modules):
- Title "Dorman Lakely's Campaign Planner", id `dorman-lakelys-campaign-planner`.
- Developed in the working modules folder: `~/Library/Application Support/FoundryVTT/Data/modules/dorman-lakelys-campaign-planner`.
- Its own repo: `github.com/jesshmusic/dorman-lakelys-campaign-planner`.
- TypeScript, Foundry 14 (minimum and verified), dnd5e.
- Add it to the module list in `app/services/foundry_module_stats_fetcher.rb` so it shows up on the stats page.

**Linking:**
- Device-code flow. The module shows a code; the DM enters it at `dungeonmaster.guru/link`; that issues an
  `api_token`.
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
- Push: `POST /v1/foundry/campaigns/:uuid/changes` with `[{type, uuid, base_version, fields}]`. On version
  mismatch the server returns a conflict with its copy.
- Field-level **3-way merge in the module**, using the last-synced snapshot in `flags.base`:
  - auto-merge when only one side changed a field
  - when both changed the same field, show a conflict dialog (keep mine / keep DM Guru / both)
- Triggers:
  - debounced push on `update*` / `create*` / `delete*` hooks for flagged documents
  - poll every ~30s while the GM is connected
  - a "Sync now" button
  - later: ActionCable push
- Things created in Foundry, such as an improvised NPC, can be sent to DM Guru with a one-click "Send to DM Guru".
- Known gaps to close before two-way sync:
  - When a record is deleted, the database clears other records' references to it (e.g. an NPC's
    `faction_id`) without bumping their `sync_version`.
  - Session links removed along with their target leave no tombstone of their own (the target's tombstone
    covers them).
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
   - wizard with templates (no AI)
   - campaign home tabs, sessions with 8-step prep + run mode
   - Three-Clue lint
   - dashboard widgets: "Next session" and "Clocks"
   - book references for the 2024 PHB, DMG and Monster Manual
   - not done: reviving `NotesWidget` scoped to a campaign, and linking places to Cartography maps in the UI
2. **AI:**
   - first, BYOK key settings + `OpenAIClient.for(user)`, which also benefits the existing generators
   - then generate-from-brief, fill-a-step, and recap + proposed diff
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
