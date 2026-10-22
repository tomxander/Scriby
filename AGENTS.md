# Scriby — notes for agents

Scriby is a local word processor for books. It is an Electron app made of plain JavaScript, HTML, and CSS. There is no bundler, no framework, and no compile step. `npm start` runs `electron .`.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before adding a feature. The product is opinionated on purpose. A change that helps someone finish a book belongs here. A change that adds a panel, a prompt, or a dependency usually does not.

## What this repository is

This repository (`tomxander/Scriby`) is the **Mac app** only. The phone apps (`pocket/`), their CI workflow and the Windows and Linux packaging of the original NEO are not in it; mentions of Pocket, Windows or Linux below describe the shared code and the original project, and can be ignored here. Build the Mac app with `npm run package:mac`; a local unsigned build is `npx electron-builder --mac dir --arm64 -c.mac.notarize=false -c.mac.identity=null -c.publish=null`, then `codesign --force --deep -s - dist/mac-arm64/Scriby.app`. Changes are pushed to `main` on GitHub only when Tom asks.

## Provenance and license

Scriby is Tom's work, based on NEO by Hugh Howey (MIT). Keep `LICENSE-NEO-MIT` and `NOTICE.md` in the tree and never present the original as Tom's. Tom's additions are under the restrictive `LICENSE` (use only: no copying, modifying, reselling). Third-party components keep their own licenses. Where this file says "Hugh", it describes the original NEO maintainer's workflow.

## Rules that override convenience

- Nothing interrupts a writer mid-sentence. No popups, no squiggles, no notifications while typing. Spellcheck is off until the writer asks for a pass.
- Controls stay hidden until hover or keyboard focus.
- Words are never discarded. Deleting text, unbinding a shelf, or losing a trash operation must leave the words recoverable (Darlings, a sibling chapter, or the system trash). `book:delete` uses `shell.trashItem`. If trash fails, leave the folder and show it.
- Books are plain files. No database, no proprietary format.
- The renderer never touches the filesystem. Disk access goes through `window.neo` (`preload.js`) to handlers in `main.js`.
- Do not save UI decoration into chapter HTML. Search highlights, spellcheck underlines, and focus dimming use the CSS Highlight API so they stay out of the file.
- Do not rewrite a chapter that has not changed. Libraries are synced with iCloud and Syncthing. A timer that writes every chapter on an interval will fight the other device.

## Where the code is

| File | Role |
|---|---|
| `main.js` | Window, menus, every filesystem operation, import parsing, PDF, backups |
| `preload.js` | The entire renderer API, `window.neo` |
| `index.html` | Two views: `#bookshelf-view` and `#editor-view`. CSP is `script-src 'self'` |
| `app.js` | The whole UI, in banner-marked sections. Search for the banner before reading the file |
| `styles.css` | All styling. Tokens are CSS variables at the top; the last section, THE WRITER'S ROOM, sets the chrome's look. A generated block (PAPYRUS:BEGIN … END) holds Papyrus's copy of every `body.light` rule |
| `covers.js` | Shelf covers in the window: seeded canvas art plus real title type. `window.NeoCovers` |
| `art.js` | Painted covers in the main process. OpenAI only. Title and author are never sent to the image model |
| `i18n.js` | `t()` / `tk()`, shared by main and the window. English source text is the key |
| `spell-worker.js` | Hunspell WASM, forked with `utilityProcess`. Messages: `load`, `check`, `suggest`, `add` |
| `backup-worker.js` | The day's backup zip, forked with `utilityProcess` by `dailyBackup` so a file that won't come off iCloud never holds the main process |
| `spell-ro.js` | Romanian diacritics, used by the worker. Does not alter the manuscript |
| `manuscript.js` | Standard manuscript format: the word count's rounding, the header's surname, the `.docx`'s parts and the PDF's page, from a model the window hands it. Plain JavaScript that also runs in Node (`window.NeoManuscript`, loaded by `index.html`) |
| `scripts/papyrus.js` | Rewrites the generated Papyrus block in `styles.css` and `pocket/www/pocket.css` from their `body.light` rules (`node scripts/papyrus.js`; `--check` for tests). Run it after any change to a `body.light` rule |
| `locales/<code>.json` | One language. Regional files (`fr-CA.json`) hold only the strings that differ |
| `pocket/` | Capacitor shell. It does not contain its own editor |
| `print/` | Vendored Paged.js and hyphenation patterns for paperback PDFs |

`app.js` section banners look like `/*  SAVING  */`. Start there: bookshelf, bound shelves, editor open, typing, poetry, screenplays, placeholders, nav, tabs, outline, outline cards, darlings, counters, saving, refresh, structural undo, find, import, spellcheck, focus, goals, export, manuscript format.

Menus are built in `buildMenu()` in `main.js`. A menu click sends `{ type, ... }` to the window; `app.js` handles it on `window.neo.onMenu`.

## Simple Scriby and Show More Features

Scriby opens simple. File → Show More Features (`library.moreFeatures`) brings back the rest: SIMPLE NEO near the end of `app.js`, and `moreState` / `simpleTemplate` in `main.js`.

- A menu item behind the switch carries `more: true` in `buildMenu()`; `simpleTemplate` leaves it (and the separators it would strand) out. A key, right-click choice or pane behind it asks `moreOn()` in `app.js`.
- Behind the switch now: alignment, poetry paragraphs, footnotes (⌘⇧N), Markdown emphasis (*italic* typed; off in simple Scriby), Other Font…, non-breaking marks, pages views, page width, brighter interface, interface size, focus mode, vim keys, read aloud, Look Up, the tab keys, chapter notes pages, outline cards (loose cards, cards beside the page), New Books Open To, painted covers and Cover Art…, pen names, binding shelves, duplicate, Reshelve, scripts and Fountain/Final Draft import, Import Chapters, txt/md/html exports, Chapter Titles Only, the shelf anthology, Manuscript Format, and the two language menus.
- Simple Scriby treats those settings as Scriby's defaults (`applyLook`) and never erases them: the writer's choices wait in library.json for the switch.
- Nothing a book already holds is hidden. A script, footnote, poetry paragraph, bound shelf, painted cover, loose card or chapter notes page with notes on it opens and exports as before, and other pen names stay reachable.
- A book's right-click in simple Scriby is the larger cards (`optionModal`), with no cover menu: art is dragged onto the book; New cover and Remove cover art stand with the rest. Word goals are set in Goals, inside the book, never from the shelf.
- The shortcuts window (`bookShortcutSections`) lists a key only when its feature is showing.
- A library from before the switch is decided once (`decideMoreFeatures`): on when it uses something behind it, off otherwise (with one toast saying where things went).
- Pocket (Android and iOS) is always simple and has no switch; its ⋯ sheet in `pocket/www/index.html` offers only simple Scriby's choices.
- A new feature goes behind the switch unless Hugh says it belongs in simple Scriby. `scripts/simple-neo.test.js`, `npm run test:simple`.

## Outline cards

The Outline tab shows the book as index cards (OUTLINE CARDS in `app.js`) unless `library.outlineView` is `'list'`. A script's Outline is always cards, one per scene (`scriptScenes`): heading, length in eighths, cast, and a note in `book.sceneNotes`, keyed by `data-scene-id` on the heading line. Dragging a scene card calls `spMoveScene`.

- Cards come from the manuscript, not a separate structure: each chapter is cut at its `p.scene-break` lines (`chapterSegments`). A section that holds a `p[data-sec-id]` belongs to that note in `book.sectionNotes`; the first section to carry an id owns it, because paragraphs split from a written ghost inherit the id. Others show their first line.
- Moving a card moves its paragraphs and *** between chapter bodies, then `syncChapter` and `orderSectionNotes`. Every move takes a `snapshotStructure` first.
- `syncGhosts` leaves a ghost where it stands and places a note the page lacks before the next section that's there. It never reorders ghosts.
- Loose cards are `book.looseCards`, shown in the right-hand pane while the Outline is up. A section card dragged there (or Move to loose cards) goes both ways: a section with writing takes its words along as `card.html`, out of the manuscript and the counts until it's placed again. Chapter cards and a script's scene cards go there too: the card carries the chapter (words, title, notes, kind; `held: 'chapter'`) or the scene's lines (`held: 'scene'`), written to book.json before they leave the page, and comes back whole (a chapter only between chapters). A card's Delete sends held words to Darlings first. A section card's Delete section sends its writing to Darlings (`deleteSectionToDarlings`).
- Several cards at once: ⌘-click (Ctrl-click) toggles a card, Shift-click takes a run, and a drag across empty outline space sweeps (`cardLasso`). The picked cards are `cardSel` (keys from `cardKey`), kept across a redraw and dropped after a move. Delete/Backspace or the right-click menu runs `deleteSelectedCards`: one `snapshotStructure`, the single deletes run quiet, sections and scenes from the last up, and a book keeps at least one chapter.
- `joinChapter` makes a chapter a section of another (List Tab on a chapter line, or a chapter card dropped on the middle of another). It moves the lines, persists the receiving chapter, and only then deletes the emptied one.
- In the List, Enter always makes a chapter and Tab always makes a section.
- On a card made new (`cardEditor.fresh`), Enter with words on it opens the next new card; Enter on an empty one, or Esc, stops. A pasted list (`pastedOutline`: the clipboard's HTML levels from `<ul>`/`<ol>` or Word's `mso-list`, else `outlineLines` on the text) becomes one card per item, and in the List one line per item: on a chapter, top items are chapters and deeper ones their sections. `scripts/outline-paste.test.js` covers the text's markers.
- While writing, the top of the right-hand pane shows the cards for where the caret is (`sideCardsUpdate`, `#side-cards`): the chapter's and its sections' (the caret's marked red), or the script scene's. Typed on there, they're the same notes; a scene gets its id with its first note.
- A script scene's card note shows in gray on the scene's empty first line (`spSceneNoteGhosts`, a `data-scene-note` screen mark that `captureBody` strips).

Brighter Interface is two settings: `library.uiBright` while writing (and on the shelf), `library.uiBrightAside` on the other tabs, bright unless turned off. `applyBright` picks one on every tab switch.
- The walking note (`walkNoteUpdate`) is an overlay inside `.chapter`, plus a `data-walk` mark on the caret's paragraph that `captureBody` strips. `note.dismissed` hides it for good.

## Screenplays

A book whose `book.json` says `"format": "screenplay"` is a script. Right-click (long-press) a shelf's + for New Script. The SCREENPLAYS section of `app.js` holds the feature; `scripts/screenplay.test.js` tests its rules.

- The whole script is one chapter, so selection and the arrow keys run through every scene. Scenes are found by their headings.
- Each line is a `<p>` whose class is its element: `sp-heading`, `sp-character`, `sp-paren`, `sp-dialogue`, `sp-transition`, `sp-shot`. Action has no class.
- Page breaks, page numbers, (CONT'D) and the gray suggestions come from `data-pg`, `data-fill`, `data-contd` and `data-ghost` marks. `captureBody` strips them. Never save them.
- Lengths in `styles.css` are in em of the script's type (51em = 8.5in, 1em = one 12pt line), so a line wraps the same on screen, in the off-screen measuring room and in the PDF. `spPaginate` places the pages from the line counts.
- `data-newpage` on a line is the writer's own page break (right-click → Page Break Here; Backspace at the line's start removes it). Unlike the screen marks it is saved, and it travels as `===` in Fountain and `StartsNewPage="Yes"` in Final Draft.
- A script's style lives in its `book.json`: `underlineHeadings: true` (Format → Underline Scene Headings) and `contd: false` ((CONT'D) turned off).
- A script exports as a PDF (letter, printed with `print: 'screenplay'`), Fountain or Final Draft (`.fdx`). The book formats don't apply.
- A `.fountain` or `.fdx` file dropped on a shelf or picked with Import becomes a new script. `importFile` in `main.js` only reads the file; `spFromFountain` and `spFromFdx` in `app.js` sort it into elements. Both readers are plain string functions, so the tests cover them (`scripts/fixtures/` holds a Final Draft file written by screenplain, an outside tool).

## Manuscript format

File → Export → Manuscript Format… (MANUSCRIPT FORMAT in `app.js`, the pages in `manuscript.js`) writes the open book the way agents and editors ask for it (William Shunn's novel format): a title page with the writer's contact block, "about 90,000 words" (`roundWords`: to the thousand from 10,000 up, else the hundred) and the title and byline halfway down, no header; then the story numbered from 1 under "Surname / TITLE / page", double-spaced 12 point Times New Roman (or Courier), one-inch margins, every paragraph indented half an inch, each chapter on a new page a third of the way down, `#` for scene breaks, parts on their own page, an epigraph kept, END at the close. The copyright, dedication, contents, acknowledgments and about pages stay out. One story with no chapters gets the short-story layout (title halfway down page 1, the text under it, the header from page 2).

- **.docx** (`docxEntries`): the title page is its own section with no header, the story the next one with `pgNumType start=1` and a PAGE field in `header1.xml`; a short story is one section with `titlePg` and an empty first-page header. A `settings.xml` keeps Word out of Compatibility Mode. Saved through `export:save`.
- **PDF** (`html`): one page for Paged.js, the header in `@page`'s `@top-right` margin box, `@page titlepage` without it; `print:manuscript` lays it out with `renderPaged` (the story's first section is `.pg1`, so it's page 1) and saves it. It shares the print window with the paperback, so each refuses while the other runs. Courier Prime (bundled) goes into the PDF; Word gets Courier New.
- The dialog remembers the contact block for every book (`library.manuscript`: name, address, phone, email, font, end) and the byline and header for this book (`book.manuscript`, only where they differ from Scriby's own choice). "Anonymous" is never taken for a byline. Values go into the fields from code, so a quotation mark can't cut one short. It never opens over another dialog or twice. Scripts keep their own PDF; Pocket has no manuscript export (its page doesn't load `manuscript.js`).
- `scripts/manuscript.test.js`; `npm run test:manuscript` (`scripts/manuscript.e2e.js`: the dialog, both files, the .docx read back by Scriby's import, the PDF's pages read back with `pdftotext` where it's installed).

## Paperbacks for KDP

Export → Paperback for KDP… (also on the shelf's right-click Export) writes a print interior PDF and a cover template PDF beside it. `printPaperback` and `buildPrintHtml` are the PRINT BOOK section of `app.js`; `makePaperback`, `renderPaged` and `kdpCoverHtml` are in `main.js`, behind `print:paperback`.

- Trims are KDP's four most-used: 5×8, 5.25×8, 5.5×8.5, 6×9 (`PRINT_TRIMS` in `app.js`, `KDP_TRIMS` in `main.js`). Paper thickness, page limits and the inside-margin bands (`kdpGutterMin`) come from KDP's help pages; Scriby adds a quarter inch to the minimum. If the page count crosses a band, the book is laid out again with the wider margin.
- Pages are set by Paged.js (`print/paged.polyfill.js`, vendored, MIT) in one offscreen window per export. A hidden window stalls its animation frames; a second offscreen window opened right after one closes fails. The window closes when the export ends. One patch in it is marked `Scriby:` (a word hyphenated across a page turn broke a letter late).
- Hyphenation is soft hyphens put in by `hyphenateHtml` in `main.js` with TeX patterns (`print/hyphen/`, ISC), because Chromium only hyphenates on macOS. Only `p.hy` prose is touched; names (capitalised words, except in German) and a paragraph's last word stay whole.
- Chromium rounds page sizes to 0.01 in; `exactPageBox` rewrites the MediaBox to the exact size in the same number of bytes.
- The page count is kept even. Chapters open on a right-hand page; blank pages carry no head or number. Page numbers sit at the outside corners (left pages at the left, right pages at the right); the regular PDF keeps them centered.
- Choices are kept: trim, paper, ISBN and fiction notice in `book.print`; on the pen name, `author.print` holds the back-matter links, `alsoByText` (the writer's own list, one title per line) and `reviewText` (own wording, with `{title}` for the book's title; empty means Scriby's translated wording). A dedication typed in the dialog becomes the book's own Dedication page.
- Page 1 is the story's first page (the first `chapter` section, so a prologue). In the paperback that section is `.pg1` and each page's number is set on it after layout. The regular PDF stops counting on `@page front` pages and numbers its contents from the `data-p1` link; pages after page 1 that show no number (a part's title) are `.page.counted`.
- `scripts/print.test.js` covers the margin bands, hyphenation, the page box and the cover's size. Pocket has no paperback export.

## Snapshots

⌘S (Ctrl+S; File → Take Snapshot) snapshots the whole book (SNAPSHOTS in `app.js`). Scriby also takes one before the first change of each writing day (`maybeDailySnapshot`, from `scheduleChapterSave` and `snapshotStructure`, built from `savedHTML` so it holds the day's start). No timer, and nothing is taken when nothing changed.

- One folder per snapshot, `book-…/snapshots/<UTC stamp>Z-<kind>-<chapters changed>-<words>-<rand>/`, holding only the chapters that changed since the last snapshot and, written last, `snapshot.json` (order, titles, kinds, a `textHash` of every chapter). Files are written once (`snapshot:list/read/write/remove` in `main.js`, the same four in Pocket's bridge). A chapter's text at a snapshot is in the newest snapshot at or before it holding the file (`snapHolder`).
- Kinds: `k` ⌘S, kept until deleted; `d` start of a day and `r` just before a restore, which go after 30 days (`snapsToThin`). A snapshot that goes first copies its chapter files into the next one that lacks them, so later snapshots still read whole.
- The Darlings tab's right-hand pane lists them (and stays open there); picking one shows the book as it was in `#snap-view`, read-only, words gone since marked with the CSS Highlight API (`wordsGone`). Restore This Chapter and Restore Whole Book take an `r` snapshot and a `snapshotStructure` first, so ⌘Z undoes them. A passage can be set aside as a darling from the right-click menu. Pocket takes snapshots but has no list yet.
- The daily backup zip leaves `snapshots/` out. `scripts/snapshots.test.js` covers the names, the fingerprint, thinning, where a chapter's text is and the marks.

## The look: a writer's place

Scriby is a place to write and a tool for books, not a SaaS application. The chrome is quiet and typographic: a book face (`--ui-font`, TeX Gyre Pagella first, which ships with the app), 3px and 5px corners (`--r`, `--r-lg`) on the writing surface and the shelf, hairlines, text-link buttons, no side-bar accents and no glows. Two things follow the supplied designs instead: the **bottom bar** (tall, a bordered Shelf button, the tabs centered with a 2px line on the edge that faces the page) and **every popup** (14px sheet, bordered 8px fields, outlined secondary buttons, filled primary, links drawn as links, dotted dividers; Settings is a two-pane page with the sections down the left). Both are the last sections of `styles.css`; use their variables (`--pop-r`, `--ctl-r`, `--field-line`, `--sel`) for a new popup and it matches. Labels are words in sentence case, never tracked capitals. Do not add pills, badges, cards with shadows or a persistent toolbar. Controls fade until hover or keyboard focus.

- **File → Settings…** (⌘, / Ctrl+,; `openSettings` in `app.js`) holds what is set once and left: page theme, labels (text or icons), brighter interface, interface size, page width, body font, drop cap, text size, typewriter, focus, Markdown emphasis, non-breaking marks, Vim keys, new-book start, interface and spelling languages, library folder, cover art, email, Show More Features. Rows behind Show More Features show only with it. Each control calls `handleMenu` with the message its old menu item sent, so a setting is changed in one way only. Typewriter, Focus and Show More Features keep their menu items too (keys, and the way back). Goals moved to ⇧⌘G. A new preference goes in Settings, not the View or Format menus.
- The DEPTH section at the end of `styles.css` gives the room its layers: a lamp's glow behind the page (`--glow`), frosted side panes and bottom bar (the page scrolls under the bar; `#paper-scroll` has `scroll-padding-bottom` so the caret never sits behind it; Pocket opts out), a faint outline on the current row. It adds no controls and keeps the square corners.
- Three rooms, kept per device (`library.pageTheme`); **Dark (`night`) is the default** for a new library, the window's first paint and any missing value (docs and UI text must say Dark is the default): `night` (Dark), `papyrus`, `light`, plus the plain `paper` page. A saved `glass` (a retired room) reads as `night`. `setPageTheme` in `app.js` sets them and the writer picks one in File → Settings… → Appearance (swatch chips, `sm-sw`); there is no switch in the bar or on the shelf. `papyrus` is the `light` class plus `papyrus`: write Light rules, then run `node scripts/papyrus.js`; hand-tune Papyrus only in the PAPYRUS section of `styles.css`.
- Every panel that lies over the page (modals, pop menus, spell menu, search bar, pen rack, hint, the chapter and side panes, the revealed bottom bar) is frosted glass tinted with the room's own `--pane`, one shared rule in that section. Don't put `backdrop-filter` on `.modal-backdrop`: a backdrop root would blind the modal's own blur.
- **The design system** (the last section of `styles.css`, tokens at its top, the final word over every earlier layer): the interface is the system font (`--ui-font`) at 13px (12 secondary, 15 titles, 17 section heads), following Apple's macOS guidance (13 pt body); the serif (`--serif`) is the page's and the shelf's own names only. Controls are 28 high with 8px corners (`--ctl-h`, `--ctl-r`), chips 20 high with 6px (`--chip-h`, `--chip-r`), rows 30 high, icons 16px with an 8px gap; one focus ring (`--ring`, and a 2px outline for keys). Fields are a `--sel` wash with a 1px `--field-line` border and the accent on focus. Buttons are three kinds: primary (`.btn-gold`, filled), secondary (`.btn-quiet`, `.m-cancel`, `.m-ok`, outlined) and text (`.sm-link`, `.linkish`, `a`: the accent, **no underline**, a wash on hover). Nothing in the chrome is underlined; a current tab in a pill group is a filled pill. Windows come in three widths, set with `data-size="s|m|l"` (400, 540, 640) on `.modal`, never an inline width; Settings is 760×540; panes are 280 (the Companion 392); menus 220–320. Long text wraps or ellipsizes, a window never grows to fit it, and a window taller than 82% of the screen scrolls inside itself.
- **Floating panels** (the end of `styles.css`): the Chapters and Notes panes, the Companion, pop menus and choice cards are one family: rounded sheets (`--panel-r`) inset from the window's edge on `--panel-shadow`, frosted with the room's `--pane`; rows with a line icon, a label and a quiet chip (`--chip-bg`) on the right; hover is a rounded wash (`--sel`). The pane geometry is inside `@media (hover: hover)` so Pocket keeps its own. `popMenu` rows take `icon`, `keys` (a shortcut chip) and a trailing `›` (a submenu chevron); without an `icon` one is chosen from the row's `value` or label (`MENU_ICONS`, `menuIcon`), and if any row has an icon the rest get an empty slot so labels line up. `optionModal` cards wear the same icon. New icons go in `ICONS` (24 grid, 1.5 stroke).
- The bottom bar rests: the whole bar is invisible (one opacity and 8px slide on `#bottombar`, no per-part transitions) and three faint dots (`#bar-dots`, a sibling after the bar, on no background) stand in its place. Pointer on the bar, keyboard focus or a drag to Darlings (`.attn`) brings the bar up in 0.22s and the dots go at once; leaving, the bar waits 0.4s and sinks away, and only then do the dots return, so the two are never seen together. The bar stays hoverable while invisible (its parts take no clicks until it is up). Touch (`hover: none`) and Pocket keep it up.
- The writer-visible name is Scriby. What stays NEO because existing libraries depend on it: the `NEO Library` folder, `appId`, the update feed, the `userData` folder (pinned in `main.js`), and the `NEO …` cover-font family names.

## The Companion

File → Edit → Ask the Companion… (⌘⇧K; behind Show More Features, desktop only) opens a pane over the page where the writer talks to a language model about the book. COMPANION in `app.js`, `ai.js` in the main process, `ai:*` in `main.js`/`preload.js`, `scripts/ai.test.js`.

- It speaks only when the writer presses Send. Nothing suggests, underlines or runs while they type. What it says lands in the pane; words reach the manuscript only through Insert at caret or Replace selection, which go through the page's own undo (and `snapshotStructure`), and a replaced passage goes to Darlings first.
- Two kinds of connection cover everything (`ai.js`): `openai` (chat completions, which Ollama, LM Studio, llama.cpp's server, OpenRouter, Groq and OpenAI speak) and `anthropic`. "Local" is an openai-style connection to localhost. A remote address must be https; a provider marked local must be localhost (`target`). Errors carry a code and `aiErrorText` in `main.js` puts it in the writer's language.
- The connection (provider, address, model) is this computer's, in `userData/settings.json` under `ai`; a key is in `secrets.json` as `ai-<provider>` (encrypted when the OS allows), never in the library. Settings → Companion holds all of it, with a Test button and a line saying where text goes. The window never sees a key or the network.
- What is sent is what the pane lists under "Sent with your message" and nothing else: the selection, the text near the caret, the outline and chapter notes (each ticked or not), and the pinned bible cards. The system text is rebuilt from the page on every message, so history is only the conversation.
- The story bible is `bible.json` in the book folder (cards: kind, name, summary, details, pinned) and the conversation `companion.json`; both plain files that the book's folder copies, syncs and duplicates. A model proposes cards in a fenced `bible` block; the pane shows them with Add to bible or Not this one, and nothing is added unasked. Removing a card sends its words to Darlings.
- Pocket has none of it.
- Long names and unbroken strings must wrap or ellipsize, never run out of their box. `html body .fr-choice` and the Companion pane wrap with `overflow-wrap: anywhere`; a Settings section longer than the window scrolls inside it (`.settings-modal` rows are `minmax(0, 1fr)`) with its Close sticky.

## Per device

How Scriby looks belongs to each device: `DEVICE_LOOK` in `app.js` (page theme, brightness, zoom, type size, page width, typewriter, non-breaking marks, pages view, focus, counters, outline view, vim keys). Every library write also keeps them in this device's `localStorage`; every library read takes them back from there (`applyDeviceLook`). The library's copy is the last device's, which is what a device new to the library starts with. Zoom is per device and per view: the page per mode, the cards, and the shelf (`neo.shelfZoom`, ⌘+/− and pinch on the shelf), each in `localStorage`; the page moves in tenths. The desktop also keeps its page theme in `settings.json` for the window's color at launch, and `exportFolder` there, so save dialogs open where the last export went.

Format → Page Width (Regular, Wide, Wider; `PAGE_WIDTHS` in `app.js`) sets `--page-wf` and `--page-pad-x`, which `--page-w` and the sheet's side padding in `styles.css` follow. The page also grows a little by itself in a wide window (`--page-w` clamps 680 to 760 px by the window); Pocket's page fills the screen up to 680 px (`pocket.css`).

A book's right-click on the shelf is a small menu (`popMenu`) on the desktop, with the cover's choices one level in; touch keeps the larger cards. Duplicate (`book:duplicate`, and `duplicateBook` in Pocket's bridge) copies the folder under a new id and title.

Pocket makes PDFs through `NeoPdf`, a native plugin in each project: Android opens its print screen (Save as PDF), iOS draws the pages into a file for the share sheet. A script's title can be set bold, underlined or italic as a whole (`book.titleStyle`, ⌘B ⌘U ⌘I on the title page), and keeps it in the PDF, Fountain and Final Draft.

## Processes

```
index.html + app.js  →  preload.js (window.neo)  →  main.js  →  NEO Library
                                                      ↓
                                               spell-worker.js
```

The window is created with `contextIsolation: true` and `nodeIntegration: false`. New renderer capabilities are added in three places: an `ipcMain.handle` in `main.js`, a method on `window.neo` in `preload.js`, and the call site in `app.js`.

## Files on disk

Default library: `~/Documents/NEO Library` (`app.getPath('documents')`). **File → Library Folder…** stores another path in `userData/settings.json` and restarts. Scriby does not move existing books.

```
NEO Library/
  library.json          shelves, author, pen names, customWords, spellLanguage
  _catalog.txt          regenerated map of folder → title; edits are ignored
  neo-errors.log
  Backups/neo-backup-YYYY-MM-DD.zip    one per day, 14 kept
  Exports/              emailed PDF snapshots
  book-<slug>-<id>/
    book.json           metadata and chapterOrder
    chapters/<id>.html
    notes.html          the Notes tab's page for the whole book
    notes-<chapter id>.html   a chapter's notes page (NOTES PAGES in app.js)
    outline.html
    darlings.json
    stickies.json
    cover-<ts>.<ext>    writer-chosen image
    art-<ts>.<ext>      painted image, plus art.json
```

App settings and the cover-art API key live in Electron `userData` (`settings.json`, `secrets.json`), not in the library. The key is encrypted with `safeStorage` when the OS allows it. Do not write secrets into the library.

Every book id, chapter id, and sidecar name passes through `libName()` in `main.js`. It allows one path segment and rejects `.`, `..`, slashes, and null bytes. Keep new files inside that helper.

Every library write goes through `writeFileDurable`: `file.tmp`, fsync, then rename into place, so a power cut can't leave an empty file. `writeJSON` also keeps the last version that read whole as `file.bak`, and `readJSON` falls back on `.tmp`, then `.bak`. A `book.json` lost with no copy is rebuilt from the chapter files (`rebuildBookMeta`). There is no append and no partial chapter update.

`json:write` and `aux:write` will create any single-segment `<name>.json` or `<name>.html` in the book folder. Prefer the existing names unless a new sidecar is actually required.

## Saving and sync

The window holds the open book in memory (`chapterHTML`, `book`, `stickies`, `darlings`) and remembers what it last wrote (`savedHTML`, `savedMetaSig`).

- Chapter and notes edits debounce 800 ms, then write only if the HTML changed and the chapter is still in `chapterOrder`.
- `flushAllSaves` runs every 20 s and on blur, hide, and close. It also stores `lastPosition` in `book.json`. A scroll-only change is not a new position.
- `refreshFromDisk` runs on focus, on visibility, and every 30 s while visible. It compares `mtimeMs:size` stamps and re-reads only changed chapters.
- Unchanged local chapter plus a changed file: adopt the file. If the file only has fewer words, adopt it and keep the displaced text in Darlings.
- Both sides changed: keep the local text on the page and insert the disk text as the next chapter, titled as from the other device.
- Skip a chapter whose write is still in flight. Drop a read that overlapped a local save. An empty read must not wipe a chapter that already has text.
- The same generation check applies to `library.json` on the shelf (`libraryGeneration`, `libraryWritesPending`).
- Today's word count (`book.dailyCounts`, `{ start, end }` per writing day) counts only what is typed or cut on this page. Text read from disk (opening, a chapter adopted or kept as the other device's twin) goes through `wordsFromDisk`, which moves the day's start with it. Another device's larger tally for a day is taken in (`mergeDayCounts`). `scripts/daily-words.test.js`, and the #345 cases in `npm run test:words`.

Structural undo (`snapshotStructure`, `structuralUndo`, banner STRUCTURAL UNDO) holds `UNDO_DEPTH` (50) actions. An undo puts back only what its action changed: writing made since stays, or, in a chapter the action also touched, goes to Darlings with a toast that says so. What an undo took back goes on `redoStack` (⇧⌘Z, Ctrl+Z's pair; Ctrl+Y off the Mac); any `input` event anywhere, or a new action, empties it. A redo is an undo of the undo, so it keeps the same protections.

On a Mac, iCloud ("Optimize Mac Storage") can turn library files into placeholders: the size is there, the words aren't, and a read waits on iCloud, forever if iCloud is stuck. A synchronous read of one froze the main process at launch, with no window. So `cloudOnlyAmong` spots them (no blocks on disk, then the `dataless` flag), `requestDownload` asks `brctl` for them, and the read handlers wait for them with `afterLocal` without blocking, answering at once when nothing is in iCloud. `readJSON` throws `ECLOUD` for one rather than falling back on `.bak`, and no write goes over a placeholder. The daily backup runs in its own process (`backup-worker.js`), two minutes after launch: it leaves placeholders out and names them, gives each other file 20 seconds, and is ended after 15 minutes. 1.5.1 read every file in the main process at launch, and one stuck file kept Scriby from opening, and from updating, which needs Scriby open. `scripts/icloud.test.js` plays iCloud with sparse files, and a stuck file with a named pipe. Don't add a direct `readFileSync` of a library file, and never walk the whole library in the main process.

Do not replace this with last-write-wins. The comments in `persistChapter` and `refreshFromDisk` explain cases that look redundant and are not.

## Interface language

Wrap writer-visible strings in `t('English text', { placeholder })`. Use `tk()` for strings translated later, at the point of display. In `index.html`, use `data-i18n`, `data-i18n-title`, `data-i18n-placeholder`, or `data-i18n-ph`.

After adding or changing strings:

```
node scripts/i18n.js template
node scripts/i18n.js check fr
```

`scripts/i18n.js` only scans `app.js`, `main.js`, `covers.js`, `index.html`, and Pocket's own `pocket/www/index.html` and `pocket/www/pocket-bridge.js`. A new string in another file will not enter the template until that list includes it. Pocket's page marks its words with the same `data-i18n*` attributes as the desktop's, and its ⋯ sheet and bridge use `t()`.

Details, plural forms, and regional fallback (`fr-CA` → `fr` → English) are in [TRANSLATING.md](TRANSLATING.md). Quotation marks follow the spellcheck language (`QUOTE_STYLES` in `app.js`). Import chapter detection is `CHAPTER_WORDS` in `main.js`. Cover small-words are `CONNECTORS` in `covers.js`.

Italian has no spellcheck dictionary: the only Hunspell package on npm is GPL-3.0-only, and Scriby's license can't carry GPL code. Do not add it.

## Pocket

`pocket/` is a Capacitor app that runs the desktop editor. Its bridge (`pocket/www/pocket-bridge.js`) implements `window.neo` against the phone's library folder. Android shares `Documents/NEO Library` via sync. iOS uses the app folder, optionally iCloud, with `LibraryHome.swift` locating that folder.

`scripts/pocket-www.js` (run by CI, and by hand before a local build) copies `app.js`, `covers.js`, `styles.css`, `i18n.js`, `fonts/`, `locales/`, Hunspell's browser build, and the `SPELL_LANGUAGES` dictionaries from `main.js` into `pocket/www/`. Pocket's checker is `pocket/www/pocket-spell.js`, a module worker with the same messages as `spell-worker.js`. A change to those files changes Pocket. Pocket-only behavior belongs in `pocket-bridge.js` or the native projects, not behind a desktop-only branch scattered through `app.js`.

## Commands

```
npm install
npm start
npm test                   # node --test scripts/*.test.js
npm run test:coverage      # node --test --experimental-test-coverage scripts/*.test.js
npm run lint               # oxlint, Electron's standard-style JavaScript rules
npm run test:spellcheck    # node --test scripts/spellcheck.test.js
npm run test:dashes        # node --test scripts/dashes.test.js
npm run bundle             # Hugh: brings in the newest .bundle from ~/Downloads and pushes main
npm run try                # Hugh: opens the newest .bundle's Scriby on a copy of the library, pushes nothing (-- fresh: an empty library)
npm run release            # Hugh: next version (x.y.9 → x.(y+1).0), commit, push, tag (npm run release -- 2.0.0 for another)
npm run package:mac        # macOS build; npm run package calls this
npm run package:linux      # AppImage via electron-builder; also package, package:mac, package:win, package:all
```

Tests use `node:test` and load `app.js` or `spell-worker.js` inside `vm`. They are not run by CI. The only CI check is a Windows smoke test that the packaged exe boots and creates a library (`.github/workflows/build.yml`, on `v*` tags). Pocket builds from `.github/workflows/pocket.yml`.

`node scripts/check-romanian-package.js <Resources dir>` compares a packaged app's dictionaries to the source tree. `node scripts/benchmark-spellcheck.js` times the checker. Neither is an npm script.

## Handing changes to Hugh

Hugh pushes and releases himself and isn't a git user. Hand him work as a git bundle of main..your-branch, built on the latest origin/main, then tell him: save it to Downloads, `npm run bundle`. To ship a desktop release: `npm run release`. Both commands check their footing and stop with a plain sentence instead of half-finishing. Don't give him raw git or npm version steps when these cover it.

## When you change something

- A new filesystem operation needs a handler, a `libName()` boundary, and a `preload.js` method. Match the existing IPC names (`library:`, `book:`, `chapter:`, `aux:`, `json:`, `cover:`).
- A new writer-visible string needs `t()` and a template refresh.
- A new way to remove text needs a recovery path and a sentence in the UI that says where the words went.
- Export formats are assembled in `app.js` and written by `export:save` in `main.js`. EPUB is a zip built in memory. PDF is printed from temporary HTML.
- Errors in the main process are appended to `neo-errors.log` via `logError`. Renderer failures go through `window.neo.logError`. Do not swallow a save failure; `persistChapter` rolls `savedHTML` back so the next flush retries.
