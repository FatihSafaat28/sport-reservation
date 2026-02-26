# 🏀 Mabarin — Sport Reservation Platform

**Mabarin** is a sport activity reservation web application where users can discover, book, and join sport events near them. Hosts can create and manage their own events, while admins oversee the entire platform. Built as a final project for the Dibimbing Front-End Bootcamp.

> _"Bingung Olahraga? Mabarin aja!"_

---

## ✨ Features

### 🏠 Homepage

- Hero section with call-to-action
- Upcoming events showcase
- "How It Works" step-by-step guide (Find → Book & Pay → Join & Play)

### 🔍 Explore

- Browse all sport activities with **client-side pagination** (12 items desktop, 6 mobile)
- **Advanced filters**: search by keyword, sport category, province, and city
- Responsive filter layout with category badges
- Mobile-friendly collapsible filter panel
- Event status indicators (Ended / Fully Booked)

### 📄 Activity Detail

- Detailed activity information (date, time, location, price, organizer)
- Participant list with pagination (6 per page)
- Booking dialog for authenticated users
- Map link integration

### 👤 User Profile

- View and edit personal information (name, phone number)
- Change password with confirmation validation
- Skeleton loading states for better UX

### 💳 Transactions

- View all personal transactions with status badges (Pending, Proof Checking, Success, Cancelled)
- Transaction detail page with activity snapshot
- Upload proof of payment via URL
- Auto-cancel expired pending transactions
- Conditional expiration info display based on status
- Skeleton loading states

### 🔐 User Authentication

- User registration with password confirmation validation
- User login with token-based auth (`sessionStorage`)
- Protected routes — logged-in users are redirected away from auth pages

---

### 🎯 Host Panel

Hosts have their own dedicated section for managing sport events.

#### 🔑 Host Authentication

- Separate host registration and login
- Password confirmation validation

#### 📋 My Events

- View all events created by the host with active/ended status
- **Pending transaction notifications** — each event card shows the number of pending transactions awaiting review
- Create new sport events with full details (title, description, date, time, location, price, slots, category)
- Pagination for event list (10 items per page) with active events sorted first

#### 📝 Event Detail (Host)

- Full event information overview
- **User/Transaction list** — view all users who booked the event with their transaction status
- **Transaction dialog** — review individual transactions, view proof of payment, and approve/reject
- Edit event details
- Delete event with confirmation dialog

#### 👤 Host Profile

- View and edit host profile information

---

### 🛡️ Admin Panel

Full administrative control over the platform.

#### 🔑 Admin Authentication

- Secure admin login with email validation

#### 📊 Dashboard

- Key statistics overview (total events, transactions, users, etc.)

#### 🏃 Manage Activities

- View all sport activities across the platform
- Activity detail with full information
- **Category CRUD** — create, edit, and delete sport categories

#### 💰 Manage Transactions

- View all transactions across the platform
- Transaction detail view
- Update transaction statuses

---

## 🛠️ Tech Stack

| Technology       | Version | Purpose                      |
| ---------------- | ------- | ---------------------------- |
| **Next.js**      | 16.1.6  | React framework (App Router) |
| **React**        | 19.2.3  | UI library                   |
| **TypeScript**   | ^5      | Type safety                  |
| **Tailwind CSS** | v4      | Utility-first styling        |
| **ESLint**       | ^9      | Code linting                 |

---

## 📁 Project Structure

```
sport-reservation/
├── app/
│   ├── authentication/
│   │   ├── layout.tsx              # Auth layout (redirects logged-in users)
│   │   ├── login/page.tsx          # User login page
│   │   └── register/page.tsx       # User register page
│   ├── components/
│   │   ├── navbar.tsx              # Global navigation bar
│   │   ├── footer.tsx              # Global footer
│   │   ├── layout-wrapper.tsx      # Navbar + Footer wrapper
│   │   └── event-card-items.tsx    # Reusable event card component
│   ├── explore/
│   │   ├── page.tsx                # Explore page with filters & pagination
│   │   └── [slug]/
│   │       ├── page.tsx            # Activity detail (Server Component)
│   │       └── _components/
│   │           ├── BookingDialog.tsx
│   │           └── ParticipantsList.tsx
│   ├── profile/
│   │   ├── page.tsx                # User profile settings
│   │   └── transaction/
│   │       ├── page.tsx            # Transaction list
│   │       └── [slug]/page.tsx     # Transaction detail
│   ├── host/
│   │   ├── authentication/
│   │   │   ├── login/page.tsx      # Host login page
│   │   │   └── register/page.tsx   # Host registration page
│   │   ├── myevents/
│   │   │   ├── page.tsx            # My Events list (with pending tx counts)
│   │   │   ├── create/page.tsx     # Create new event
│   │   │   └── [slug]/
│   │   │       ├── page.tsx        # Event detail (host view)
│   │   │       ├── EditEventDialog.tsx
│   │   │       └── TransactionDialog.tsx
│   │   └── profile/page.tsx        # Host profile
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout
│   │   ├── authentication/         # Admin login
│   │   ├── components/             # Admin-specific components
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── manageactivity/
│   │   │   ├── page.tsx            # Manage all activities & categories
│   │   │   └── [slug]/page.tsx     # Activity detail (admin view)
│   │   └── managetransaction/
│   │       ├── page.tsx            # Manage all transactions
│   │       └── [slug]/page.tsx     # Transaction detail (admin view)
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Homepage
│   ├── upcoming-event.tsx          # Upcoming events section
│   └── globals.css                 # Global styles
├── lib/
│   ├── config.ts                   # API base URL config
│   └── interface/                  # TypeScript interfaces
│       ├── user.ts
│       ├── sportactivity.ts
│       ├── sportcategory.ts
│       ├── transactiondetail.ts
│       ├── paymentmethod.ts
│       ├── province.ts
│       └── city.ts
├── public/                         # Static assets
├── .env                            # Environment variables
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/FatihSafaat28/sport-reservation.git
   cd sport-reservation
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   NEXT_PUBLIC_BASE_URL=https://sport-reservation-api-bootcamp.do.dibimbing.id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build for production         |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

---

## 🔗 API Integration

The app connects to a REST API at the base URL defined in `.env`. Key endpoints used:

### User Endpoints

| Endpoint                  | Method | Description         |
| ------------------------- | ------ | ------------------- |
| `/api/v1/login`           | POST   | User login          |
| `/api/v1/register`        | POST   | User registration   |
| `/api/v1/me`              | GET    | Fetch current user  |
| `/api/v1/update-user/:id` | POST   | Update user profile |
| `/api/v1/logout`          | GET    | User logout         |

### Activity Endpoints

| Endpoint                              | Method | Description                            |
| ------------------------------------- | ------ | -------------------------------------- |
| `/api/v1/sport-activities`            | GET    | Fetch all sport activities (paginated) |
| `/api/v1/sport-activities/:id`        | GET    | Fetch activity detail                  |
| `/api/v1/sport-activities/create`     | POST   | Create a new sport activity            |
| `/api/v1/sport-activities/update/:id` | POST   | Update a sport activity                |
| `/api/v1/sport-activities/delete/:id` | DELETE | Delete a sport activity                |
| `/api/v1/sport-categories`            | GET    | Fetch all sport categories             |

### Location Endpoints

| Endpoint                              | Method | Description              |
| ------------------------------------- | ------ | ------------------------ |
| `/api/v1/location/provinces`          | GET    | Fetch all provinces      |
| `/api/v1/location/cities/:provinceId` | GET    | Fetch cities by province |

### Transaction Endpoints

| Endpoint                                       | Method | Description               |
| ---------------------------------------------- | ------ | ------------------------- |
| `/api/v1/my-transaction`                       | GET    | Fetch user transactions   |
| `/api/v1/all-transaction`                      | GET    | Fetch all transactions    |
| `/api/v1/transaction/:id`                      | GET    | Fetch transaction detail  |
| `/api/v1/transaction/update-proof-payment/:id` | POST   | Upload proof of payment   |
| `/api/v1/transaction/update-status/:id`        | POST   | Update transaction status |

### Payment Endpoints

| Endpoint                  | Method | Description           |
| ------------------------- | ------ | --------------------- |
| `/api/v1/payment-methods` | GET    | Fetch payment methods |

---

## 👨‍💻 Author

**Fatih Safaat** — Dibimbing Front-End Bootcamp
