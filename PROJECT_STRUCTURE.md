# 项目结构

```
webpack-add-noopener-plugin/
├── src/                    # 源代码目录
│   └── index.js           # 插件主文件
├── __tests__/             # 测试文件目录
│   └── index.test.js      # 单元测试
├── example/               # 使用示例
│   ├── webpack.config.js  # Webpack 配置示例
│   └── src/
│       └── index.html     # 示例 HTML 文件
├── coverage/              # 测试覆盖率报告（运行测试后生成）
├── package.json           # npm 包配置
├── jest.config.js         # Jest 测试配置
├── README.md              # 项目说明文档
├── CHANGELOG.md           # 更新日志
├── LICENSE                # MIT 许可证
├── .gitignore            # Git 忽略文件
├── .npmignore            # npm 发布忽略文件
└── .editorconfig         # 编辑器配置

```

## 文件说明

### 核心文件

- **src/index.js**: 插件的主要实现代码
  - `AddNoopenerPlugin` 类：插件主类
  - `processHTML()`: 处理 HTML 内容的核心方法
  - `processAnchorTags()`: 处理所有 `<a>` 标签
  - `shouldAddNoopener()`: 判断是否需要添加 noopener
  - `addNoopener()`: 添加 noopener 属性

### 测试文件

- **__tests__/index.test.js**: 完整的单元测试
  - 构造函数测试
  - HTML 处理测试
  - 文件过滤测试
  - Webpack 集成测试
  - verbose 模式测试

### 配置文件

- **package.json**: npm 包配置，包含依赖和脚本
- **jest.config.js**: Jest 测试框架配置
- **.gitignore**: Git 版本控制忽略文件
- **.npmignore**: npm 发布时忽略的文件

### 文档文件

- **README.md**: 项目说明和使用文档
- **CHANGELOG.md**: 版本更新日志
- **LICENSE**: MIT 开源许可证

## 开发指南

### 运行测试

```bash
npm test
```

### 运行测试并查看覆盖率

```bash
npm run test:coverage
```

### 开发模式（监听文件变化）

```bash
npm run test:watch
```

## 发布流程

1. 更新版本号（package.json）
2. 更新 CHANGELOG.md
3. 运行测试确保通过
4. 构建（如果需要）
5. 发布到 npm

```bash
npm publish
```

