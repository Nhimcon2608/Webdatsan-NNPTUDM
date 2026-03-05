# WebDatSan - Nền tảng quản lý sân cầu lông

WebDatSan là một ứng dụng web hiện đại để quản lý sân cầu lông, cho phép người dùng đặt sân, quản lý đặt chỗ, xử lý thanh toán, và quản lý toàn bộ hệ thống sân cầu lông.

## 📋 Mục lục

- [Tính năng](#tính-năng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Kiến trúc](#kiến-trúc)
- [Tài khoản demo](#tài-khoản-demo)
- [API endpoints](#api-endpoints)

## ✨ Tính năng

### Cho người dùng (User)
- **Trang chủ**: Xem danh sách các sân cầu lông gần đó
- **Tìm kiếm sân**: Tìm sân theo chi nhánh, vị trí
- **Đặt sân**: Đặt sân cầu lông, chọn giờ chơi
- **Xem chi tiết sân**: Xem thông tin sân, giá cả, hình ảnh
- **Thanh toán**: Thanh toán qua MoMo hoặc phương thức khác
- **Quản lý đặt chỗ**: Xem lịch sử đặt sân, hủy đặt
- **Tuyển dụng tạm thời**: Xem bài về tuyển dụng cầu thủ tạm thời
- **Đánh giá**: Viết đánh giá cho sân cầu lông
- **Hồ sơ cá nhân**: Cập nhật thông tin tài khoản

### Cho quản lý sân (Manager)
- **Bảng điều khiển**: Xem thống kê, doanh thu, lịch sân hôm nay
- **Quản lý sân**: CRUD sân cầu lông, thêm hình ảnh
- **Quản lý giá**: Cấu hình giá theo khung giờ, loại giá (VIP, Thường)
- **Quản lý đặt chỗ**: Xem, chỉnh sửa trạng thái đặt chỗ
- **Quản lý voucher**: Tạo, cập nhật mã voucher giảm giá
- **Quản lý hóa đơn**: Xem các hóa đơn thanh toán
- **Quản lý nhân viên**: Quản lý tài khoản nhân viên
- **Quản lý chi nhánh**: Cập nhật thông tin chi nhánh

### Cho quản trị viên (Admin)
- **Bảng điều khiển**: Xem thống kê toàn hệ thống
- **Yêu cầu hợp tác**: Duyệt các yêu cầu hợp tác từ chủ sân
- **Quản lý chi nhánh**: Duyệt, kích hoạt/vô hiệu hóa chi nhánh
- **Quản lý tài khoản**: Quản lý tất cả tài khoản người dùng
- **Hồ sơ cá nhân**: Cập nhật thông tin quản trị viên

## 🔧 Yêu cầu hệ thống

- **Node.js**: v16+ (hoặc v18+)
- **npm**: v7+
- **Git**: Để clone dự án
- **RAM**: Tối thiểu 2GB
- **Hệ điều hành**: Windows, macOS, hoặc Linux

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/Nhimcon2608/Webdatsan-NNPTUDM.git
cd Webdatsan
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Nội dung `.env` (mặc định):

```env
PORT=8080
NODE_ENV=development
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

Tạo file `.env` hoặc `.env.local`:

**Tùy chọn 1: Backend chạy cục bộ**
```env
VITE_API_URL=http://localhost:8080
```

**Tùy chọn 2: Ngrok (nếu chạy qua Docker)**
```env
VITE_API_URL=https://your-ngrok-url.ngrok.io
```

## 🚀 Chạy ứng dụng

### Chạy cục bộ (Recommended)

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
# hoặc
npm start
```

Backend sẽ chạy tại: `http://localhost:8080`

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### Chạy với Docker Compose

```bash
# Chạy tất cả services
docker-compose up --build

# Chạy background
docker-compose up -d --build

# Dừng services
docker-compose down
```

**Lưu ý**: Docker Compose hiện tại được cấu hình cho kiến trúc Spring Boot, cần cập nhật nếu muốn dùng Node.js backend.

## 📂 Cấu trúc dự án

```
Webdatsan/
├── backend/                           # Backend Node.js + Express
│   ├── bin/
│   │   └── www.js                    # Entry point
│   ├── controllers/                  # Logic xử lý request
│   │   ├── authController.js         # Xác thực người dùng
│   │   ├── badmintonCourtController.js
│   │   ├── branchController.js
│   │   ├── playerController.js
│   │   ├── priceController.js
│   │   ├── reservationController.js
│   │   └── ... (các controller khác)
│   ├── routes/                       # API routes (tạm không sử dụng)
│   ├── schemas/                      # Zod validation schemas
│   ├── utils/
│   │   ├── asyncHandler.js           # Async error handling
│   │   ├── errorHandlers.js          # Error middleware
│   │   ├── requestContext.js         # Request context tracking
│   │   ├── response.js               # Standardized responses
│   │   └── store.js                  # In-memory data store
│   ├── app.js                        # Express app setup
│   ├── .env.example                  # Environment template
│   └── package.json
│
├── frontend/                          # Frontend React + Vite
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── common/               # Shared components
│   │   │   ├── modal/                # Modal dialogs
│   │   │   └── routes/               # Route protection components
│   │   ├── context/                  # React Context (Auth, Snackbar)
│   │   ├── hook/                     # Custom React hooks
│   │   ├── pages/                    # Page components
│   │   │   ├── user/                 # User pages
│   │   │   ├── manager/              # Manager pages
│   │   │   ├── admin/                # Admin pages
│   │   │   └── LoginPage.jsx
│   │   ├── routes/                   # Route definitions
│   │   │   ├── UserRoutes.jsx
│   │   │   ├── ManagerRoutes.jsx
│   │   │   ├── AdminRoutes.jsx
│   │   │   └── index.jsx
│   │   ├── layouts/                  # Layout components
│   │   │   ├── admin/
│   │   │   ├── manager/
│   │   │   └── user/
│   │   ├── services/                 # API services
│   │   │   ├── api.jsx               # Axios config
│   │   │   ├── authService.jsx
│   │   │   ├── badmintonCourtService.jsx
│   │   │   ├── reservationService.jsx
│   │   │   └── ... (các service khác)
│   │   ├── theme/                    # Material-UI themes
│   │   ├── utils/                    # Utility functions
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # React entry point
│   ├── public/                       # Static assets
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── eslint.config.js              # ESLint config
│   ├── index.html
│   └── package.json
│
├── docker-compose.yml                # Docker Compose configuration
└── README.md                          # This file
```

## 🏗️ Kiến trúc

### Backend Architecture

```
Request Flow:
1. Request → Express Router
2. Middleware (CORS, Helmet, Morgan, Auth validation)
3. Controller (Business logic)
4. Store (In-memory data store)
5. Response (Standardized JSON format)
```

**Key Components:**

- **Controllers**: Xử lý business logic và HTTP responses
- **Store (store.js)**: In-memory database với các table:
  - `accounts`: Tài khoản người dùng
  - `players`: Thông tin cầu thủ
  - `owners`: Chủ sân
  - `branches`: Chi nhánh sân
  - `badmintonCourts`: Sân cầu lông
  - `prices`: Bảng giá
  - `reservations`: Đặt chỗ
  - `reviews`: Đánh giá
  - Và nhiều bảng khác...

- **Utils**:
  - `response.js`: Helper cho JSON response (ok, created)
  - `errorHandlers.js`: Global error handling
  - `asyncHandler.js`: Wrapper cho async functions
  - `requestContext.js`: Tracking request metadata

**Response Format**:
```javascript
{
  success: true/false,
  message: "string",
  data: null | object | array
}
```

### Frontend Architecture

```
App → BrowserRouter
  ├── Public Routes
  │   └── LoginPage
  ├── User Routes
  │   ├── HomePage
  │   ├── BadmintonBranchsPage
  │   ├── CheckoutPage
  │   └── ... (user pages)
  ├── Manager Routes
  │   ├── ManagerLayout
  │   ├── DashboardPage
  │   ├── CourtsPage
  │   └── ... (manager pages)
  └── Admin Routes
      ├── AdminLayout
      ├── DashboardPage
      └── ... (admin pages)
```

**Key Components:**

- **Authentication**: Context API + JWT Token
- **Routing**: Role-based route protection
- **State Management**: React Context (Auth, Snackbar notifications)
- **Styling**: Material-UI + TailwindCSS
- **HTTP Client**: Axios với interceptors
- **Charts**: Chart.js, Recharts
- **Date**: date-fns, dayjs

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router 7 |
| **UI Library** | Material-UI 7, TailwindCSS 4 |
| **Backend** | Node.js, Express 4 |
| **API Client** | Axios |
| **Security** | Helmet, CORS |
| **Logging** | Morgan |
| **Validation** | Zod |
| **Charts** | Chart.js, Recharts, MUI X Charts |
| **Animations** | Framer Motion |
| **Date Handling** | date-fns, dayjs |

## 👤 Tài khoản Demo

Dùng các tài khoản sau để đăng nhập:

| Email | Password | Role | Note |
|-------|----------|------|------|
| `manager@webdatsan.vn` | `123456` | MANAGER | Quản lý sân |
| `player@webdatsan.vn` | `123456` | USER | Người chơi |

**Đăng ký tài khoản mới**: Sử dụng form đăng ký trong ứng dụng

## 🔌 API Endpoints

### Authentication
```
POST   /auth/login          - Đăng nhập
POST   /auth/register       - Đăng ký
POST   /auth/logout         - Đăng xuất
```

### Badminton Courts
```
GET    /badminton-courts    - Danh sách tất cả sân
GET    /badminton-courts/:branchId/:status  - Sân theo chi nhánh và status
GET    /badminton-courts/:branchId          - Sân theo chi nhánh
GET    /badminton-courts/manager/:accountId - Sân của quản lý
POST   /badminton-courts    - Tạo sân mới
PATCH  /badminton-courts/:courtId/status   - Thay đổi trạng thái sân
```

### Reservations
```
GET    /reservations        - Danh sách đặt chỗ
POST   /reservations        - Tạo đặt mới
PATCH  /reservations/:id    - Cập nhật đặt chỗ
DELETE /reservations/:id    - Hủy đặt chỗ
```

### Branches
```
GET    /branches            - Danh sách chi nhánh
GET    /branches/:id        - Chi tiết chi nhánh
POST   /branches            - Tạo chi nhánh
PUT    /branches/:id        - Cập nhật chi nhánh
```

### Prices
```
GET    /prices              - Danh sách giá
GET    /prices/branch/:branchId  - Giá theo chi nhánh
POST   /prices              - Tạo giá mới
PUT    /prices/:id          - Cập nhật giá
```

### Players
```
GET    /players             - Danh sách cầu thủ
GET    /players/:id         - Chi tiết cầu thủ
POST   /players             - Tạo cầu thủ
PUT    /players/:id         - Cập nhật cầu thủ
```

### Reviews
```
GET    /reviews             - Danh sách đánh giá
POST   /reviews             - Tạo đánh giá
GET    /reviews/:courtId    - Đánh giá theo sân
```

### Vouchers
```
GET    /vouchers            - Danh sách voucher
POST   /vouchers            - Tạo voucher
PUT    /vouchers/:id        - Cập nhật voucher
```

**Lưu ý**: Hiện tại backend không có route file được định nghĩa, controller được gọi trực tiếp từ app.js để demonstrate.

## 🔐 Authentication & Authorization

- **Token**: JWT token lưu trong `localStorage`
- **Header**: `Authorization: Bearer <token>`
- **Roles**: ADMIN, MANAGER, USER
- **Protection**: Route được bảo vệ bằng ProtectedRoute và RoleBasedRoute

### Route Protection Flow:
1. Login → Nhận JWT token
2. Lưu token vào localStorage
3. Axios interceptor tự động thêm token vào mỗi request
4. Protected routes kiểm tra token existence
5. Role-based routes kiểm tra user role

## 🛠️ Development

### Commands

**Backend**
```bash
cd backend
npm run dev      # Chuyên sâu development mode với hot reload
npm start        # Production mode
npm test         # Run tests (if available)
```

**Frontend**
```bash
cd frontend
npm run dev      # Development server
npm run build    # Build cho production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding Features

**Backend - Thêm controller mới**:
1. Tạo file `src/controllers/newController.js`
2. Import vào `app.js`
3. Thêm route trong `app.js`
4. Thêm data vào `store.js` nếu cần

**Frontend - Thêm page mới**:
1. Tạo component trong `src/pages/`
2. Thêm route vào route file tương ứng
3. Tạo API service trong `src/services/`
4. Import và sử dụng trong component

## 📊 Data Flow

### User Login Flow:
```
Login Form
  ↓
authService.login(email, password)
  ↓
POST /auth/login
  ↓
Backend: authController.login()
  ↓
Kiểm tra accounts store
  ↓
Return token + user info
  ↓
Frontend: Lưu token → localStorage
  ↓
Redirect to dashboard
```

### Booking Flow:
```
Select Court → Choose Time → Checkout
  ↓
POST /reservations
  ↓
Backend: Create reservation + reservation details
  ↓
Generate invoice
  ↓
Payment (MoMo)
  ↓
Update reservation status = PAID
  ↓
Confirmation email
```

## 📝 Logging & Monitoring

- **Morgan**: HTTP request logging
- **Console**: Lỗi chi tiết
- **RequestContext**: Tracking request metadata
- **Frontend**: Console logs cho development

## 🐛 Debugging

**Backend**:
```bash
# Enable debug logging
NODE_DEBUG=express npm run dev
```

**Frontend**:
- Mở DevTools (F12)
- Kiểm tra Network tab cho API calls
- Kiểm tra Console tab cho errors
- Redux DevTools (nếu thêm Redux)

## 🚀 Deployment

### Frontend (Vercel, Netlify)
```bash
# Build production
npm run build

# Output: dist/ folder
# Deploy dist/ folder
```

### Backend (Heroku, Railway, Render)
```bash
# Ensure .env is set up properly
# Deploy main files: bin/www.js, controllers/, utils/
```

### Environment Variables Checklist:
- [ ] Backend: `PORT`, `NODE_ENV`
- [ ] Frontend: `VITE_API_URL`

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Notes

- **Data Persistence**: Hiện tại sử dụng in-memory store, dữ liệu sẽ reset khi server restart. Bạn có thể thay thế bằng database thật (MySQL, PostgreSQL, MongoDB).
- **Authentication**: Token không có expiration time, cần thêm JWT expiration trong production.
- **File Upload**: Multer được install nhưng chưa được implement, cần thiết lập nơi lưu trữ ảnh.
- **Real Database**: Cân nhắc sử dụng Prisma, Sequelize, hoặc ORM khác cho production.

---

**Tác giả**: WebDatSan Team  
**Cập nhật lần cuối**: 5 tháng 3, 2026
