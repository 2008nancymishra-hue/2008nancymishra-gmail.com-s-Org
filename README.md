# Smart Waste Management System (Clean City, Green City)

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Civic Tech](https://img.shields.io/badge/CivicTech-SmartCity-2E7D32.svg)]()

> Modern, production-grade civic-tech platform for automated municipal waste management, geotagged roadside hazard reporting, on-demand doorstep recyclables pickup, and real-time sanitation fleet surveillance.

---

## 🌟 Key Problems Solved

1. **Overflowing Community Garbage Bins**: Citizens can submit geotagged photos with live coordinates.
2. **Roadside Litter & Construction Debris**: Automatic priority escalation (`Critical`, `High`) for street hazards.
3. **Missed Municipal Collections**: Real-time reporting triggers dynamic backup vehicle routing.
4. **Illegal Toxic & Commercial Dumping**: Immediate dispatch of enforcement and sanitation squads.
5. **Improper Waste Segregation**: Color-coded guides (Wet, Dry, E-Waste, Hazardous) and Eco-Karma citizen rebates.
6. **Difficulty Tracking Complaint Status**: 5-stage real-time progress timeline from lodging to photographic resolution proof.

---

## 👥 Three Integrated User Personas

### 1. Citizen Mobile PWA (Resident: Rahul Sharma)
- **Splash & 3-Step Onboarding**: Guided introduction to reporting, pickups, and segregation.
- **Civic Dashboard**: Live Eco-Karma score, cleanliness metrics, and quick actions.
- **Geotagged Incident Reporting**: Interactive map with relocatable pin, photo evidence capture, and address auto-detection.
- **Real-Time Visual Tracking**: Step-by-step resolution timeline with assigned driver contact details.
- **Doorstep Pickup Scheduler**: On-demand booking for dry recyclables, plastic bulk, and hazardous e-waste.
- **Awareness Masterclass**: Interactive segregation guides with practical Do’s and Don’ts.

### 2. Waste Collector Mobile App (Driver: Vikram Singh)
- **Fleet Driver Dashboard**: Vehicle registration badge (`DL-01-WM-4821`) and operational status.
- **Assigned Route Tasks**: Prioritized list of active complaints and doorstep pickup orders.
- **Turn-by-Turn GPS Navigation**: One-click routing to citizen location.
- **Proof-of-Work Verification**: Before/after photo capture to mark incidents as resolved.

### 3. Admin Surveillance Control Room (Sanitation Authority)
- **Executive Analytics**: KPI summary cards and dynamic charts for category breakdown, weekly resolution trends, and zone efficiency.
- **Geospatial Hotspot Surveillance Map**: Color-coded danger zones (Red: High hazard, Orange: Medium, Green: Controlled) with instant rapid patrol dispatch.
- **Queue Management**: Filter, reassign, update status, or reject duplicate complaints.
- **Doorstep Pickup Dispatch**: Assign compactor trucks and specialized e-waste vans.
- **Awareness CMS**: In-app publishing system to add, edit, or curate citizen educational manuals.

---

## 🛠️ Architecture & Tech Stack

```
smart-waste-management-system/
├── server.ts                       # Express.js backend & REST API engine
├── package.json                    # Dependencies & full-stack scripts
├── index.html                      # HTML5 entry point
├── src/
│   ├── App.tsx                     # Master persona router & shell
│   ├── types.ts                    # TypeScript domain definitions
│   ├── context/
│   │   └── WasteManagementContext  # Global state & API sync layer
│   ├── services/
│   │   └── api.ts                  # Typed client HTTP service
│   ├── components/
│   │   ├── citizen/                # Citizen mobile PWA views
│   │   ├── collector/              # Driver dashboard & proof upload
│   │   ├── admin/                  # Web dashboard & surveillance map
│   │   └── common/                 # Device frame, header, toast & GitHub hub
│   └── data/
│       └── mockData.ts             # Initial civic database records
```

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Vite 8.
- **Backend**: Express.js 4, RESTful JSON API, In-memory persistent database.
- **Deployment**: Google Cloud Run, Node.js 22 LTS, Docker compatible.

---

## 🚀 Getting Started

### Prerequisites
- Node.js $\ge 18.0.0$
- npm $\ge 9.0.0$

### 1. Clone the repository
```bash
git clone https://github.com/2008nancymishra/smart-waste-management-system.git
cd smart-waste-management-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the full-stack server
```bash
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server uptime & status check |
| `GET` | `/api/stats` | Executive KPI analytics & category breakdown |
| `GET` | `/api/complaints` | Filter and list citizen waste complaints |
| `POST` | `/api/complaints` | Lodge new complaint with geotag and photo |
| `PATCH` | `/api/complaints/:id/status`| Update status & attach resolution proof |
| `POST` | `/api/complaints/:id/assign`| Assign driver/vehicle to complaint |
| `GET` | `/api/pickups` | List doorstep waste pickup requests |
| `POST` | `/api/pickups` | Schedule new doorstep pickup |
| `PATCH` | `/api/pickups/:id/status` | Update pickup progress |
| `POST` | `/api/pickups/:id/assign` | Allocate van to pickup request |
| `GET` | `/api/collectors` | List sanitation crews & vehicle roster |
| `GET` | `/api/hotspots` | Fetch geospatial complaint hotspot data |
| `POST` | `/api/hotspots/:id/dispatch`| Trigger rapid sanitation squad dispatch |
| `GET` | `/api/awareness` | List educational articles and segregation guides |
| `POST` | `/api/awareness` | Publish new awareness guide |
| `POST` | `/api/reset` | Reset database to initial seed data |

---

## 🐳 Docker Deployment

Build and run using Docker:

```bash
docker build -t smart-waste-app .
docker run -p 3000:3000 smart-waste-app
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

*“Clean City, Green City” — Built for cleaner, healthier urban communities.*
