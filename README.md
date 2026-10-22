<div align="center">

<img src="docs/icon.png" width="128" alt="Scriby icon">

# Scriby

**A distraction-free word processor for authors.**
Your library is a bookshelf. The page is quiet. Your words are plain files.

[![Release](https://img.shields.io/github/v/release/tomxander/Scriby?style=flat-square&color=d9aa48)](https://github.com/tomxander/Scriby/releases)
![Platform](https://img.shields.io/badge/macOS-Apple%20silicon-1c2b4a?style=flat-square)
[![License](https://img.shields.io/badge/license-Scriby%20License-555?style=flat-square)](LICENSE)

[**Download**](#download-and-install) · [**Tour**](#a-look-inside) · [**Features**](#features) · [**Companion**](#features)

<br>

<img src="docs/screenshots/01-bookshelf.png" width="860" alt="The Scriby bookshelf">

</div>

Created by Tom, based on [NEO](https://github.com/hughhowey/neo) by Hugh Howey. See [NOTICE.md](NOTICE.md).

Scriby understands from the moment you install it that you are writing *books* and nothing else. No bloat, no distractions, with manuscripts that look like books as you write them. It runs locally, saves your work in plain files on your disk, and needs no account or subscription.

## Download and install

1. Get **Scriby-1.6.0-arm64.dmg** from the **[Releases page](https://github.com/tomxander/Scriby/releases)** (Apple silicon Macs).
2. Open the DMG and drag **Scriby** onto the **Applications** folder in the same window. Then eject the disk image.
3. macOS will say it could not verify Scriby, because the app is not yet notarized by Apple. Click **Done** (not Move to Bin), then open **System Settings → Privacy & Security**, scroll to **Security**, click **Open Anyway** next to "Scriby was blocked", and confirm. This is needed once. Or, in Terminal: `xattr -dr com.apple.quarantine /Applications/Scriby.app`, then open Scriby.

Updates come from this repository's Releases. Until the app is notarized, install a new version the same way: download its DMG and drag Scriby over the old one.

Your library lives in `~/Documents/NEO Library` (the folder keeps its original name so existing libraries keep working). **File → Settings…** and **File → Library Folder…** move it anywhere you like, including iCloud Drive.

This repository holds the **Mac app**. The Windows, Linux and phone versions of the original NEO are not part of it.

## A look inside

*Screenshots show a demo library with invented text.*

<table>
<tr>
<td width="50%"><img src="docs/screenshots/02-manuscript-dark.png" alt="The manuscript in the dark room"><br><sub><b>The page.</b> Dark by default, with drop caps and book typography. Controls fade until you reach for them.</sub></td>
<td width="50%"><img src="docs/screenshots/05-outline-cards.png" alt="The outline as index cards"><br><sub><b>Outline cards.</b> Every chapter is a card. Drag one and the writing moves with it.</sub></td>
</tr>
<tr>
<td width="50%"><img src="docs/screenshots/06-chapters-panel.png" alt="The Chapters panel"><br><sub><b>Chapters.</b> A floating panel with your notes and word counts, there when you hover the edge.</sub></td>
<td width="50%"><img src="docs/screenshots/07-companion.png" alt="The Companion"><br><sub><b>The Companion.</b> Ask a hosted or local model for help, and keep a story bible. It only speaks when you press Send.</sub></td>
</tr>
</table>

### Four rooms to write in

<table>
<tr>
<td width="50%"><img src="docs/screenshots/03-manuscript-paper.png" alt="Paper"><br><sub><b>Paper</b></sub></td>
<td width="50%"><img src="docs/screenshots/04-manuscript-papyrus.png" alt="Papyrus"><br><sub><b>Papyrus</b> (Night and Light complete the set)</sub></td>
</tr>
</table>

<details>
<summary><b>⚙️ Settings</b></summary>

<img src="docs/screenshots/08-settings.png" alt="Settings" width="760">

Everything you set once lives in **File → Settings…**: the page, labels, interface size, writing options, languages, the Companion's connection, and your library.

</details>

## Features

*Click a feature to open it.*

<details open>
<summary><b>📚 The bookshelf</b></summary>

Your library looks like a bookshelf, not a file list. Labeled shelves you organize however you like — by series, by status, by pen name. Progress bars on the covers show how far you are from your word goals. You can drag-and-drop books anywhere. You can also drag shelves around and put cover art on your titles.

</details>

<details>
<summary><b>📄 Just a blank page</b></summary>

Scriby opens in a dark room (Night) by default. Prefer paper? **File → Settings… → Appearance** switches to Paper, Papyrus or Light, and your choice is remembered on that Mac. Controls fade until you mouse over them. Chapters number and renumber themselves automatically. Drop caps mark chapter openings, because a book should look like a book. Em dashes, true ellipses, and curly quotes sort themselves out as you type. Spellcheck exists only when you invoke it — no more red squiggles mid-sentence triggering your imposter syndrome.

</details>

<details>
<summary><b>⏎ Enter, Enter, Enter</b></summary>

One Enter: new paragraph. Two: a `***` section break. Three: a new chapter. The goal is to KEEP WRITING.

Right-click the first chapter's heading to make it a prologue, or the last one's to make it an epilogue: they step out of the numbering, and everything renumbers.

</details>

<details>
<summary><b>🧟 Darlings</b></summary>

The writing advice is "kill your darlings" — but here we *keep the bodies*. Drag any beautiful-but-in-the-way passage onto the Darlings tab. It leaves your manuscript but isn't lost. Darlings restore to the exact spot it came from. More like zombies than darlings.

</details>

<details>
<summary><b>📌 Placeholders</b></summary>

Mid-flow and need a name, a fact, a date? ⌘⇧X drops a mark and a sticky note. The left panel shows a red dot on every chapter that you need to get back to. The right panel will list all these to-do items.

</details>

<details>
<summary><b>🗂️ Outlining with index cards</b></summary>

The Outline tab lays your book out as index cards, set like a page: they read left to right, line after line, so forty short chapters or a story of thirty scenes both fill the window. Each chapter starts at its big numeral, with its sections following on the same mat. Click a card and write a few lines on it. A section's note shows up in the manuscript as a gray ghost paragraph, and once you start writing, it rides one line below your words until you dismiss it. Drag a card to move it and the writing moves with it (⌘Z puts it back). Pantsers get cards too: every chapter and every *** section is already a card, showing its first line until you give it a note. Ideas without a home wait on loose cards in the right-hand panel. ⌘− shrinks the cards until a whole novel fits on one screen, and the old list is one click away. Pantsers can ignore all of it or learn to draw a freakin' map for the first time. Try it. You might like it!

</details>

<details>
<summary><b>🎨 Cover Art</b></summary>

Every book gets a cover! New books are dressed in a seeded abstract (six art styles, six type templates, typefaces bundled with Scriby) so no two stories on the shelf look alike. Once a story passes 1,000 words, Scriby can read it and paint an abstract cover from the text. This is a bit more work but totally worth it. Get an OpenAI API key from their website and paste it into **File → Cover Art…**. The art is generated in the background for about a penny a picture. (These are not meant for publication, just writing inspiration!) The API key is stored encrypted in Scriby's own settings, never in your library folder. The title and author are always set in real type on top, so the lettering is never left to a gen-AI model. The ↻ on any book re-rolls its type and colors, or paints it again. And you can always switch back and forth from the seeded modern look to the painted variety.

</details>

<details>
<summary><b>✨ The Companion</b></summary>

Ask the Companion (⌘⇧K, behind *Show More Features*) to help you draft, think through a scene, or build characters and the world: a story bible of cards that lives in your book folder. It connects to a hosted model (Claude, OpenAI, any OpenAI-compatible service) or to a model on your own Mac (Ollama, LM Studio), set up in **File → Settings… → Companion**. It speaks only when you press Send, shows exactly what is sent, and nothing reaches your manuscript unless you choose Insert or Replace. Keys are kept in the system keychain, never in your library.

</details>

<details>
<summary><b>🎯 Goals and momentum</b></summary>

Daily word goals, word sprints, and a NaNoWriMo-style progress chart. Needs more testing.

</details>

<details>
<summary><b>📖 A shelf can become one book</b></summary>

Right-click a shelf's name and choose **Bind into one book** for an omnibus, a trilogy, or a story collection. Hover over the bound shelf and the pages a published book carries show up faintly in their places: copyright, dedication, epigraph, prologue, epilogue, acknowledgments, about the author. A small + before each title starts a Part. Click a page and type it the way it will print; a prologue or epilogue opens in the editor like any story. The export is one EPUB, Word file, or PDF with a single cover and one table of contents, and chapters can number straight through the whole book. Unbind any time. Nothing is lost.

</details>

<details>
<summary><b>🎬 Screenplays</b></summary>

Right-click the + on any shelf and choose **New Script**. Scripts sit on the same shelves as your books, on white card stock with two brass brads. Inside, the page is set the way it will print: Courier Prime, pages, page numbers, a proper title page.

You never have to pick a formatting element. Start a line with INT. or EXT. and it's a scene heading. Type a name in capitals, hit Enter, and the next line is dialogue. Hit Enter twice after a speech and you're on the next speaker, with whoever is being answered already there in gray. Tab or Enter fills it in. ⌘1 through ⌘7 will let you pick an element yourself, the same keys Final Draft uses. The left panel lists your scenes and how long each one runs, in eighths of a page. Drag a scene to move it. (CONT'D) happens automatically. The Outline tab lays every scene out as an index card: its heading, its length, who's in it, and a note you can write on it. Drag the cards to restructure the script, or start a script as a stack of cards and write it from there.

Export an industry-format PDF, or a Fountain or Final Draft (.fdx) file. Drop a .fountain or .fdx file on a shelf to import a script. Notes, Darlings, placeholders, sprints, and the rest all work the same as they do for books.

</details>

<details>
<summary><b>📤 Exports</b></summary>

EPUB 3 with a proper table of contents built to KDP's guidelines, Word .docx, PDF with page numbers and bookmarks, HTML, markdown, and plain text. Email a timestamped PDF snapshot to yourself with a SHA-256 fingerprint of the text in the body. Might come in handy someday.

</details>

<details>
<summary><b>📥 Import</b></summary>

Bring in existing .docx, .txt, and .md manuscripts; chapters and scene breaks are detected automatically. This is still a bit rough and might require you to tweak things. It will try to grab your title and remove that from the body, and it seems to be working okay.

</details>

<details>
<summary><b>🛟 Backups</b></summary>

Continuous autosave, daily zip backups kept for two weeks, everything stored as plain files. Set up your Scriby library folder on your iCloud if you want for extra safety. You can also email copies of your WIP to yourself with a keystroke: ⌘E.

</details>


## Your files

Everything lives in `~/Documents/NEO Library` — one folder per book, chapters as readable HTML, metadata as JSON. Open them in your favorite text editor.

## Languages

Scriby speaks English, French (including Canadian), Spanish, Portuguese (Brazil and Portugal), German, Italian, Dutch, Polish, Romanian, Russian, Greek, Hungarian, Korean and Turkish. Newer strings (such as the Companion's) fall back to English until they are translated. Pick one under **View → Language**; on first launch Scriby follows your system language when it has it. Adding a language is a single file, no programming needed: see [TRANSLATING.md](TRANSLATING.md).

## Shortcuts

**View → Keyboard Shortcuts…** opens the shortcut reference. You can also press `Cmd+/` or use **Help → Scriby Shortcuts**.

## About the source

Scriby is an Electron app written in plain JavaScript, HTML and CSS: a main process (`main.js`), a preload bridge (`preload.js`) and the interface (`app.js`, `styles.css`, `index.html`). The source is published so you can see how it works. Under its [license](LICENSE) you may use Scriby but not copy, modify or redistribute it without permission.

## Roadmap

Notarized builds · Mac App Store release (see [MAC_APP_STORE.md](MAC_APP_STORE.md)) · a consistency check between the story bible and the chapters · global end matter that updates every book at once (copyright pages, bios and so on).

## Contributing

Scriby is opinionated by design. Bug reports and ideas are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md). Because of Scriby's license, code contributions are accepted only with Tom's agreement.

## License and credits

Scriby is © 2026 Tom, under the [Scriby License](LICENSE): anyone may use it, but not copy, modify, redistribute or sell it without permission.

It is based on **NEO** by **Hugh Howey**, whose original work is MIT-licensed; his copyright and license are kept in [LICENSE-NEO-MIT](LICENSE-NEO-MIT). Full attribution and third-party credits are in [NOTICE.md](NOTICE.md).
