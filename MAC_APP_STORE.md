# Scriby and the Mac App Store

What the store asks of an Electron app, what Scriby already does, and what stands in the way. This is an
assessment, not a finished setup: nothing here has been submitted or tested against App Review.

## What the store requires (Electron's and electron-builder's own guides)

- **App Sandbox is mandatory.** The `com.apple.security.app-sandbox` entitlement must be on, and only Electron's
  *MAS build* runs in the sandbox (electron-builder's `mas` target uses it). The ordinary Mac build will not launch
  sandboxed.
- **Entitlements are declared**, and the provisioning profile must list the ones the app uses (network client,
  user-selected file read/write, and so on).
- **Signing**: an Apple Distribution (Mac App Distribution) certificate for the app and a Mac Installer Distribution
  certificate for the .pkg; a Development profile for local testing.
- **Updates come from the store.** The in-app updater (`electron-updater`, the GitHub feed in `package.json`) must not
  ship in the MAS build.
- Notarization is for direct distribution (the DMG); the store reviews the app itself.

## Where Scriby stands

| Area | Today | For the store |
|---|---|---|
| Interface | System font at 13 pt, standard menus and ⌘, Settings, dark/light rooms, keyboard focus ring | Add VoiceOver labels everywhere (most controls have `aria-label`s; audit the rest), respect Reduce Motion and Increase Contrast |
| Updates | GitHub release feed | Turn the updater off in the MAS build |
| Library | Plain files in `~/Documents/NEO Library`, any folder the writer picks | **The blocker.** In the sandbox Scriby cannot read `~/Documents` on its own. The writer must choose the library folder in an open panel, and Scriby must keep access with a *security-scoped bookmark* across launches. iCloud/Syncthing folders work only through that grant. |
| Backups | A zip into the library's `Backups/` | Same grant covers it |
| Spellcheck worker, backup worker | `utilityProcess` | Fine in the MAS build; check each child process inherits the sandbox entitlements |
| Network | Cover art (OpenAI), the Companion (hosted or localhost) | `com.apple.security.network.client`; a localhost model server also needs the loopback to be allowed. State in the privacy label that text goes only where the writer sends it |
| Keys | `safeStorage` | Fine |
| Privacy | No analytics, no account | Fill the App Privacy details: data not collected; add a privacy manifest if any API on Apple's required-reason list is used |
| Identity | `appId` `com.hughhowey.neo`, product name Scriby | Pick the bundle id before the first submission: it cannot change afterwards |
| Pocket | Separate Capacitor apps | Unrelated to this store listing |

## Suggested order

1. Decide the bundle id and the library-access design (first-run "Choose your library folder", bookmark kept in
   `userData`). This touches `libraryDir` in `main.js` and every place that reads it.
2. Add the `mas` and `mas-dev` targets and entitlements files (`build/entitlements.mas.plist`,
   `build/entitlements.mas.inherit.plist`) and build with a Development profile.
3. Strip the updater from that build; hide File → Check for Updates there.
4. Test every feature in the sandbox: open and save, backups, snapshots, export, drag-in cover art, import, the
   Companion, spellcheck.
5. VoiceOver and accessibility pass; screenshots; App Store Connect listing; submit through TestFlight first.
