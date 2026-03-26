---
name: pptx
description: 產生 PowerPoint 簡報（.pptx）。觸發關鍵字：pptx、PowerPoint、簡報、投影片、slides、deck。
---

# PPTX 簡報產生 Skill

## 技術棧

| 用途 | 工具 |
|------|------|
| 主要產生 | `pptx` (python-pptx) |
| 進階 JS 產生 | `pptxgenjs` (Node.js) |
| 讀取分析 | `markitdown` |
| 視覺預覽 | `thumbnail.py` |

## 安裝

```bash
uv pip install --system python-pptx
```

## 標準產生流程（python-pptx）

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Cm
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_pptx(filename: str, slides_data: list[dict]) -> str:
    """
    slides_data: [{"title": str, "content": str | list[str], "layout": int}, ...]
    layout: 0=標題頁, 1=標題+內容, 5=空白, 6=只有標題
    """
    prs = Presentation()
    prs.slide_width  = Cm(33.87)   # 16:9 寬螢幕
    prs.slide_height = Cm(19.05)

    for slide_data in slides_data:
        layout_idx = slide_data.get("layout", 1)
        slide_layout = prs.slide_layouts[layout_idx]
        slide = prs.slides.add_slide(slide_layout)

        # 標題
        if slide.shapes.title:
            slide.shapes.title.text = slide_data["title"]

        # 內容
        content = slide_data.get("content", "")
        if hasattr(slide, 'placeholders') and len(slide.placeholders) > 1:
            body = slide.placeholders[1]
            tf = body.text_frame
            tf.clear()
            if isinstance(content, list):
                for i, item in enumerate(content):
                    p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
                    p.text = item
                    p.level = 0
            else:
                tf.paragraphs[0].text = content

    output_path = f"{OUTPUT_DIR}/{filename}"
    prs.save(output_path)
    return output_path
```

## pptxgenjs 流程（複雜視覺需求）

```javascript
const pptxgen = require("pptxgenjs");
const pptx = new pptxgen();

pptx.layout = "LAYOUT_WIDE";  // 16:9

let slide = pptx.addSlide();
slide.addText("標題", {
    x: 0.5, y: 0.5, w: "90%", h: 1.5,
    fontSize: 36, bold: true, color: "363636",
    align: "center"
});
slide.addImage({ path: "logo.png", x: 8.5, y: 0.1, w: 1.2, h: 0.8 });

await pptx.writeFile({ fileName: "outputs/output.pptx" });
```

## 設計規範

```python
# 品牌色票
BRAND_PRIMARY   = RGBColor(0x1A, 0x56, 0xDB)   # 藍
BRAND_SECONDARY = RGBColor(0x10, 0x7A, 0x60)   # 綠
BRAND_DARK      = RGBColor(0x11, 0x18, 0x27)   # 深色背景
BRAND_LIGHT     = RGBColor(0xF9, 0xFA, 0xFB)   # 淺色背景

# 字型大小
FONT_TITLE    = Pt(36)
FONT_SUBTITLE = Pt(24)
FONT_BODY     = Pt(18)
FONT_CAPTION  = Pt(14)
```

## 輸出規範

- 輸出至 `outputs/` 目錄
- 檔名：`pptx_{YYYYMMDD}_{slug}.pptx`
- 尺寸：16:9 寬螢幕（33.87 × 19.05 cm）
- 最多 20 張投影片（超過需分拆）

## 完成後

```python
present_files([output_path])
```
