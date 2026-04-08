# Routes Map

Tai lieu nay ghi lai route va contract chinh dang duoc repo su dung cho auth, reservation va payment flow.

## Base Prefix

- API base prefix: `/api/v1`
- Health aliases:
  - `/health`
  - `/api/health`
  - `/api/v1/health`

## Auth

### `POST /api/v1/auth/login`

- Auth: public
- Ghi chu:
  - Backend tra ve JWT trong field `token`
  - JWT duoc gui lai qua header `Authorization: Bearer <token>`
  - Env ho tro:
    - `JWT_SECRET`
    - `JWT_EXPIRES_IN` (mac dinh `7d`)
    - `JWT_ISSUER` (mac dinh `webdatsan-backend`)
- Payload:
```json
{
  "email": "admin@webdatsan.vn",
  "password": "123456"
}
```
- Response data:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "account": {}
}
```

### `POST /api/v1/auth/register`

- Auth: public
- Payload: email/username + password + thong tin account

### `POST /api/v1/auth/logout`

- Auth: `requireAuth`
- Ghi chu:
  - JWT la stateless, server khong luu session
  - Logout thanh cong khi client xoa token local

## Reservations

### `GET /api/v1/reservations`

- Auth: public, truong hop `userScope=current` can token
- Query:
  - `branchId`
  - `date`
  - `from`
  - `to`
  - `status`
  - `userScope=current`
  - `excludeCancelled=true`
  - `sort=createdAt|-createdAt`

### `POST /api/v1/reservations`

- Auth: `requireAuth`
- Muc dich:
  - Tao reservation
  - Neu payload co `reservationDetails`, backend se lock slot theo tung khung gio 60 phut truoc khi ghi reservation
  - Request den sau neu trung `courtId + slotDate + slotStart` se bi tu choi
- Payload one-time booking hien tai:
```json
{
  "bookAt": "2026-04-09 00:00:00",
  "branchId": "branch-1",
  "playerId": "player-1",
  "voucherId": "voucher-1",
  "status": "awaiting_payment",
  "totalPrice": 200000,
  "deposit": 100000,
  "reservationDetails": [
    {
      "badmintonCourtId": "court-1",
      "slotDate": "2026-04-09",
      "startTime": "18:00",
      "endTime": "20:00",
      "rentalTime": 2,
      "extendedTime": 0
    }
  ]
}
```
- Success:
  - `201 Created`
- Conflict:
  - `409 Conflict` khi slot da duoc user khac giu/booking truoc
  - Message mau: `Court court-1 is already booked on 2026-04-09 at 18:00`

### `GET /api/v1/reservations/:reservationId`

- Auth: public
- Response: reservation da serialize kem `reservationDetails`

### `PATCH /api/v1/reservations/:reservationId`

- Auth: `requireAuth`
- Muc dich:
  - Cap nhat reservation
  - Neu status chuyen sang nhom `cancel`, backend se release slot lock cua reservation do

### `PATCH /api/v1/reservations/status-updates`

- Auth: `requireAuth`
- Payload:
```json
{
  "reservationIds": ["res-1", "res-2"],
  "status": "SCHEDULED_CANCEL"
}
```
- Ghi chu:
  - Nhung reservation bi chuyen sang nhom `cancel` se duoc release slot lock

## Reservation Details

### `GET /api/v1/reservations/details`

- Auth: public
- Query:
  - `courtId`
  - `date`
- Ghi chu:
  - Route lookup chiem cho cho manager/frontend
  - Da bo qua reservation co status thuoc nhom `cancel`

### `POST /api/v1/reservations/details`

- Auth: `requireAuth`
- Trang thai:
  - Route legacy de tao detail rieng le
  - Luong user booking mac dinh hien tai khong con di qua route nay; detail duoc tao atomically ben trong `POST /api/v1/reservations`

## Payments

### `POST /api/v1/payments/links`

- Auth: `requireAuth`
- Payload:
```json
{
  "amount": 100000,
  "resIds": ["res-1"],
  "orderInfo": "Dat coc cho lich dat san"
}
```

### MoMo IPN

- Khi provider tra ket qua fail, backend dong bo payment/reservation va release slot lock cua reservation bi `CANCEL`
