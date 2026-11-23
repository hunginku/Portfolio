# Hung Vinh — Portfolio

A responsive, GitHub Pages-ready portfolio with an original fantasy-RPG interface inspired by the ornate menu styling of *Baldur's Gate II: Shadows of Amn*. The implementation uses original CSS and layout work; it does not reuse game artwork, logos, fonts, or interface assets.

## Preview locally

Because the site loads `content.json` with `fetch()`, open it through a local web server rather than double-clicking `index.html`.

### Quick start (Python)

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Publish with GitHub Pages

1. Create a new GitHub repository (for example, `hung-vinh-portfolio`).
2. Upload the contents of this folder to the repository root: `index.html`, `styles.css`, `app.js`, `content.json`, and `assets/`.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site. Your site will be available at the URL shown in the Pages settings.

## Update the portfolio

- Open the published site and select **Edit Chronicle** in the footer.
- **Site & About** lets you update the introduction, biography, skills, education, contact email, and résumé URL.
- **Projects** lets you add, edit, remove, and upload project images.
- **Import / Export** lets you download your current data as `content.json` or restore a previous JSON backup.
- To publish changes to all visitors, replace the repository's `content.json` with the exported file and commit/push the change.

Edits are saved to browser `localStorage` immediately, so they are private to that browser until you export and publish the JSON. Images uploaded in the editor are embedded in the exported JSON. For best performance, use compressed images under 2.5 MB each. For a larger portfolio, store image files in `assets/` and use their relative paths in the image field (for example, `assets/project-cover.jpg`).

## Content notes

The portfolio is designed as a standalone site. Project cards open internal case-study views; there are no links back to the former Squarespace portfolio. Project images used in the case studies are stored locally in the assets/ directory for GitHub Pages hosting. Review all descriptions, dates, metrics, and public contact details before publishing.

## Files

- `index.html` — site structure and dialogs
- `styles.css` — fantasy RPG / ornate parchment and metal visual system
- `app.js` — project rendering, filters, modal details, and editor
- `content.json` — editable portfolio content
- `assets/aoi-character.webp` — supplied original character illustration

## IBM featured project

The IBM strategic foresight case study is featured first in the project gallery. It includes the STEEP analysis, 20-year scenario logic, five-year scenario story, Black Swan stress tests, Flourishing Business Canvas analysis, strategic priorities, and proposed roadmap. The case study also links to the editable interactive FBC workspace at `assets/ibm-flourishing-business-canvas.html`.

The IBM workspace is included as a standalone HTML deliverable and opens in a new tab. It is separate from the portfolio's Edit Chronicle content editor. The IBM case study itself can be updated through Edit Chronicle like the other projects; its featured placement can also be toggled in the project editor.

The mentor-context note reflects the portfolio owner's account that Tom Hardy encouraged the project to be featured and encouraged an IBM application. It is presented as personal context, not as an official IBM endorsement or recruitment offer.

## Project galleries and image sources

The Squarespace image scraper archives supplied by the portfolio owner have been imported into `assets/projects/squarespace-import/`. The imported library contains locally stored image files; the project gallery image paths in `content.json` are relative local paths, not Squarespace CDN URLs. The import preserves the source filenames where possible. Review the gallery ordering and captions in Edit Chronicle before publishing, since the scraper archives did not include a reliable project-to-image manifest.

The IBM process-book page images remain in `assets/projects/ibm/process-book-pages/`. All project cards open an internal case-study modal rather than sending visitors to the old Squarespace project pages. The site is standalone; the footer includes an optional link to the original Squarespace portfolio archive. WBD visuals are extracted from the LEAD 701 Strategic Business Analysis PDF and stored locally in `assets/projects/wbd/`.

### Previewing locally
You can double-click `index.html` to preview the portfolio. The project data is embedded in `content-data.js` specifically to support `file://` previews. Project images used in the case studies are stored locally in the repository. External links are limited to intentionally linked project tools such as the interactive Flourishing Business Canvas and résumé.


## IBM project assets

The IBM project includes locally stored WebP page images extracted from the uploaded 96-page process book in `assets/projects/ibm/process-book-pages/`. The project resource link opens the live interactive FBC at https://hunginku.github.io/Flourishing-Business-Canvas/. WBD visuals are extracted from the LEAD 701 Strategic Business Analysis PDF and stored locally in `assets/projects/wbd/`.


## Additional source materials imported

APEX Museum: selected page visuals from the website redesign, Voxon holographic exhibition, final and midterm presentations, slide redesign, Alma Film Festival, and redesigned timeline are stored in `assets/projects/apex-museum/`. Tyr: the vehicle hero, steering-wheel research, prototype, workshop and ideation visuals are stored in `assets/projects/tyr-ev/`. United Nations: SDG 14 and the supporting SDG 3, 6, 12 and 13 icons are stored in `assets/projects/un-systems/`. These were selected and optimized from the files supplied in this conversation.
