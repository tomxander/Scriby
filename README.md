# Scriby

**A distraction-free word processor for authors.** Created by Tom, based on [NEO](https://github.com/hughhowey/neo) by Hugh Howey. See [NOTICE.md](NOTICE.md).

Scriby understands from the moment you install it that you are writing *books* and nothing else. No bloat, no distractions, with manuscripts that look like books as you write them.

Scriby runs locally. WIPs are saved in plain files on your disk. No accounts or subscriptions. And it's free to use.

## Download

Get the latest Mac app from the **[Releases page](https://github.com/tomxander/Scriby/releases)**. Open the download and drag **Scriby** to Applications. Builds are for Apple silicon Macs; the app is not yet notarized by Apple, so the first time you open it, right-click it and choose **Open**.

Your library lives in `~/Documents/NEO Library` (the folder keeps its original name so existing libraries keep working). **File → Settings…** and **File → Library Folder…** move it anywhere you like, including iCloud Drive.

This repository holds the **Mac app**. The Windows, Linux and phone versions of the original NEO are not part of it.

## Why Scriby?

**The bookshelf** 

Your library looks like a bookshelf, not a file list. Labeled shelves you organize however you like — by series, by status, by pen name. Progress bars on the covers show how far you are from your word goals. You can drag-and-drop books anywhere. You can also drag shelves around and put cover art on your titles.

**Just a blank page** 

There's a white page by default or a dark mode . Controls fade until you mouse over them. Chapters number and renumber themselves automatically. Drop caps mark chapter openings, because I'm a sucker for drop-caps. Em dashes, true ellipses, and curly quotes sort themselves out as you type. Spellcheck exists only when you invoke it — no more red squiggles mid-sentence triggering your imposter syndrome.

**Enter, Enter, Enter** 

One Enter: new paragraph. Two: a `***` section break. Three: a new chapter. The goal is to KEEP WRITING.

Right-click the first chapter's heading to make it a prologue, or the last one's to make it an epilogue: they step out of the numbering, and everything renumbers.

**Darlings** 

The writing advice is "kill your darlings" — but here we *keep the bodies*. Drag any beautiful-but-in-the-way passage onto the Darlings tab. It leaves your manuscript but isn't lost. Darlings restore to the exact spot it came from. More like zombies than darlings.

**Placeholders** 

Mid-flow and need a name, a fact, a date? ⌘⇧X drops a mark and a sticky note. The left panel shows a red dot on every chapter that you need to get back to. The right panel will list all these to-do items.

**Outlining with index cards** 

The Outline tab lays your book out as index cards, set like a page: they read left to right, line after line, so forty short chapters or a story of thirty scenes both fill the window. Each chapter starts at its big numeral, with its sections following on the same mat. Click a card and write a few lines on it. A section's note shows up in the manuscript as a gray ghost paragraph, and once you start writing, it rides one line below your words until you dismiss it. Drag a card to move it and the writing moves with it (⌘Z puts it back). Pantsers get cards too: every chapter and every *** section is already a card, showing its first line until you give it a note. Ideas without a home wait on loose cards in the right-hand panel. ⌘− shrinks the cards until a whole novel fits on one screen, and the old list is one click away. Pantsers can ignore all of it or learn to draw a freakin' map for the first time. Try it. You might like it!

**Cover Art** 

Every book gets a cover! New books are dressed in a seeded abstract (six art styles, six type templates, typefaces bundled with Scriby) so no two stories on the shelf look alike. Once a story passes 1,000 words, Scriby can read it and paint an abstract cover from the text. This is a bit more work but totally worth it. Get an OpenAI API key from their website and paste it into **File → Cover Art…**. The art is generated in the background for about a penny a picture. (These are not meant for publication, just writing inspiration!) The API key is stored encrypted in Scriby's own settings, never in your library folder. The title and author are always set in real type on top, so the lettering is never left to a gen-AI model. The ↻ on any book re-rolls its type and colors, or paints it again. And you can always switch back and forth from the seeded modern look to the painted variety.

**The Companion** 

Ask the Companion (⌘⇧K, behind *Show More Features*) to help you draft, think through a scene, or build characters and the world: a story bible of cards that lives in your book folder. It connects to a hosted model (Claude, OpenAI, any OpenAI-compatible service) or to a model on your own Mac (Ollama, LM Studio), set up in **File → Settings… → Companion**. It speaks only when you press Send, shows exactly what is sent, and nothing reaches your manuscript unless you choose Insert or Replace. Keys are kept in the system keychain, never in your library.

**Goals and momentum** 

Daily word goals, word sprints, and a NaNoWriMo-style progress chart. Needs more testing.

**A shelf can become one book** 

Right-click a shelf's name and choose **Bind into one book** for an omnibus, a trilogy, or a story collection. Hover over the bound shelf and the pages a published book carries show up faintly in their places: copyright, dedication, epigraph, prologue, epilogue, acknowledgments, about the author. A small + before each title starts a Part. Click a page and type it the way it will print; a prologue or epilogue opens in the editor like any story. The export is one EPUB, Word file, or PDF with a single cover and one table of contents, and chapters can number straight through the whole book. Unbind any time. Nothing is lost.

**Screenplays, too!**

A lot of you have asked for this feature, so here it is! Right-click the + on any shelf and choose **New Script**. Scripts sit on the same shelves as your books, on white card stock with two brass brads. Inside, the page is set the way it will print: Courier Prime, pages, page numbers, a proper title page.

You never have to pick a formatting element. Start a line with INT. or EXT. and it's a scene heading. Type a name in capitals, hit Enter, and the next line is dialogue. Hit Enter twice after a speech and you're on the next speaker, with whoever is being answered already there in gray. Tab or Enter fills it in. ⌘1 through ⌘7 will let you pick an element yourself, the same keys Final Draft uses. The left panel lists your scenes and how long each one runs, in eighths of a page. Drag a scene to move it. (CONT'D) happens automatically. The Outline tab lays every scene out as an index card: its heading, its length, who's in it, and a note you can write on it. Drag the cards to restructure the script, or start a script as a stack of cards and write it from there.

Export an industry-format PDF, or a Fountain or Final Draft (.fdx) file. Drop a .fountain or .fdx file on a shelf to import a script. Notes, Darlings, placeholders, sprints, and Scriby Pocket all work the same as they do for books.

**Exports** 

EPUB 3 with a proper table of contents built to KDP's guidelines, Word .docx, PDF with page numbers and bookmarks, HTML, markdown, and plain text. Email a timestamped PDF snapshot to yourself with a SHA-256 fingerprint of the text in the body. Might come in handy someday.

**Import** 

Bring in existing .docx, .txt, and .md manuscripts; chapters and scene breaks are detected automatically. This is still a bit rough and might require you to tweak things. It will try to grab your title and remove that from the body, and it seems to be working okay.

**Backups** 

Continuous autosave, daily zip backups kept for two weeks, everything stored as plain files. Set up your Scriby library folder on your iCloud if you want for extra safety. You can also email copies of your WIP to yourself with a keystroke: ⌘E.

## Your files

Everything lives in `~/Documents/NEO Library` — one folder per book, chapters as readable HTML, metadata as JSON. Open them in your favorite text editor.

## Languages

Scriby speaks English, French (including Canadian), Spanish, Portuguese (Brazil and Portugal), German, Italian, Dutch, Polish, Romanian, Russian, Greek, Hungarian, Korean and Turkish. Newer strings (such as the Companion's) fall back to English until they are translated. Pick one under **View → Language**; on first launch Scriby follows your system language when it has it. Adding a language is a single file, no programming needed: see [TRANSLATING.md](TRANSLATING.md).

## Building from source

Scriby's source is shown so you can see how it works. Its license ([LICENSE](LICENSE)) lets you run Scriby but not modify, redistribute or sell it without permission. Requires [Node.js](https://nodejs.org) to run it from a checkout:

```
npm install
npm start
```

**View → Keyboard Shortcuts…** opens the shortcut reference. You can also press `Cmd+/` or use **Help → Scriby Shortcuts**.

To build the Mac app: `npm run package:mac`. Output lands in `dist/`. For a local, unsigned build, `npx electron-builder --mac dir --arm64 -c.mac.identity=null`. Getting it into the Mac App Store is covered in [MAC_APP_STORE.md](MAC_APP_STORE.md).

The app is very simple: an Electron shell (`main.js`), a preload bridge (`preload.js`), and a renderer (`app.js` + `styles.css` + `index.html`). If you want to build on it, ask first: see the license.

## Roadmap

Notarized builds · Mac App Store release (see [MAC_APP_STORE.md](MAC_APP_STORE.md)) · a consistency check between the story bible and the chapters · global end matter that updates every book at once (copyright pages, bios and so on).

## Contributing

Scriby is opinionated by design. Bug reports and ideas are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md). Because of Scriby's license, code contributions are accepted only with Tom's agreement.

## License and credits

Scriby is © 2026 Tom, under the [Scriby License](LICENSE): anyone may use it, but not copy, modify, redistribute or sell it without permission.

It is based on **NEO** by **Hugh Howey**, whose original work is MIT-licensed; his copyright and license are kept in [LICENSE-NEO-MIT](LICENSE-NEO-MIT). Full attribution and third-party credits are in [NOTICE.md](NOTICE.md).
