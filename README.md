# Godown Stock Viewer Web App 📦

A professional, high-performance Godown Stock Viewing Web App built with **Next.js 15**, **TanStack Virtual**, **Tailwind CSS**, and **Google Sheets Sync**.

---

## 🚀 Key Features

1. **High Performance Virtualization (2,500+ Items at 60 FPS)**:
   - Uses `@tanstack/react-virtual` to smoothly render thousands of stock items without browser lag or slowdowns.
2. **Weekly Google Sheet Sync**:
   - Easily connects to any Google Sheet via public CSV URL or Spreadsheet ID.
   - Zero complex Google Cloud API keys needed: just set the sheet to *"Anyone with the link can view"*.
3. **Billing Software CSV Upload**:
   - Alternatively, drag-and-drop the weekly CSV export from your billing software directly in the app.
4. **Desktop & Mobile Optimized**:
   - **Desktop**: High-density virtualized data table with Code, Name, Category, Location, Quantity, Unit, Reorder Level, and Actions.
   - **Mobile**: Touch-friendly card view with large status indicators and stock levels.
5. **Instant Search & Multi-Filter**:
   - Real-time search by Item Code or Item Name.
   - Quick filters for **All Stock**, **Low Stock Only**, and **Out of Stock**.
   - Category filtering with item counts.
6. **WhatsApp Stock Sharing**:
   - One-click share formatted stock status to customers or management via WhatsApp.
7. **Staff PIN Security**:
   - Optional 4-digit passcode lock for godown staff security.
8. **PWA Ready**:
   - "Add to Home Screen" on Android & iPhone to use like a native app.

---

## 📊 Google Sheet Column Structure

Paste your weekly billing export data with the following column headers:

| Item Code | Item Name | Category | Quantity | Unit | Reorder Level | Last Updated | Location | Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `HW-1001` | Hex Head Bolt M8x50mm | Hardware & Fasteners | 120 | Nos | 30 | 11-10-2026 | Rack A-01 | 15 |
| `EL-2045` | Flexible Copper Wire 1.5mm | Electrical & Lighting | 18 | Rolls | 25 | 11-10-2026 | Rack B-12 | 850 |

---

## 🛠️ How to Run Locally

```bash
cd "C:\Users\defaultuser0\.gemini\antigravity\scratch\godown-stock-app"
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 Deploy to Vercel (Free & Instant)

1. Push this project to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit of Godown Stock App"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository and click **Deploy**.
