claude "請分析目前專案架構並產出技術文件到 ./doc_system 目錄，要求如下：

## 技術棧背景

Vite + React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix) + Zustand + lucide-react

## 產出文件清單

### 1. docs/ARCHITECTURE.md

- 專案目錄結構樹狀圖（src 層級展開）
- 技術棧說明表格
- 模組職責說明（components / pages / hooks / stores / lib / types）
- 資料流說明（Zustand store → component 的流向）

### 2. docs/ENTRYPOINTS.md

- 系統進入點：main.tsx → App.tsx 的 bootstrap 流程
- Routing 結構（如有 react-router）
- 每個 page/view 的進入路徑

### 3. docs/COMPONENTS.md

- src/components 下所有元件清單
- 每個元件的 props interface 與用途說明
- shadcn/ui 使用到的元件列表

### 4. docs/STORES.md

- 所有 Zustand store 的 state shape 與 actions
- store 之間的依賴關係

### 5. docs/architecture.mermaid

- 系統整體架構圖，包含：
  - Entry point → Router → Pages
  - Pages → Components 層級
  - Components → Zustand stores
  - 使用 Mermaid graph TD 語法

## 執行要求

- 實際讀取 src/ 下所有 .ts .tsx 檔案後再產出，不要假設
- 若某模組不存在（如無 router），在文件中標註「尚未建立」
- 所有文件使用繁體中文說明，程式碼保持英文"
