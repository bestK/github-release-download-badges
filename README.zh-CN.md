# GitHub Release Downloads Badge

一个 Cloudflare Worker 服务，用于生成 GitHub 仓库 Release 下载次数的 SVG 徽章。

## 功能特性

- 🚀 快速响应，基于 Cloudflare Edge 网络
- 📊 支持统计所有 Release 或特定 tag 的下载次数
- 🎨 生成美观的 SVG 徽章
- ⚡ 智能缓存，减少 API 调用
- 🔢 智能数字格式化（K/M 单位）
- 🎨 支持自定义颜色、标签和样式

## 使用方法

将你的域名替换为部署的 Worker 域名，支持以下格式：

```
https://your-worker-domain.com/owner/repo                    # 所有 releases 总下载量
https://your-worker-domain.com/owner/repo/latest             # 最新 release 的下载量
https://your-worker-domain.com/owner/repo/tag                # 特定 tag 的下载量
https://your-worker-domain.com/owner/repo?color=blue         # 自定义颜色
https://your-worker-domain.com/owner/repo?color=ff69b4&label=下载量  # 自定义颜色和标签
```

### 标签选项

- **无标签**: 显示所有 releases 的总下载量
- **`latest`**: 显示最新 release 的下载量（显示实际版本号）
- **特定标签**: 显示指定 release 的下载量（如 `v1.0.0`）

> **注意**: 使用 `latest` 时，徽章会显示实际的版本号（如 "v1.2.3 downloads"）而不是 "latest downloads"，以提供更清晰的信息。

### 查询参数

- `color`: 自定义颜色
  - 十六进制颜色：`ff69b4` 或 `#ff69b4`
  - 预定义颜色：`red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `gray`
  - 语义化颜色：`success`, `important`, `critical`, `informational`, `inactive`
- `label`: 自定义标签文本（默认为 "downloads" 或 "tag downloads"）
- `style`: 徽章样式（`flat`, `flat-square`, `plastic`，默认为 `flat`）

### 实例

https://gh-down-badges.linkof.link

原 GitHub 仓库：

```
https://github.com/bestK/xiaoha-battery-widget
```

徽章 URL：

```
# 所有 releases 总下载量
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget

# 最新 release 下载量
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/latest

# 特定版本下载量
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/v1.0.0

# 自定义颜色
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=blue

# 自定义颜色和标签
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=ff69b4&label=下载量

# 方形样式
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?style=flat-square
```

### 在 Markdown 中使用

```markdown
<!-- 总下载量 -->

![Downloads](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget)

<!-- 最新版本下载量 -->

![Latest Downloads](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/latest)

<!-- 特定版本下载量 -->

![v1.0.0 Downloads](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/v1.0.0)

<!-- 自定义颜色 -->

![Downloads](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=blue)

<!-- 自定义标签和颜色 -->

![下载量](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=ff69b4&label=下载量)
```

### 在 HTML 中使用

```html
<!-- 总下载量 -->
<img
  src="https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget"
  alt="Downloads"
/>

<!-- 最新版本下载量 -->
<img
  src="https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/latest"
  alt="Latest Downloads"
/>

<!-- 特定版本下载量 -->
<img
  src="https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/v1.0.0"
  alt="v1.0.0 Downloads"
/>
```

## 部署步骤

### 方法一：使用 Wrangler CLI（推荐）

1. 安装依赖：

   ```bash
   npm install
   ```

2. 更新到最新版本的 Wrangler：

   ```bash
   npm run update-wrangler
   ```

3. 登录 Cloudflare：

   ```bash
   npx wrangler login
   ```

4. 部署 Worker：

   ```bash
   npm run deploy
   ```

5. 本地开发测试：
   ```bash
   npm run dev
   ```

### 方法二：手动部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages
3. 创建新的 Worker
4. 复制 `worker.js` 的内容到编辑器
5. 保存并部署

## 故障排除

### TLS 证书错误

如果在本地开发时遇到 TLS 证书错误，这是正常的，因为本地环境可能无法验证 GitHub 的证书。部署到 Cloudflare 后会自动解决。

### 兼容性日期

项目使用 `2023-05-12` 兼容性日期以确保稳定性。如果需要使用更新的功能，可以在 `wrangler.toml` 中调整。

## API 响应

- **成功**: 返回 SVG 格式的徽章图片
- **错误**: 返回显示 "error" 的红色徽章
- **缓存**: 成功响应缓存 1 小时，错误响应缓存 5 分钟

## 数字格式化

- 小于 1,000: 显示原数字
- 1,000 - 999,999: 显示为 K 单位 (如 1.2K)
- 1,000,000+: 显示为 M 单位 (如 1.5M)

## 颜色参考

### 预定义颜色

| 颜色名   | 十六进制  | 效果    |
| -------- | --------- | ------- |
| `red`    | `#e05d44` | 🔴 红色 |
| `green`  | `#4c1`    | 🟢 绿色 |
| `blue`   | `#007ec6` | 🔵 蓝色 |
| `yellow` | `#dfb317` | 🟡 黄色 |
| `orange` | `#fe7d37` | 🟠 橙色 |
| `purple` | `#9f9f9f` | 🟣 紫色 |
| `pink`   | `#ff69b4` | 🩷 粉色 |
| `gray`   | `#9f9f9f` | ⚫ 灰色 |

### 语义化颜色

| 颜色名          | 十六进制  | 用途       |
| --------------- | --------- | ---------- |
| `success`       | `#4c1`    | 成功状态   |
| `important`     | `#fe7d37` | 重要信息   |
| `critical`      | `#e05d44` | 关键警告   |
| `informational` | `#007ec6` | 信息提示   |
| `inactive`      | `#9f9f9f` | 非活跃状态 |

### 自定义十六进制颜色

- 6位格式：`ff69b4` 或 `#ff69b4`
- 3位格式：`f6b` (自动扩展为 `ff66bb`)

## 技术实现

- 使用 GitHub API v3 获取 Release 数据
- 自动计算所有 assets 的下载次数总和
- 生成符合 shields.io 风格的 SVG 徽章
- 支持 CORS，可在任何网站中使用
- 支持多种徽章样式和自定义参数

---

**中文文档** | [English Documentation](README.en.md)
