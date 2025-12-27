# HR 小幫手 (HR Helper)

這是一個 React 應用程式，旨在協助 HR 進行抽獎與分組。

## 功能

- **名單管理**：輸入或管理參與人員名單。
- **幸運抽獎**：進行隨機抽獎活動。
- **自動分組**：快速將人員分組。

## 開發環境設定

### 前置要求

- Node.js (建議 v20 或以上)
- npm

### 安裝

1. **複製專案**

   \`\`\`bash
   git clone <repo-url>
   cd HR-Helper
   \`\`\`

2. **安裝套件**

   \`\`\`bash
   npm install
   \`\`\`

3. **啟動開發伺服器**

   \`\`\`bash
   npm run dev
   \`\`\`

   開啟瀏覽器訪問 `http://localhost:3000` (或終端機顯示的網址)。

## 指令說明

- `npm run dev`: 啟動開發模式
- `npm run build`: 建置生產版本 (至 `dist` 資料夾)
- `npm run preview`: 預覽建置後的版本

## 部署 (Deployment)

本專案包含 GitHub Actions 設定，可自動部署至 GitHub Pages。

### 設定步驟

1. 將專案推送到 GitHub。
2. 進入 GitHub Repository 的 **Settings** > **Pages**。
3. 在 **Build and deployment** 區塊：
   - **Source**: 選擇 `GitHub Actions`。
4. 之後每次推送到 `main` 分支時，會自動觸發部署流程。

   > **注意**：如果遇到 `Error: Creating Pages deployment failed` 或 `HttpError: Not Found`，請確認您已經完成了上述第 3 步的設定，將 Source 改為 **GitHub Actions** 而不是 Deploy from a branch。

## 專案結構

- `src/`: 原始碼
  - `components/`: UI 元件
  - `App.tsx`: 主應用程式入口
- `.github/workflows`: CI/CD 設定檔
