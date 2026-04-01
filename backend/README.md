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

Source of truth cho route naming, base prefix va auth contract da duoc tach ra file `../routes-map.md`.

Tom tat nhanh:

- Base prefix hien tai: `/api/v1`
- Health endpoints: `/health`, `/api/health`, `/api/v1/health`
- Auth group: `/api/v1/auth/*`
- User/account group: `/api/v1/users/*`, `/api/v1/players/*`
- Domain groups: `/api/v1/branches`, `/api/v1/courts`, `/api/v1/prices`, `/api/v1/reservations`, `/api/v1/payments`

Neu can them, doi ten hoac doi auth middleware cho endpoint moi, cap nhat `routes-map.md` truoc roi moi sua code.

## VS Code extensions nen cai
- ESLint
- Prettier - Code formatter
- REST Client (hoac Thunder Client)
- DotENV
- Error Lens
- MongoDB for VS Code
