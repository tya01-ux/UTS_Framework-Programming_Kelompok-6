# Perancangan Sistem - TeamFlow (Project Collaboration System)

## 1. Deskripsi Sistem

TeamFlow adalah backend API untuk kolaborasi proyek. Pengguna (member) tergabung dalam proyek, mengerjakan tugas, saling memberi komentar pada tugas, dan menyimpan metadata file yang berkaitan dengan proyek. Aplikasi hanya berupa backend REST API (NestJS), diuji menggunakan Postman.

## 2. Kebutuhan Fungsional

| Kode | Kebutuhan | Endpoint |
|---|---|---|
| F1 | Mengelola proyek (tambah, lihat, ubah, hapus) | `/projects` |
| F2 | Mengelola anggota/member (tambah, lihat, ubah, hapus) | `/members` |
| F3 | Menambahkan anggota ke proyek dan menampilkan daftar anggota proyek beserta perannya | `/project-members`, `GET /projects/:id` |
| F4 | Membuat dan mengelola tugas dalam proyek, termasuk status, prioritas, dan tenggat | `/tasks` |
| F5 | Menambahkan komentar pada tugas | `/comments` |
| F6 | Menyimpan dan menampilkan metadata file yang berkaitan dengan proyek | `/files` |

## 3. Kebutuhan Non-Fungsional

| Kode | Kebutuhan |
|---|---|
| N1 | Backend NestJS (TypeScript) dengan pemisahan Module, Controller, Service |
| N2 | Database relasional MySQL, diakses melalui TypeORM |
| N3 | Validasi input dengan DTO, class-validator, class-transformer, dan `ValidationPipe` |
| N4 | Konfigurasi database dan data sensitif melalui environment variables (`.env`) |
| N5 | Dokumentasi API melalui Swagger/OpenAPI dan dokumen Markdown |
| N6 | Password disimpan dalam bentuk hash (bcrypt) |

## 4. Aturan

| Kode | Aturan |
|---|---|
| B1 | Email member harus unik. Email yang sudah dipakai ditolak dengan 409 |
| B2 | Password minimal 6 karakter, disimpan ter-hash, dan tidak pernah ditampilkan pada response |
| B3 | Satu member hanya bisa terdaftar satu kali pada satu proyek (unik `project_id` + `member_id`). Duplikat ditolak dengan 409 |
| B4 | Peran anggota proyek hanya `manager` atau `member` (default `member`) |
| B5 | Status proyek hanya `planning`, `active`, atau `completed` (default `planning`) |
| B6 | Status tugas hanya `todo`, `in_progress`, atau `done` (default `todo`). Prioritas hanya `low`, `medium`, atau `high` (default `medium`) |
| B7 | Tugas harus berada pada proyek yang ada. Komentar harus merujuk tugas dan member yang ada. File harus merujuk proyek dan member yang ada. Jika tidak ada, ditolak dengan 404 |
| B8 | Satu tugas dapat memiliki banyak komentar, satu proyek dapat memiliki banyak tugas dan banyak file |
| B9 | Hanya metadata file (nama, tipe, ukuran, path) yang disimpan di database, tanpa penyimpanan cloud |
| B10 | Menghapus proyek ikut menghapus anggota proyek, tugas, komentar tugas, dan file. Menghapus member ikut menghapus keanggotaan, komentar, dan file miliknya. Menghapus tugas ikut menghapus komentarnya |
| B11 | Request dengan field di luar ketentuan DTO, tipe data salah, atau `:id` bukan angka ditolak dengan 400 |

## 5. Alur Pengguna (Alur Pemakaian API)

| Langkah | Aksi | Endpoint |
|---|---|---|
| 1 | Daftarkan member | `POST /members` |
| 2 | Buat proyek | `POST /projects` |
| 3 | Tambahkan member ke proyek (misal sebagai manager) | `POST /project-members` |
| 4 | Buat tugas pada proyek | `POST /tasks` |
| 5 | Ubah status tugas saat dikerjakan | `PATCH /tasks/:id` |
| 6 | Member menulis komentar pada tugas | `POST /comments` |
| 7 | Simpan metadata file proyek | `POST /files` |
| 8 | Lihat ringkasan proyek (anggota, tugas, file) | `GET /projects/:id` |

## 6. Rancangan Database

Entitas: `projects`, `members`, `project_members`, `tasks`, `comments`, `files`. Diagram lengkap ada pada file ERD (`ERD_TeamFlow.png`).

| Relasi | Jenis | Keterangan |
|---|---|---|
| projects - members | Many-to-many | Melalui tabel penghubung `project_members` (punya kolom tambahan `role`, `joined_at`) |
| projects - tasks | One-to-many | `tasks.project_id` -> `projects.id` |
| tasks - comments | One-to-many | `comments.task_id` -> `tasks.id` |
| members - comments | One-to-many | `comments.member_id` -> `members.id` |
| projects - files | One-to-many | `files.project_id` -> `projects.id` |
| members - files | One-to-many | `files.member_id` -> `members.id` (pengunggah) |

Semua foreign key memakai `ON DELETE CASCADE`.
