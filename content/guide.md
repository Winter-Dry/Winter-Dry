# 使用指南

本功能以纯静态方式工作：

1.  右上角会出现一个“页面”入口按钮，点击可展开菜单并切换不同页面。
2.  每个页面对应一个本地 Markdown 文件，渲染时支持 LaTeX 公式（行内 `\(...\)` 与块级 `$$...$$`）。
3.  页面列表由 `./config/pages.json` 配置驱动，只需新增条目即可扩展页面，无需修改 JS 代码。

## 如何新增页面

1.  在 `pure_site/content/` 目录下放置新的 `.md` 文件。
2.  在 `pure_site/config/pages.json` 的 `pages` 数组中追加一项，例如：

    ```json
    {
      "id": "notes",
      "title": "我的笔记",
      "mdPath": "./content/notes.md"
    }
    ```

刷新页面后，右上角入口菜单即会出现新页面。

## 本地运行与测试

- 在 `pure_site/` 目录下使用 `python3 -m http.server` 启动简易服务器：
  ```bash
  cd pure_site
  python3 -m http.server 8000
  ```
- 访问 `http://localhost:8000/`。

## 常见问题

- 若发现公式未渲染，请检查网络是否能加载 KaTeX CDN。
- 若页面内容未显示，可能是 `mdPath` 路径不正确或浏览器缓存导致。
