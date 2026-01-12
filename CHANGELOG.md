# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-06

### Added
- 初始版本发布
- 自动为带有 `target="_blank"` 的 `<a>` 标签添加 `rel="noopener"` 属性
- 支持自定义文件扩展名
- 支持 verbose 模式输出处理信息
- 完整的单元测试覆盖
- 支持完整 HTML 文档和只有 body 内容的 HTML
- 智能处理已有的 `rel` 属性，避免重复添加

### Features
- ✅ 自动检测所有带有 `target="_blank"` 的 `<a>` 标签
- ✅ 智能处理 `rel` 属性（添加或追加）
- ✅ 不会重复添加 `noopener`
- ✅ 完全兼容 Webpack 4 和 5
- ✅ 支持自定义文件扩展名过滤

