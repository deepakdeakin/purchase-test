# Purchase Team – Junior Developer Technical Test

## Stack
- **Backend:** C# / .NET (original target **.NET 8**, works with .NET 9 if retargeted)
- **Frontend:** React 18 + TypeScript + Vite
- **Tests:** xUnit (API), Vitest + React Testing Library (UI)
- **SQL:** PostgreSQL / SQL Server style queries

---

## Project Structure
```
purchase-test/
├── api/                     # .NET Minimal API
│   ├── Program.cs
│   ├── Models.cs
│   ├── Mapping.cs
│   └── purchase-test.api.csproj
├── api.tests/               # xUnit tests
│   ├── NormalizePropertyTests.cs
│   └── api.tests.csproj
├── ui/                      # React + TypeScript (Vite)
│   ├── index.html
│   ├── src/
│   │   ├── components/PropertyCard.tsx
│   │   ├── components/Modal.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── types.ts
│   ├── src/__tests__/PropertyCard.test.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── sql/
    └── reporting.sql
```

---

## How to Run

### API
> Requires .NET 8 SDK (or retarget project files to `net9.0` if you only have .NET 9).

```bash
cd api
dotnet restore
dotnet run
```

- Endpoint: `POST /api/property/normalize`
- Example:
```bash
curl -s http://localhost:5000/api/property/normalize   -H "Content-Type: application/json"   -d '{
    "provider":"VIC-DDP",
    "requestId":"REQ-12345",
    "receivedAt":"2025-08-30T03:12:45Z",
    "formattedAddress":"10 Example St, Carlton VIC 3053",
    "addressParts":{"street":"10 Example St","suburb":"Carlton","state":"VIC","postcode":"3053"},
    "lotPlan":{"lot":"12","plan":"PS123456"},
    "title":{"volume":"","folio":""}
  }'
```

### UI
```bash
cd ui
npm install
npm run dev
# open http://localhost:5173
```

---

## Tests

### API
```bash
cd api.tests
dotnet test
```

### UI
```bash
cd ui
npm test
```

---

## SQL
See [`sql/reporting.sql`](sql/reporting.sql).

- **Query A** → count of certificates per matter (last 30 days).
- **Query B** → matters with *no* Title certificate (last 30 days).
- **Index Proposal**  
  ```sql
  CREATE INDEX idx_cert_type_created_order
    ON certificates(type, created_at, order_id);
  ```
  *Rationale: speeds up filtering by `type` + `created_at` while still covering `order_id` joins.*

---

## Assumptions
- `KnownVolFol` requires both values present. Missing/empty = `UnknownVolFol`.
- Address built from parts when `formattedAddress` missing.
- UI validation uses regex + inline errors. Modal accessible (focus trap + ESC).

---

## Time Spent
- API + mapping: ~60 min  
- Tests (API): ~25 min  
- UI + tests: ~70 min  
- SQL + README: ~25 min  

---

## AI Assistance
- GitHub Copilot / AI assistant used for small snippets (regex, TS typing, test boilerplate).  
- Verified correctness with xUnit + Vitest and manual runs.

---
