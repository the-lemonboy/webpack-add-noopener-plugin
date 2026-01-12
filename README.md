# webpack-add-noopener-plugin

[![npm version](https://img.shields.io/npm/v/webpack-add-noopener-plugin.svg)](https://www.npmjs.com/package/webpack-add-noopener-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

简体中文 | [English](#english)

---

## 简介（中文）

一个 Webpack 插件，自动为所有带有 `target="_blank"` 的 `<a>` 标签添加 `rel="noopener"` 属性，提高网站安全性。

- 适用场景：需要在构建阶段统一为 HTML 中的外链添加 `rel="noopener"`，避免遗漏。
- 支持：Webpack 4 / 5，完整 HTML 或仅 body 片段的 HTML。

### 为什么需要这个插件？

当使用 `target="_blank"` 打开新标签页时，新页面可以通过 `window.opener` 访问原页面，这可能导致安全风险。添加 `rel="noopener"` 可以防止这种行为。

### 特色

- ✅ 自动检测并处理所有 `target="_blank"` 的 `<a>` 标签
- ✅ 智能合并已有 `rel` 值，不重复添加 `noopener`
- ✅ 支持多种 HTML 产物（完整文档或仅 body 内容）
- ✅ 兼容 Webpack 4 / 5，零额外依赖（仅使用 cheerio 解析）
- ✅ 可通过 `verbose` 查看详细处理日志

### 安装

```bash
npm install --save-dev webpack-add-noopener-plugin
```

或使用 yarn:

```bash
yarn add --dev webpack-add-noopener-plugin
```

### 使用方法

#### 基本用法

在 `webpack.config.js` 中引入并配置插件：

```javascript
const AddNoopenerPlugin = require('webpack-add-noopener-plugin');

module.exports = {
  // ... 其他配置
  plugins: [
    new AddNoopenerPlugin()
  ]
};
```

#### 配置选项

```javascript
new AddNoopenerPlugin({
  verbose: true,              // 是否在控制台输出处理信息，默认 false
  extensions: ['.html']      // 要处理的文件扩展名数组，默认 ['.html']
})
```

#### 选项说明

- **verbose** (boolean, 默认: `false`)
  - 设置为 `true` 时，会在控制台输出处理的文件和处理数量

- **extensions** (string[], 默认: `['.html']`)
  - 指定要处理的文件扩展名数组
  - 例如: `['.html', '.htm']`

### 示例

- 最简配置：见 `example/webpack.config.js`
- HTML 示例：见 `example/src/index.html`
- 本地快速体验：

```bash
pnpm install    # 或 npm install / yarn
pnpm test       # 确认单测通过
pnpm exec webpack --config example/webpack.config.js
```

构建后在 `example/dist/index.html` 中可以看到自动添加的 `rel="noopener"`。

### 工作原理（简述）

1. 在 `emit` 钩子阶段读取输出资源。
2. 使用 cheerio 解析 HTML，定位 `target="_blank"` 的 `<a>` 标签。
3. 如果缺少 `noopener`，则追加到 `rel` 属性。
4. 将更新后的内容写回构建产物。

### 处理前后对比

```html
<a href="https://example.com" target="_blank">链接</a>
<a href="https://example.com" target="_blank" rel="nofollow">链接</a>
<a href="https://example.com" target="_blank" rel="noopener">链接</a>
```

#### 处理后

```html
<a href="https://example.com" target="_blank" rel="noopener">链接</a>
<a href="https://example.com" target="_blank" rel="nofollow noopener">链接</a>
<a href="https://example.com" target="_blank" rel="noopener">链接</a>
```

### 测试

运行测试：

```bash
npm test
```

运行测试并生成覆盖率报告：

```bash
npm run test:coverage
```

### 发布到 npm 与 GitHub

1. 更新版本号：`npm version <patch|minor|major>`（会自动打 tag）。  
2. 更新 `CHANGELOG.md`：记录本次变更。  
3. 验证质量：`npm test`（如有需要可补充 `npm run test:coverage`）。  
4. 发布到 npm：`npm publish`（确保已登录并拥有发布权限）。  
5. 推送到 GitHub：`git push origin main --tags`（或对应分支）。  

发布前可执行以下自检：

- README 示例能否跑通（`example/` 中构建一次）。  
- `peerDependencies`/`engines` 是否符合预期。  
- 打包体积是否仅包含 `files` 声明的内容（`npm pack --dry-run` 可查看）。  

### 兼容性

- Node.js >= 12.0.0
- Webpack >= 4.0.0

### 许可证

MIT

### 贡献

欢迎提交 Issue 和 Pull Request！

### 更新日志

#### 1.0.0

- 初始版本
- 支持自动添加 `rel="noopener"` 到 `<a target="_blank">` 标签
- 支持自定义文件扩展名
- 支持 verbose 模式

---

## English

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

#   w e b p a c k - a d d - n o o p e n e r - p l u g i n  
 