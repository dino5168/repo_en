---
name: markdown
description: 產生 Markdown 文件（.md）。觸發關鍵字：markdown、md、README、技術文件、changelog、wiki。
---

# Markdown 文件產生 Skill

## 技術棧

| 用途 | 工具 |
|------|------|
| 主要產生 | 純文字 / Python f-string |
| Markdown → HTML | `markdown` (Python) |
| Markdown → PDF | `pandoc` CLI |
| Markdown → DOCX | `pandoc` CLI |
| Linting | `markdownlint` |

## 安裝

```bash
uv pip install --system markdown
# pandoc (Windows) — CLI 工具，需手動安裝一次
winget install JohnMacFarlane.Pandoc
```

## 標準產生流程

```python
import os
from datetime import datetime
from textwrap import dedent

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_markdown(filename: str, title: str, sections: list[dict], meta: dict = None) -> str:
    """
    sections: [{"heading": str, "level": int, "body": str}, ...]
    meta: {"author": str, "date": str, "tags": list[str]}
    """
    lines = []

    # Front matter（可選，供 Hugo / Jekyll 等使用）
    if meta:
        lines.append("---")
        for k, v in meta.items():
            if isinstance(v, list):
                lines.append(f"{k}:")
                for item in v:
                    lines.append(f"  - {item}")
            else:
                lines.append(f"{k}: {v}")
        lines.append("---")
        lines.append("")

    # 標題
    lines.append(f"# {title}")
    lines.append("")
    lines.append(f"> 產生時間：{datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("")

    # 目錄
    lines.append("## 目錄")
    lines.append("")
    for s in sections:
        indent = "  " * (s.get("level", 1) - 1)
        anchor = s["heading"].lower().replace(" ", "-")
        lines.append(f"{indent}- [{s['heading']}](#{anchor})")
    lines.append("")

    # 各章節
    for s in sections:
        prefix = "#" * (s.get("level", 2) + 1)
        lines.append(f"{prefix} {s['heading']}")
        lines.append("")
        lines.append(s["body"])
        lines.append("")

    content = "\n".join(lines)
    output_path = f"{OUTPUT_DIR}/{filename}"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
    return output_path
```

## 常用 Markdown 片段

```python
# 表格
def md_table(headers: list[str], rows: list[list]) -> str:
    sep = " | ".join(["---"] * len(headers))
    header_row = " | ".join(headers)
    data_rows = [" | ".join(str(c) for c in row) for row in rows]
    return "\n".join([f"| {header_row} |", f"| {sep} |"] +
                     [f"| {r} |" for r in data_rows])

# Code block
def md_code(code: str, lang: str = "") -> str:
    return f"```{lang}\n{code}\n```"

# Callout（GitHub / Obsidian）
def md_callout(type: str, content: str) -> str:
    # type: NOTE | TIP | WARNING | IMPORTANT | CAUTION
    return f"> [!{type}]\n> {content}"
```

## 轉換為其他格式

```bash
# Markdown → PDF
pandoc input.md -o outputs/output.pdf --pdf-engine=weasyprint

# Markdown → DOCX
pandoc input.md -o outputs/output.docx --reference-doc=templates/docx/reference.docx

# Markdown → HTML（含樣式）
pandoc input.md -o outputs/output.html --standalone --css=style.css
```

## 輸出規範

- 輸出至 `outputs/` 目錄
- 檔名：`md_{YYYYMMDD}_{slug}.md`
- 編碼：UTF-8（無 BOM）
- 換行：LF（`\n`）
- 最大行寬：120 字元（程式碼區塊除外）
- 標題層級不跳號（h1 → h2 → h3，不可跳到 h4）

## 完成後

```python
present_files([output_path])
```
