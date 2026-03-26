---
name: html
description: 產生 HTML 文件或網頁。觸發關鍵字：html、HTML、網頁、web 報表、dashboard、線上文件。
---

# HTML 文件產生 Skill

## 技術棧

| 用途 | 工具 |
|------|------|
| 靜態 HTML | 純 HTML / Tailwind CDN |
| 動態報表 | Chart.js / D3.js |
| 範本引擎 | Jinja2 (Python) |

## 安裝

```bash
uv pip install --system jinja2
```

## 標準產生流程

```python
from jinja2 import Environment, FileSystemLoader, BaseLoader
import os
from datetime import datetime

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

TEMPLATE = """<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-900 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-blue-700">{{ title }}</h1>
    <p class="text-sm text-gray-500 mb-8">產生時間：{{ generated_at }}</p>

    {% for section in sections %}
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3 border-b pb-2">{{ section.heading }}</h2>
      <p class="text-gray-700 leading-relaxed">{{ section.body }}</p>
    </section>
    {% endfor %}
  </div>
</body>
</html>"""

def create_html(filename: str, title: str, sections: list[dict]) -> str:
    env = Environment(loader=BaseLoader())
    tpl = env.from_string(TEMPLATE)
    html = tpl.render(
        title=title,
        sections=sections,
        generated_at=datetime.now().strftime("%Y-%m-%d %H:%M")
    )
    output_path = f"{OUTPUT_DIR}/{filename}"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    return output_path
```

## 含圖表的報表

```html
<!-- 引入 Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<canvas id="myChart" width="400" height="200"></canvas>
<script>
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: {{ labels | tojson }},
      datasets: [{ label: '數量', data: {{ data | tojson }} }]
    }
  });
</script>
```

## 列印 / PDF 樣式

```css
@media print {
  .no-print { display: none; }
  body { font-size: 12pt; }
  h1 { page-break-before: always; }
  table { page-break-inside: avoid; }
}
```

## 輸出規範

- 輸出至 `outputs/` 目錄
- 檔名：`html_{YYYYMMDD}_{slug}.html`
- 編碼：UTF-8
- 所有外部資源使用 CDN（不依賴本地檔案）
- 支援列印（含 `@media print` 樣式）

## 完成後

```python
present_files([output_path])
```
