# TeamFlow - Project Collaboration System (Backend NestJS)

Backend API kolaborasi proyek: proyek, member, anggota proyek, tugas, komentar, dan metadata file.
UTS Framework Programming (NestJS) - Studi Kasus 6.

## Teknologi

NestJS, TypeScript, TypeORM, MySQL, class-validator, class-transformer, Swagger, bcrypt.

## Prasyarat

| Kebutuhan | Keterangan |
|---|---|
| Node.js | Versi LTS |
| MySQL | Misal lewat XAMPP, pastikan service MySQL menyala |

## Instalasi

```bash
git clone <url-repo>
cd uts-framework
npm install
```

## Konfigurasi Environment

Salin `.env.example` menjadi `.env` di folder yang sama dengan `package.json`, lalu sesuaikan.

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=teamflow_db
```

## Database

1. Buat database kosong (TypeORM tidak membuat database, hanya tabel):

```sql
CREATE DATABASE teamflow_db;
```

2. Migrasi: project ini memakai `synchronize: true` pada TypeORM, sehingga seluruh tabel dibuat/diperbarui otomatis dari entity saat aplikasi pertama kali dijalankan. Tidak perlu menjalankan file migrasi manual.

## Menjalankan Aplikasi

```bash
npm run start:dev
```

| Item | URL |
|---|---|
| Base URL API | `http://localhost:3001/api` |
| Swagger | `http://localhost:3001/api/docs` |
| OpenAPI JSON | `http://localhost:3001/api/docs-json` |

## Endpoint

| Resource | Path |
|---|---|
| Projects | `/api/projects` |
| Members | `/api/members` |
| Project Members | `/api/project-members` |
| Tasks | `/api/tasks` |
| Comments | `/api/comments` |
| Files | `/api/files` |

Setiap resource mendukung `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id`. Detail request/response: lihat `API_SPEC.md`.

## Pengujian dengan Postman

1. Jalankan aplikasi (`npm run start:dev`).
2. Postman: Import -> pilih `TeamFlow.postman_collection.json`.
3. Pastikan variable `baseUrl` = `http://localhost:3001/api`.
4. Klik kanan collection -> Run collection (jalankan berurutan folder 1 sampai 9).

Collection berisi skenario sukses (CRUD semua entitas), verifikasi relasi, skenario gagal (400, 404, 409), dan penghapusan data uji.

## Dokumen Pendukung

| File | Isi |
|---|---|
| `ERD_TeamFlow.png` | Entity Relationship Diagram |
| `API_SPEC.md` | API Specification |
| `KEBUTUHAN_DAN_ATURAN_BISNIS.md` | Kebutuhan fungsional, aturan bisnis, alur pengguna |
| `TeamFlow.postman_collection.json` | Postman Collection |
| `Postman Result.png` | Hasil pengujian API melalui postman  |


## Struktur Folder

```
src/
  projects/ members/ project-members/ tasks/ comments/ files/
    dto/        # DTO + validasi
    entities/   # entity TypeORM
    *.controller.ts  *.service.ts  *.module.ts
  app.module.ts   # koneksi database + registrasi module
  main.ts         # ValidationPipe global, prefix /api, Swagger
```
