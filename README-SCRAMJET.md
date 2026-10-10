# Pocket's Arcade — Scramjet integration

This project preserves the Pocket's Arcade UI and connects its browser window to Scramjet using Mercury Workshop's published `@mercuryworkshop/proxy-bootstrap` package.

## Run locally

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm start
```

Open `http://localhost:3000`. The first start downloads matching Scramjet runtime assets from the npm registry, so it needs working outbound internet access and may take longer than later starts. The browser initializes when you first navigate to a website.

## Deploy to Render

- Create or update a **Web Service** using the root of this project.
- Build command: `npm install`
- Start command: `npm start`
- Use Node.js 20 or newer.
- Do not set the root directory to `proxy/`; this version runs from the project root.
- Wait for the initial runtime download to complete in the deploy logs before testing the browser.
- Verify the service health endpoint at `/health`; it returns JSON after the server has initialized.

The service needs outbound HTTPS access to `registry.npmjs.org` on first startup. Scramjet's Wisp transport uses WebSocket upgrades at `/wisp/`; the hosting platform must support WebSocket upgrades.

## Notes and limitations

- The original UI styling, home page, tabs, preferences, and game view are retained. The browser panel now navigates through a Scramjet frame.
- This first integration uses one active frame. Switching tabs restores that tab's last address by navigating it again; it does not preserve a separate live frame for every tab.
- The app-level back/forward history tracks address-bar submissions; back/forward inside a site uses the Scramjet frame's own history when available.
- Some sites may refuse to run in an embedded/proxied browser, require sign-in, show bot checks, restrict media, or behave differently than in a regular browser. This is not guaranteed to support every website.
- The proxy bootstrap is licensed AGPL-3.0-only. Review its license and obligations before publicly distributing/hosting modified versions. The package's license is available in `node_modules/@mercuryworkshop/proxy-bootstrap` after installation.
- This project does not include third-party games or scrape/copy another site's source code.
