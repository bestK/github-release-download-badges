# GitHub Release Downloads Badge

A Cloudflare Worker service that generates SVG badges for GitHub repository release download counts.

[中文](./README.zh-CN.md)

## Features

-   🚀 Fast response powered by Cloudflare Edge Network
-   📊 Support for total downloads or specific tag downloads
-   🎨 Beautiful SVG badges generation
-   ⚡ Smart caching to reduce API calls
-   🔢 Intelligent number formatting (K/M units)
-   🎨 Support for custom colors, labels, and styles

## Usage

Replace your domain with the deployed Worker domain, supporting the following formats:

```
https://your-worker-domain.com/owner/repo                    # Total downloads for all releases
https://your-worker-domain.com/owner/repo/tag                # Downloads for specific tag
https://your-worker-domain.com/owner/repo?color=blue         # Custom color
https://your-worker-domain.com/owner/repo?color=ff69b4&label=Downloads  # Custom color and label
```

### Query Parameters

-   `color`: Custom color
    -   Hex colors: `ff69b4` or `#ff69b4`
    -   Predefined colors: `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `gray`
    -   Semantic colors: `success`, `important`, `critical`, `informational`, `inactive`
-   `label`: Custom label text (default: "downloads" or "tag downloads")
-   `style`: Badge style (`flat`, `flat-square`, `plastic`, default: `flat`)

### Instance

https://gh-down-badges.linkof.link

Original GitHub repository:

```
https://github.com/bestK/xiaoha-battery-widget
```

Badge URLs:

```
# Total downloads for all releases
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget

# Downloads for specific version
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/v1.0.0

# Custom color
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=blue

# Custom color and label
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=ff69b4&label=Downloads

# Square style
https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?style=flat-square
```

### Using in Markdown

```markdown
<!-- Total downloads -->

![Downloads](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget)

<!-- Specific version downloads -->

![v1.0.0 Downloads](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/v1.0.0)

<!-- Custom color -->

![Downloads](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=blue)

<!-- Custom label and color -->

![Downloads](https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=ff69b4&label=Downloads)
```

### Using in HTML

```html
<!-- Total downloads -->
<img src="https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget" alt="Downloads" />

<!-- Specific version downloads -->
<img src="https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget/v1.0.0" alt="v1.0.0 Downloads" />

<!-- Custom color -->
<img src="https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=blue" alt="Downloads" />

<!-- Custom label and color -->
<img
    src="https://gh-down-badges.linkof.link/bestK/xiaoha-battery-widget?color=ff69b4&label=Downloads"
    alt="Downloads"
/>
```

## Deployment

### Method 1: Using Wrangler CLI (Recommended)

1. Install dependencies:

    ```bash
    npm install
    ```

2. Update to the latest Wrangler version:

    ```bash
    npm run update-wrangler
    ```

3. Login to Cloudflare:

    ```bash
    npx wrangler login
    ```

4. Deploy the Worker:

    ```bash
    npm run deploy
    ```

5. Local development testing:
    ```bash
    npm run dev
    ```

### Method 2: Manual Deployment

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to Workers & Pages
3. Create a new Worker
4. Copy the content of `worker.js` to the editor
5. Save and deploy

## Troubleshooting

### TLS Certificate Error

If you encounter TLS certificate errors during local development, this is normal as the local environment may not be able to verify GitHub's certificate. This will be automatically resolved after deploying to Cloudflare.

### Compatibility Date

The project uses compatibility date `2023-05-12` to ensure stability. If you need to use newer features, you can adjust it in `wrangler.toml`.

## API Response

-   **Success**: Returns SVG format badge image
-   **Error**: Returns red badge displaying "error"
-   **Cache**: Successful responses cached for 1 hour, error responses cached for 5 minutes

## Number Formatting

-   Less than 1,000: Display original number
-   1,000 - 999,999: Display as K units (e.g., 1.2K)
-   1,000,000+: Display as M units (e.g., 1.5M)

## Color Reference

### Predefined Colors

| Color Name | Hex Code  | Effect    |
| ---------- | --------- | --------- |
| `red`      | `#e05d44` | 🔴 Red    |
| `green`    | `#4c1`    | 🟢 Green  |
| `blue`     | `#007ec6` | 🔵 Blue   |
| `yellow`   | `#dfb317` | 🟡 Yellow |
| `orange`   | `#fe7d37` | 🟠 Orange |
| `purple`   | `#9f9f9f` | 🟣 Purple |
| `pink`     | `#ff69b4` | 🩷 Pink   |
| `gray`     | `#9f9f9f` | ⚫ Gray   |

### Semantic Colors

| Color Name      | Hex Code  | Purpose               |
| --------------- | --------- | --------------------- |
| `success`       | `#4c1`    | Success status        |
| `important`     | `#fe7d37` | Important information |
| `critical`      | `#e05d44` | Critical warning      |
| `informational` | `#007ec6` | Information tip       |
| `inactive`      | `#9f9f9f` | Inactive status       |

### Custom Hex Colors

-   6-digit format: `ff69b4` or `#ff69b4`
-   3-digit format: `f6b` (automatically expanded to `ff66bb`)

## Technical Implementation

-   Uses GitHub API v3 to fetch Release data
-   Automatically calculates total download count of all assets
-   Generates shields.io-style SVG badges
-   Supports CORS for use on any website
-   Supports multiple badge styles and custom parameters

## License

MIT License

---

[中文文档](README.md) | **English Documentation**
