## webpack-add-noopener-plugin

[![npm version](https://img.shields.io/npm/v/webpack-add-noopener-plugin.svg)](https://www.npmjs.com/package/webpack-add-noopener-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`webpack-add-noopener-plugin` is a Webpack plugin that automatically adds `rel="noopener"` to all `<a>` tags with `target="_blank"`, improving the security of your site.

- Use case: enforce `rel="noopener"` for external links at build time, so you don't miss any.
- Supported: Webpack 4 / 5, both full HTML documents and body-only HTML fragments.

### Why this plugin?

When you open a new tab with `target="_blank"`, the new page can access the original page via `window.opener`, which may introduce security risks such as tabnabbing. Adding `rel="noopener"` prevents this behavior.

### Features

- ✅ Automatically finds and processes all `<a>` tags with `target="_blank"`
- ✅ Smart merge of existing `rel` values without adding duplicated `noopener`
- ✅ Works with different kinds of HTML output (full document or body-only)
- ✅ Compatible with Webpack 4 / 5, with only `cheerio` as HTML parser
- ✅ Optional verbose logging for debugging

### Installation

```bash
npm install --save-dev webpack-add-noopener-plugin
```

or with yarn:

```bash
yarn add --dev webpack-add-noopener-plugin
```

### Usage

#### Basic usage

In your `webpack.config.js`:

```javascript
const AddNoopenerPlugin = require('webpack-add-noopener-plugin');

module.exports = {
  // ... other config
  plugins: [
    new AddNoopenerPlugin()
  ]
};
```

#### Options

```javascript
new AddNoopenerPlugin({
  verbose: true,              // whether to log detailed info, default false
  extensions: ['.html']       // file extensions to process, default ['.html']
})
```

#### Option details

- **verbose** (boolean, default: `false`)
  - When `true`, prints processed file names and processed anchor count to the console.

- **extensions** (string[], default: `['.html']`)
  - File extensions to process.
  - Example: `['.html', '.htm']`

### Examples

- Minimal config: see `example/webpack.config.js`
- HTML example: see `example/src/index.html`
- Try it locally:

```bash
pnpm install    # or npm install / yarn
pnpm test       # run tests
pnpm exec webpack --config example/webpack.config.js
```

After the build, open `example/dist/index.html` and you will see `rel="noopener"` has been added automatically.

### How it works

1. Reads emitted assets in the `emit` hook.
2. Parses HTML with `cheerio` and locates `<a>` tags with `target="_blank"`.
3. If `noopener` is missing from `rel`, it is appended.
4. Writes the updated content back to the corresponding asset.

### Before & after

```html
<a href="https://example.com" target="_blank">Link</a>
<a href="https://example.com" target="_blank" rel="nofollow">Link</a>
<a href="https://example.com" target="_blank" rel="noopener">Link</a>
```

#### After

```html
<a href="https://example.com" target="_blank" rel="noopener">Link</a>
<a href="https://example.com" target="_blank" rel="nofollow noopener">Link</a>
<a href="https://example.com" target="_blank" rel="noopener">Link</a>
```

### Running tests

```bash
npm test
```

Generate coverage:

```bash
npm run test:coverage
```

### Publish to npm & GitHub

1. Bump version: `npm version <patch|minor|major>` (this also creates a git tag).  
2. Update `CHANGELOG.md` to describe changes.  
3. Ensure tests pass: `npm test` (and `npm run test:coverage` if needed).  
4. Publish to npm: `npm publish` (make sure you are logged in and have permission).  
5. Push to GitHub: `git push origin main --tags` (or your main branch).  

Pre-publish checklist:

- Try the example in `example/` to ensure the README instructions work.  
- Check `peerDependencies` and `engines` in `package.json`.  
- Confirm published files via `npm pack --dry-run` (should include only what you expect).  

### Compatibility

- Node.js >= 12.0.0
- Webpack >= 4.0.0

### License

MIT

### Contributing

Issues and PRs are welcome!


