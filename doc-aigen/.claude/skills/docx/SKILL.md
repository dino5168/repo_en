---
name: docx
description: 產生 Word 文件（.docx）。觸發關鍵字：docx、Word、word document、合約文件、報告書、公文。
---

# DOCX 文件產生 Skill

## 技術棧

| 用途 | 工具 |
|------|------|
| 主要產生 | `python-docx` (Python) |
| 範本合併 | `docxtpl` (Jinja2 語法) |

## 安裝

```bash
uv pip install --system python-docx docxtpl
```

## 標準產生流程

```python
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os
from datetime import datetime

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_docx(filename: str, title: str, sections: list[dict]) -> str:
    """
    sections: [{"heading": str, "body": str}, ...]
    """
    output_path = f"{OUTPUT_DIR}/{filename}"
    doc = Document()

    # 頁面設定（A4）
    section = doc.sections[0]
    section.page_width  = Cm(21)
    section.page_height = Cm(29.7)
    section.left_margin = section.right_margin = Cm(2.5)
    section.top_margin  = section.bottom_margin = Cm(2)

    # 標題
    doc.add_heading(title, level=0)

    # 各章節
    for s in sections:
        doc.add_heading(s["heading"], level=1)
        doc.add_paragraph(s["body"])

    doc.save(output_path)
    return output_path
```

## 範本合併（docxtpl）

```python
from docxtpl import DocxTemplate

def render_from_template(template_path: str, context: dict, output_name: str) -> str:
    tpl = DocxTemplate(template_path)
    tpl.render(context)
    output_path = f"{OUTPUT_DIR}/{output_name}"
    tpl.save(output_path)
    return output_path

# 範本中使用 {{ variable }} Jinja2 語法
# context = {"name": "王小明", "date": "2026-03-26", "items": [...]}
```

## 表格

```python
table = doc.add_table(rows=1, cols=3)
table.style = 'Table Grid'
hdr_cells = table.rows[0].cells
hdr_cells[0].text = '項目'
hdr_cells[1].text = '數量'
hdr_cells[2].text = '金額'

for item in data:
    row_cells = table.add_row().cells
    row_cells[0].text = item['name']
    row_cells[1].text = str(item['qty'])
    row_cells[2].text = f"${item['amount']:,}"
```

## 輸出規範

- 輸出至 `outputs/` 目錄
- 檔名：`docx_{YYYYMMDD}_{slug}.docx`
- 頁面：A4，邊距 2.5cm
- 中文字型：新細明體 / 標楷體 / Noto Sans CJK

## 完成後

```python
present_files([output_path])
```
