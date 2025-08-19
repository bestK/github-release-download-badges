export default {
  async fetch(request) {
    return handleRequest(request);
  },
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter((part) => part);

  // 获取查询参数
  const customColor = url.searchParams.get("color");
  const customLabel = url.searchParams.get("label");
  const style = url.searchParams.get("style") || "flat";

  // 处理根路径，返回使用说明
  if (pathParts.length === 0) {
    return new Response(
      `
GitHub Release Downloads Badge Service

Usage: /owner/repo[/tag][?color=COLOR&label=LABEL&style=STYLE]

Examples: 
  /bestK/xiaoha-battery-widget (all releases)
  /bestK/xiaoha-battery-widget/latest (latest release)
  /bestK/xiaoha-battery-widget/v1.0.0 (specific tag)
  /bestK/xiaoha-battery-widget?color=blue (custom color)
  /bestK/xiaoha-battery-widget?color=ff69b4&label=下载量 (custom color and label)

Tag Options:
  - No tag: Shows total downloads across all releases
  - latest: Shows downloads for the latest release (displays actual version number)
  - Specific tag: Shows downloads for that specific release (e.g., v1.0.0)

Query Parameters:
  - color: Custom color (hex without #, or predefined: red, green, blue, yellow, orange, purple, pink, gray)
  - label: Custom label text (default: "downloads" or "tag downloads")
  - style: Badge style (flat, flat-square, plastic) - default: flat

Note: When using 'latest', the badge will display the actual version number (e.g., "v1.2.3 downloads") 
instead of "latest downloads" for better clarity.

Replace with your repository owner, name, and optional tag.
    `,
      {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      }
    );
  }

  // 检查路径格式: /owner/repo 或 /owner/repo/tag
  if (pathParts.length < 2 || pathParts.length > 3) {
    const errorSvg = generateBadgeSVG("downloads", "invalid path", "#e05d44");
    return new Response(errorSvg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  const [owner, repo, tag] = pathParts;

  try {
    // 构建 GitHub API URL
    let githubUrl;
    if (tag) {
      if (tag.toLowerCase() === "latest") {
        // 查询最新的 release
        githubUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
      } else {
        // 查询特定 tag 的 release
        githubUrl = `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`;
      }
    } else {
      // 查询所有 releases
      githubUrl = `https://api.github.com/repos/${owner}/${repo}/releases`;
    }

    const response = await fetch(githubUrl, {
      headers: {
        "User-Agent": "GitHub-Downloads-Badge/1.0",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      let errorMessage = "error";
      if (response.status === 404) {
        errorMessage = tag ? "tag not found" : "repo not found";
      } else if (response.status === 403) {
        errorMessage = "rate limited";
      }
      const errorSvg = generateBadgeSVG("downloads", errorMessage, "#e05d44");
      return new Response(errorSvg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    const data = await response.json();

    // 计算下载次数
    let totalDownloads = 0;
    let actualTag = tag;

    if (tag) {
      // 单个 release 的情况（包括 latest）
      if (data.assets && Array.isArray(data.assets)) {
        data.assets.forEach((asset) => {
          totalDownloads += asset.download_count || 0;
        });
      }
      // 如果是 latest 标签，使用实际的标签名
      if (tag.toLowerCase() === "latest" && data.tag_name) {
        actualTag = data.tag_name;
      }
    } else {
      // 所有 releases 的情况
      if (Array.isArray(data)) {
        data.forEach((release) => {
          if (release.assets && Array.isArray(release.assets)) {
            release.assets.forEach((asset) => {
              totalDownloads += asset.download_count || 0;
            });
          }
        });
      }
    }

    // 格式化下载次数
    const formattedCount = formatDownloadCount(totalDownloads);

    // 确定颜色
    let color;
    if (customColor) {
      color = parseColor(customColor);
    } else {
      // 根据下载次数选择默认颜色
      if (totalDownloads < 100) {
        color = "#97ca00"; // 浅绿
      } else if (totalDownloads < 1000) {
        color = "#4c1"; // 绿色
      } else if (totalDownloads < 10000) {
        color = "#007ec6"; // 蓝色
      } else {
        color = "#e05d44"; // 红色（高下载量）
      }
    }

    // 确定标签文本
    let label;
    if (customLabel) {
      label = customLabel;
    } else {
      if (tag) {
        // 如果是 latest 标签，显示实际的标签名
        if (tag.toLowerCase() === "latest") {
          label = `${actualTag} downloads`;
        } else {
          label = `${tag} downloads`;
        }
      } else {
        label = "downloads";
      }
    }

    // 生成 SVG 徽章
    const svg = generateBadgeSVG(label, formattedCount, color, style);

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600", // 缓存1小时
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    const errorSvg = generateBadgeSVG("downloads", "error", "#e05d44");
    return new Response(errorSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=300", // 错误时缓存5分钟
      },
    });
  }
}

function formatDownloadCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}

// 解析颜色参数
function parseColor(colorParam) {
  // 预定义颜色
  const predefinedColors = {
    red: "#e05d44",
    green: "#4c1",
    blue: "#007ec6",
    yellow: "#dfb317",
    orange: "#fe7d37",
    purple: "#9f9f9f",
    pink: "#ff69b4",
    gray: "#9f9f9f",
    grey: "#9f9f9f",
    brightgreen: "#4c1",
    lightgrey: "#9f9f9f",
    success: "#4c1",
    important: "#fe7d37",
    critical: "#e05d44",
    informational: "#007ec6",
    inactive: "#9f9f9f",
  };

  // 如果是预定义颜色
  if (predefinedColors[colorParam.toLowerCase()]) {
    return predefinedColors[colorParam.toLowerCase()];
  }

  // 如果是十六进制颜色（不带#）
  if (/^[0-9a-fA-F]{6}$/.test(colorParam)) {
    return `#${colorParam}`;
  }

  // 如果是十六进制颜色（带#）
  if (/^#[0-9a-fA-F]{6}$/.test(colorParam)) {
    return colorParam;
  }

  // 如果是3位十六进制颜色
  if (/^[0-9a-fA-F]{3}$/.test(colorParam)) {
    return `#${colorParam[0]}${colorParam[0]}${colorParam[1]}${colorParam[1]}${colorParam[2]}${colorParam[2]}`;
  }

  // 默认返回绿色
  return "#4c1";
}

function generateBadgeSVG(label, value, color, style = "flat") {
  // 更精确的文字宽度计算
  const getTextWidth = (text) => {
    // 根据字符类型计算更准确的宽度
    let width = 0;
    for (let char of text) {
      if (/[a-zA-Z0-9]/.test(char)) {
        width += 6; // 英文数字
      } else if (/[\u4e00-\u9fff]/.test(char)) {
        width += 11; // 中文字符
      } else {
        width += 4; // 其他字符
      }
    }
    return width;
  };

  const labelWidth = Math.max(getTextWidth(label) + 10, 40);
  const valueWidth = Math.max(getTextWidth(value) + 10, 40);
  const totalWidth = labelWidth + valueWidth;

  // 根据样式调整
  let rx = 3; // 圆角
  let gradientOpacity = 0.1;

  if (style === "flat-square") {
    rx = 0;
  } else if (style === "plastic") {
    gradientOpacity = 0.2;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
    <linearGradient id="b" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity="${gradientOpacity}"/>
      <stop offset="1" stop-opacity="${gradientOpacity}"/>
    </linearGradient>
    <clipPath id="a">
      <rect width="${totalWidth}" height="20" rx="${rx}" fill="#fff"/>
    </clipPath>
    <g clip-path="url(#a)">
      <path fill="#555" d="M0 0h${labelWidth}v20H0z"/>
      <path fill="${color}" d="M${labelWidth} 0h${valueWidth}v20H${labelWidth}z"/>
      <path fill="url(#b)" d="M0 0h${totalWidth}v20H0z"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110">
      <text x="${(labelWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${label}</text>
      <text x="${(labelWidth / 2) * 10}" y="140" transform="scale(.1)">${label}</text>
      <text x="${(labelWidth + valueWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${value}</text>
      <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" transform="scale(.1)">${value}</text>
    </g>
  </svg>`;
}
