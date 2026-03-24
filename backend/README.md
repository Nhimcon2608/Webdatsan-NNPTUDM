# Backend RESTful scaffold (Node.js + MongoDB)

## Stack hien tai
- Runtime: Node.js 20+ LTS
- Framework: Express.js
- Validation: Zod
- Upload: Multer
- Security/Middleware: Helmet, CORS, Morgan
- CSDL: MongoDB

Backend hien tai da ket noi MongoDB qua official `mongodb` driver. Du lieu mau duoc seed tu dong khi database rong, giu nguyen contract API de frontend khong can doi.

## Cau truc bat buoc da tao
- `bin/`
- `controllers/`
- `routes/`
- `schemas/`
- `utils/`
- `app.js`
- `package.json`

## Chay backend
### Cach 1: MongoDB local
```bash
mongod --dbpath /tmp/webdatsan-mongodb --bind_ip 127.0.0.1 --port 27017
```

### Cach 2: MongoDB bang Docker
```bash
docker compose up -d mongodb
```

### Chay API
```bash
cd backend
npm install
npm run seed:defaults
npm run dev
```

Bien moi truong mac dinh:
```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=webdatsan
```

## API groups da map theo frontend services

### Auth / Account
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `PATCH /accounts/change-password`
- `GET /accounts/me`
- `PUT /accounts/me/phone`
- `PUT /accounts/upload-image`

### Branch / Court / Price
- `GET /branches/is-cooperated/:isCooperated`
- `GET /branches/:branchId`
- `GET /branches/request/:requestId`
- `PUT /branches/:branchId/status`
- `POST /branches`
- `GET /branches/manager/:accountId`
- `PUT /branches/:branchId/update`
- `GET /badminton-courts/branch/:branchId/:status`
- `GET /badminton-courts/branch/:branchId`
- `GET /badminton-courts/manager/:accountId`
- `PATCH /badminton-courts/:courtId/toggle`
- `POST /badminton-courts`
- `POST /badminton-courts-images`
- `DELETE /badminton-courts-images/:badmintonCourtId/images/:imageId`
- `GET /prices`
- `GET /prices/:id`
- `GET /prices/branch/:branchId`
- `GET /prices/branch/:branchId/all-types`
- `GET /prices/branch/:branchId/price-type/:priceTypeId`
- `POST /prices`
- `PUT /prices/:id`
- `DELETE /prices/:id`
- `GET /price-types`
- `GET /price-types/:id`
- `POST /price-types`
- `DELETE /price-types/:id`

### Reservation / Payment / Voucher / Review
- `GET /reservations`
- `GET /reservations/branch/:branchId/:date`
- `GET /reservations/branch/:branchId?from=...&to=...`
- `GET /reservations/:reservationId`
- `GET /reservations/user/:status`
- `POST /reservations`
- `PUT /reservations/cancel/:reservationId`
- `PUT /reservations/:reservationId`
- `PATCH /reservations/schedule-cancel/:reservationId`
- `PATCH /reservations/schedule-cancel`
- `GET /reservations/branch/:branchId/all`
- `GET /reservations/latest`
- `PUT /reservations/:reservationId/status`
- `GET /reservations/notification/:reservationId`
- `POST /reservation-details`
- `GET /reservation-details/court/:courtId/today`
- `POST /fixed-booking`
- `PATCH /fixed-booking`
- `POST /payments`
- `GET /payments/branch/:branchId`
- `PUT /payments/:invoiceId/status`
- `POST /payment/momo/create`
- `GET /payment/momo/resIds-of/:orderId`
- `GET /vouchers/branch/:branchId`
- `POST /vouchers`
- `PUT /vouchers/:voucherId`
- `PATCH /vouchers/enable?voucherId=...&status=...`
- `GET /reviews/branch/:branchId`
- `GET /reviews/user`
- `POST /reviews`
- `PUT /reviews/:id`

### Other endpoints
- `GET /owners`
- `GET /owners/phone/:phoneNumber`
- `GET /players/account/:accountId`
- `PUT /players`
- `POST /partnershiprequests`
- `GET /partnershiprequests`
- `PATCH /partnershiprequests/:requestId/status`
- `GET /temporary-recruitments`
- `GET /temporary-recruitments/:id`
- `GET /temporary-recruitments/full-infor/:id`
- `GET /temporary-recruitments/by-reservation/:id`
- `POST /temporary-recruitments`
- `PATCH /temporary-recruitments/:id`
- `PUT /temporary-recruitments/:id`
- `GET /temporary-recruitments-saved`
- `POST /temporary-recruitments-saved`
- `DELETE /temporary-recruitments-saved/:temporaryRecruitmentId`
- `GET /temporary-registrations`
- `POST /temporary-registrations`

## VS Code extensions nen cai
- ESLint
- Prettier - Code formatter
- REST Client (hoac Thunder Client)
- DotENV
- Error Lens
- MongoDB for VS Code
