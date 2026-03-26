---
name: pdf
description: 產生 PDF 文件（.pdf）。觸發關鍵字：pdf、PDF、報告、合約、憑證、電子發票、正式文件。
---

# PDF 文件產生 Skill

## 技術棧

| 用途 | 工具 |
|------|------|
| 主要產生 | `reportlab` (Python) |
| HTML 轉 PDF | `playwright` (Chromium headless) |

## 安裝

```bash
uv pip install --system reportlab playwright
playwright install chromium
```

## 標準產生流程

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
from datetime import datetime

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_pdf(filename: str, title: str, sections: list[dict]) -> str:
    """
    sections: [{"heading": str, "body": str}, ...]
    """
    output_path = f"{OUTPUT_DIR}/{filename}"
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=2.5 * cm,
        rightMargin=2.5 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    story = []

    # 標題
    story.append(Paragraph(title, styles["Title"]))
    story.append(Spacer(1, 0.5 * cm))

    # 各章節
    for s in sections:
        story.append(Paragraph(s["heading"], styles["Heading1"]))
        story.append(Paragraph(s["body"], styles["BodyText"]))
        story.append(Spacer(1, 0.3 * cm))

    doc.build(story)
    return output_path
```

## HTML 轉 PDF（playwright）

```python
from playwright.sync_api import sync_playwright

def html_to_pdf(html_content: str, output_name: str) -> str:
    output_path = f"{OUTPUT_DIR}/{output_name}"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html_content, wait_until="networkidle")
        page.pdf(path=output_path, format="A4", margin={
            "top": "2cm", "bottom": "2cm",
            "left": "2.5cm", "right": "2.5cm"
        })
        browser.close()
    return output_path
```

## 表格

```python
def add_table(story: list, headers: list, rows: list[list]) -> None:
    data = [headers] + rows
    table = Table(data, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2a7a4b")),
        ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
        ("FONTSIZE",   (0, 0), (-1, 0), 11),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f3f4f6")]),
        ("GRID",       (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
        ("PADDING",    (0, 0), (-1, -1), 6),
    ]))
    story.append(table)
```

## 中文字型支援

```python
# 註冊中文字型（需提供 TTF 檔）
pdfmetrics.registerFont(TTFont("NotoSansTC", "NotoSansTC-Regular.ttf"))

style = ParagraphStyle(
    name="Chinese",
    fontName="NotoSansTC",
    fontSize=11,
    leading=18,
)
```

## 輸出規範

- 輸出至 `outputs/` 目錄
- 檔名：`pdf_{YYYYMMDD}_{slug}.pdf`
- 頁面：A4，邊距 2.5cm
- 中文字型：Noto Sans CJK / 標楷體

## 完成後

```python
present_files([output_path])
```
