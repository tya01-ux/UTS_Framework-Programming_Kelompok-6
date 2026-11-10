# API Specification - TeamFlow (Project Collaboration System)

Backend NestJS + TypeORM + MySQL. Dokumentasi interaktif tersedia di Swagger: `http://localhost:3001/api/docs`.

| Item | Nilai |
|---|---|
| Base URL | `http://localhost:3001/api` |
| Format | JSON (`Content-Type: application/json`) |
| Autentikasi | Tidak ada |
| Validasi | `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) |

## Ringkasan Endpoint

| Resource | POST | GET (list) | GET (detail) | PATCH | DELETE |
|---|---|---|---|---|---|
| Projects | `/projects` | `/projects` | `/projects/:id` | `/projects/:id` | `/projects/:id` |
| Members | `/members` | `/members` | `/members/:id` | `/members/:id` | `/members/:id` |
| Project Members | `/project-members` | `/project-members` | `/project-members/:id` | `/project-members/:id` | `/project-members/:id` |
| Tasks | `/tasks` | `/tasks` | `/tasks/:id` | `/tasks/:id` | `/tasks/:id` |
| Comments | `/comments` | `/comments` | `/comments/:id` | `/comments/:id` | `/comments/:id` |
| Files | `/files` | `/files` | `/files/:id` | `/files/:id` | `/files/:id` |

## Format Error Umum

| Status | Kapan terjadi | Contoh body |
|---|---|---|
| 400 Bad Request | Validasi DTO gagal, field tidak dikenal, `:id` bukan angka | `{"statusCode":400,"message":["name should not be empty"],"error":"Bad Request"}` |
| 404 Not Found | Data dengan ID tidak ada, atau relasi (FK) yang dirujuk tidak ada | `{"statusCode":404,"message":"Project tidak ditemukan","error":"Not Found"}` |
| 409 Conflict | Data unik sudah ada (email, project-member) | `{"statusCode":409,"message":"Email sudah digunakan","error":"Conflict"}` |

Catatan: `forbidNonWhitelisted: true` membuat field di luar DTO ditolak dengan 400 (`property xxx should not exist`). Untuk `:id` non-numerik, pesan 400 adalah `Validation failed (numeric string is expected)`.

---

## Projects

Pada GET, response memuat relasi `projectMembers` (beserta data `member`), `tasks`, dan `files`.

### Field Request Body

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `name` | string | Ya | Maks 150 karakter, tidak kosong |
| `description` | string | Tidak | Teks bebas |
| `status` | enum | Ya | planning / active / completed |
| `start_date` | date (YYYY-MM-DD) | Ya | Format tanggal ISO |
| `end_date` | date (YYYY-MM-DD) | Tidak | Format tanggal ISO |

Pada `PATCH`, semua field bersifat opsional (partial update).

### POST `/projects` - Membuat project

**Request body**

```json
{
  "name": "TeamFlow Website",
  "description": "Project kolaborasi mahasiswa",
  "status": "active",
  "start_date": "2026-11-09",
  "end_date": "2026-12-30"
}
```

**201 Created**

```json
{
  "id": 1,
  "name": "TeamFlow Website",
  "description": "Project kolaborasi mahasiswa",
  "status": "active",
  "start_date": "2026-11-09",
  "end_date": "2026-12-30",
  "created_at": "2026-11-10T01:00:00.000Z",
  "updated_at": "2026-11-10T01:00:00.000Z"
}
```

**Error**

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid |

### GET `/projects` - Daftar projects

**200 OK**: array objek project (beserta relasinya).

### GET `/projects/:id` - Detail project

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer (path) | ID project |

**200 OK**: objek project beserta relasinya.

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Project dengan ID {id} tidak ditemukan |

### PATCH `/projects/:id` - Mengubah project

**Request body** (contoh)

```json
{
  "status": "completed"
}
```

**200 OK**: objek hasil pembaruan.

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid / `id` bukan angka |
| 404 | Project dengan ID {id} tidak ditemukan atau relasi yang dirujuk tidak ada |

### DELETE `/projects/:id` - Menghapus project

**200 OK**

```json
{
  "message": "Project berhasil dihapus"
}
```

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Project dengan ID {id} tidak ditemukan |

---

## Members

Password tidak pernah ditampilkan. Pada GET, response memuat relasi `projectMembers`, `comments`, dan `files`.

### Field Request Body

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `name` | string | Ya | Maks 60 karakter, tidak kosong |
| `email` | string | Ya | Format email, unik |
| `password` | string | Ya | Minimal 6 karakter, disimpan ter-hash (bcrypt) |
| `phone` | string | Tidak | Maks 20 karakter |

Pada `PATCH`, semua field bersifat opsional (partial update).

### POST `/members` - Membuat member

**Request body**

```json
{
  "name": "Halim Wiko",
  "email": "halim@gmail.com",
  "password": "password123",
  "phone": "081234567890"
}
```

**201 Created**

```json
{
  "id": 1,
  "name": "Halim Wiko",
  "email": "halim@gmail.com",
  "phone": "081234567890",
  "created_at": "2026-11-10T01:00:00.000Z",
  "updated_at": "2026-11-10T01:00:00.000Z"
}
```

**Error**

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid |
| 409 | Email sudah digunakan |

### GET `/members` - Daftar members

**200 OK**: array objek member (beserta relasinya).

### GET `/members/:id` - Detail member

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer (path) | ID member |

**200 OK**: objek member beserta relasinya.

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Member dengan ID {id} tidak ditemukan |

### PATCH `/members/:id` - Mengubah member

**Request body** (contoh)

```json
{
  "name": "Halim Wiko Updated"
}
```

**200 OK**: objek hasil pembaruan.

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid / `id` bukan angka |
| 404 | Member dengan ID {id} tidak ditemukan atau relasi yang dirujuk tidak ada |
| 409 | Email sudah digunakan |

### DELETE `/members/:id` - Menghapus member

**200 OK**

```json
{
  "message": "Member berhasil dihapus"
}
```

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Member dengan ID {id} tidak ditemukan |

---

## Project Members

Pada GET, response memuat relasi `project` dan `member`. Kombinasi `project_id` + `member_id` harus unik.

### Field Request Body

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `project_id` | integer | Ya | ID project yang ada |
| `member_id` | integer | Ya | ID member yang ada |
| `role` | enum | Ya | manager / member |

Pada `PATCH`, semua field bersifat opsional (partial update).

### POST `/project-members` - Membuat project member

**Request body**

```json
{
  "project_id": 1,
  "member_id": 1,
  "role": "manager"
}
```

**201 Created**

```json
{
  "id": 1,
  "project_id": 1,
  "member_id": 1,
  "role": "manager",
  "joined_at": "2026-11-10T01:00:00.000Z"
}
```

**Error**

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid |
| 404 | Project tidak ditemukan / Member tidak ditemukan |
| 409 | Member sudah terdaftar pada project ini |

### GET `/project-members` - Daftar project members

**200 OK**: array objek project member (beserta relasinya).

### GET `/project-members/:id` - Detail project member

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer (path) | ID project member |

**200 OK**: objek project member beserta relasinya.

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Project member dengan ID {id} tidak ditemukan |

### PATCH `/project-members/:id` - Mengubah project member

**Request body** (contoh)

```json
{
  "role": "member"
}
```

**200 OK**: objek hasil pembaruan.

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid / `id` bukan angka |
| 404 | Project member dengan ID {id} tidak ditemukan atau relasi yang dirujuk tidak ada |
| 409 | Member sudah terdaftar pada project ini |

### DELETE `/project-members/:id` - Menghapus project member

**200 OK**

```json
{
  "message": "Member berhasil dikeluarkan dari project"
}
```

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Project member dengan ID {id} tidak ditemukan |

---

## Tasks

Pada GET, response memuat relasi `project` dan `comments`.

### Field Request Body

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `project_id` | integer | Ya | ID project yang ada |
| `title` | string | Ya | Maks 150 karakter, tidak kosong |
| `description` | string | Tidak | Teks bebas |
| `status` | enum | Ya | todo / in_progress / done |
| `priority` | enum | Ya | low / medium / high |
| `due_date` | date (YYYY-MM-DD) | Tidak | Tenggat waktu |

Pada `PATCH`, semua field bersifat opsional (partial update).

### POST `/tasks` - Membuat task

**Request body**

```json
{
  "project_id": 1,
  "title": "Membuat halaman login",
  "description": "Membuat tampilan login menggunakan React",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-12-01"
}
```

**201 Created**

```json
{
  "id": 1,
  "project_id": 1,
  "title": "Membuat halaman login",
  "description": "Membuat tampilan login menggunakan React",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-12-01",
  "created_at": "2026-11-10T01:00:00.000Z",
  "updated_at": "2026-11-10T01:00:00.000Z"
}
```

**Error**

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid |
| 404 | Project tidak ditemukan |

### GET `/tasks` - Daftar tasks

**200 OK**: array objek task (beserta relasinya).

### GET `/tasks/:id` - Detail task

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer (path) | ID task |

**200 OK**: objek task beserta relasinya.

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Task dengan ID {id} tidak ditemukan |

### PATCH `/tasks/:id` - Mengubah task

**Request body** (contoh)

```json
{
  "status": "in_progress"
}
```

**200 OK**: objek hasil pembaruan.

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid / `id` bukan angka |
| 404 | Task dengan ID {id} tidak ditemukan atau relasi yang dirujuk tidak ada |

### DELETE `/tasks/:id` - Menghapus task

**200 OK**

```json
{
  "message": "Task berhasil dihapus"
}
```

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Task dengan ID {id} tidak ditemukan |

---

## Comments

Pada GET, response memuat relasi `task` dan `member`.

### Field Request Body

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `task_id` | integer | Ya | ID task yang ada |
| `member_id` | integer | Ya | ID member yang ada |
| `content` | string | Ya | Isi komentar, tidak kosong |

Pada `PATCH`, semua field bersifat opsional (partial update).

### POST `/comments` - Membuat comment

**Request body**

```json
{
  "task_id": 1,
  "member_id": 1,
  "content": "Tampilan login sudah selesai dibuat."
}
```

**201 Created**

```json
{
  "id": 1,
  "task_id": 1,
  "member_id": 1,
  "content": "Tampilan login sudah selesai dibuat.",
  "created_at": "2026-11-10T01:00:00.000Z"
}
```

**Error**

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid |
| 404 | Task tidak ditemukan / Member tidak ditemukan |

### GET `/comments` - Daftar comments

**200 OK**: array objek comment (beserta relasinya).

### GET `/comments/:id` - Detail comment

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer (path) | ID comment |

**200 OK**: objek comment beserta relasinya.

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Comment dengan ID {id} tidak ditemukan |

### PATCH `/comments/:id` - Mengubah comment

**Request body** (contoh)

```json
{
  "content": "Komentar diperbarui."
}
```

**200 OK**: objek hasil pembaruan.

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid / `id` bukan angka |
| 404 | Comment dengan ID {id} tidak ditemukan atau relasi yang dirujuk tidak ada |

### DELETE `/comments/:id` - Menghapus comment

**200 OK**

```json
{
  "message": "Comment berhasil dihapus"
}
```

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | Comment dengan ID {id} tidak ditemukan |

---

## Files

Hanya metadata file yang disimpan di database (tanpa penyimpanan cloud). Pada GET, response memuat relasi `project` dan `member`.

### Field Request Body

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `project_id` | integer | Ya | ID project yang ada |
| `member_id` | integer | Ya | ID member pengunggah yang ada |
| `name` | string | Ya | Nama file, tidak kosong |
| `type` | string | Ya | MIME type, contoh application/pdf |
| `size` | string | Ya | Ukuran file dalam byte, contoh "204800" |
| `path` | string | Ya | Lokasi file, tidak kosong |

Pada `PATCH`, semua field bersifat opsional (partial update).

### POST `/files` - Membuat file

**Request body**

```json
{
  "project_id": 1,
  "member_id": 1,
  "name": "laporan_project.pdf",
  "type": "application/pdf",
  "size": "204800",
  "path": "uploads/laporan_project.pdf"
}
```

**201 Created**

```json
{
  "id": 1,
  "project_id": 1,
  "member_id": 1,
  "name": "laporan_project.pdf",
  "type": "application/pdf",
  "size": "204800",
  "path": "uploads/laporan_project.pdf",
  "uploaded_at": "2026-11-10T01:00:00.000Z"
}
```

**Error**

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid |
| 404 | Project tidak ditemukan / Member tidak ditemukan |

### GET `/files` - Daftar files

**200 OK**: array objek file (beserta relasinya).

### GET `/files/:id` - Detail file

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer (path) | ID file |

**200 OK**: objek file beserta relasinya.

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | File dengan ID {id} tidak ditemukan |

### PATCH `/files/:id` - Mengubah file

**Request body** (contoh)

```json
{
  "name": "laporan_final.pdf"
}
```

**200 OK**: objek hasil pembaruan.

| Status | Penyebab |
|---|---|
| 400 | Input tidak valid / `id` bukan angka |
| 404 | File dengan ID {id} tidak ditemukan atau relasi yang dirujuk tidak ada |

### DELETE `/files/:id` - Menghapus file

**200 OK**

```json
{
  "message": "File berhasil dihapus"
}
```

| Status | Penyebab |
|---|---|
| 400 | `id` bukan angka |
| 404 | File dengan ID {id} tidak ditemukan |

---

## Aturan Penghapusan (Cascade)

| Jika dihapus | Ikut terhapus |
|---|---|
| Project | project_members, tasks (beserta comments), files |
| Member | project_members, comments, files milik member tersebut |
| Task | comments pada task tersebut |
