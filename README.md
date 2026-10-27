# Nexis Tech — Nền Tảng Thiết Kế & Phát Triển Website Chuyên Nghiệp

Website chính thức và hệ thống tiếp nhận tư vấn tự động của **Nexis Tech** — đơn vị thiết kế UI/UX, phát triển website doanh nghiệp, web application, thương mại điện tử và giải pháp tích hợp AI tại TP. Hồ Chí Minh.

---

## 1. Thông Tin Thương Hiệu Thống Nhất

- **Thương hiệu:** Nexis Tech
- **Slogan:** *Build Digital. Create What's Next.*
- **Số điện thoại:** `0909 858 428`
- **Email tiếp nhận:** `nexistech.work@gmail.com`
- **Khu vực hoạt động:** TP. Hồ Chí Minh, Việt Nam
- **Bảng màu nhận diện:** Navy sâu (`#030B24`, `#071638`) — Xanh điện (`#087BFF`) — Cyan nổi bật (`#16D9F3`) — Trắng thanh lịch (`#F4F8FF`, `#F3F7FC`)
- **Phông chữ chuẩn:** `Be Vietnam Pro` (Nội dung 400, Nhãn/Menu 500, Tiêu đề 600)

---

## 2. Kiến Trúc Kỹ Thuật

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion v12) cho chuyển động mượt mà (easing cubic-bezier, hỗ trợ `prefers-reduced-motion`).
- **Backend / API:** Node.js Express server (`server.ts`), phục vụ cả API routes (`/api/consultation`, `/health`) và static SPA client trên cùng một tiến trình tối ưu.
- **Cơ sở dữ liệu bền vững:** SQLite với WAL mode (`better-sqlite3`), bảo đảm tính toàn vẹn dữ liệu (ACID), chống gửi trùng trong cửa sổ 5 phút qua `payloadHash` và `idempotencyKey`.
- **Hệ thống thông báo:** Dispatcher xử lý độc lập hai kênh Email (Nodemailer SMTP / Resend) và Zalo Official Account OpenAPI v3.0 với cơ chế bounded retry có backoff, khôi phục tác vụ tự động khi khởi động lại server.

---

## 3. Cài Đặt & Chạy Môi Trường Local

### Yêu cầu hệ thống
- Node.js >= 20.x (Khuyến nghị Node.js 22.x hoặc 24.x)
- npm >= 10.x

### Các bước cài đặt

```bash
# 1. Clone repository
git clone https://github.com/tanganhkiet09112005-blip/nexis-tech-web-app.git
cd nexis-tech-web-app

# 2. Cài đặt dependencies
npm install

# 3. Tạo file cấu hình môi trường từ mẫu
cp .env.example .env

# 4. Chạy kiểm thử tự động
npm test

# 5. Khởi động môi trường phát triển (Full-stack Express + Vite HMR)
npm run dev
```

Truy cập website tại: `http://localhost:3000`

---

## 4. Các Scripts Trong Project

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy máy chủ phát triển Express tích hợp Vite HMR tại cổng 3000 |
| `npm run build` | Biên dịch toàn bộ frontend bằng `vite build` và đóng gói server thành `dist/server.js` |
| `npm run build:server` | Đóng gói `server.ts` thành `dist/server.js` độc lập bằng `esbuild` |
| `npm start` | Chạy máy chủ production native bằng `node dist/server.js` |
| `npm test` | Chạy toàn bộ 8 bài kiểm thử unit & integration qua Node Test Runner (`node:test`) |
| `npm run lint` | Kiểm tra nghiêm ngặt kiểu dữ liệu TypeScript (`tsc --noEmit`) |

---

## 5. Hướng Dẫn Biến Môi Trường (Secrets)

Toàn bộ thông tin bí mật được quản lý phía máy chủ qua file `.env` (hoặc mục Secrets trên nền tảng hosting), tuyệt đối **không** để lộ ra phía client.

Tham khảo file mẫu: `.env.example`

### 5.1. Cơ sở dữ liệu SQLite
```env
SQLITE_DB_PATH="data/nexis_consultations.sqlite"
```
*Lưu ý khi deploy:* Đảm bảo đường dẫn này trỏ tới Persistent Volume hoặc thư mục có quyền ghi bền vững.

### 5.2. Cấu hình Email Thông Báo
Email nhận cố định: `nexistech.work@gmail.com`. Chọn **1 trong 2** phương thức:

**Phương thức A (Khuyến nghị - Gmail SMTP):**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="nexistech.work@gmail.com"
SMTP_PASS="YOUR_16_CHAR_GMAIL_APP_PASSWORD"
SMTP_FROM="nexistech.work@gmail.com"
```
*(Tạo Mật khẩu ứng dụng 16 ký tự tại: Google Account -> Security -> 2-Step Verification -> App passwords)*

**Phương thức B (Resend API với tên miền riêng):**
```env
RESEND_API_KEY="re_xxxxxxxxxxxxxx"
EMAIL_FROM="tuvan@domain-cua-ban.com"
```

### 5.3. Cấu hình Zalo Official Account (OA)
Thông báo được gửi tới tài khoản người phụ trách qua Zalo OA OpenAPI v3.0:
```env
# UID của người phụ trách đối với Zalo OA (KHÔNG phải số điện thoại)
ZALO_RECIPIENT_USER_ID="YOUR_ZALO_OA_RECIPIENT_USER_ID"
ZALO_OA_ACCESS_TOKEN="YOUR_ZALO_OA_ACCESS_TOKEN"

# Tùy chọn tự động gia hạn token (OAuth v4)
ZALO_APP_ID="YOUR_ZALO_APP_ID"
ZALO_APP_SECRET="YOUR_ZALO_APP_SECRET"
ZALO_OA_REFRESH_TOKEN="YOUR_ZALO_OA_REFRESH_TOKEN"
```

---

## 6. Hướng Dẫn Triển Khai Production (DevOps)

Ứng dụng được thiết kế theo mô hình Monolith tinh gọn: Express phục vụ cả static assets đã build của Vite và các API endpoints (`/api/consultation`, `/health`).

### Cách 1: Triển khai với Docker (Khuyến nghị trên VPS / Cloud)

Tạo `Dockerfile`:
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
VOLUME ["/app/data"]
EXPOSE 3000
CMD ["npm", "start"]
```

### Cách 2: Triển khai trên Render / Railway / Fly.io

1. **Build Command:** `npm install && npm run build`
2. **Start Command:** `npm start`
3. **Environment Variables:** Cấu hình các biến trong file `.env.example` vào mục Environment Variables / Secrets.
4. **Persistent Disk:** Gắn một đĩa lưu trữ (Disk/Volume) vào thư mục `/app/data` để cơ sở dữ liệu SQLite được bảo toàn qua các lần deploy hoặc restart.
5. **Health Check:** Trỏ health check path về `/health` (trả về HTTP 200 `{ status: "ok" }`).

---

## 7. Giấy Phép & Bản Quyền

Bản quyền © 2026 **Nexis Tech**. Bảo lưu mọi quyền.
Mọi thông tin liên hệ: `nexistech.work@gmail.com` — Hotline: `0909 858 428`.
