# 🏀 Mabarin — Sport Reservation Platform

**Mabarin** is a sport activity reservation web application where users can discover, book, and join sport events near them. Built as a final project for the Dibimbing Front-End Bootcamp.

> _"Bingung Olahraga? Mabarin aja!"_

---

## ✨ Features

### 🏠 Homepage

- Hero section with call-to-action
- Upcoming events showcase
- "How It Works" step-by-step guide (Find → Book & Pay → Join & Play)

### 🔍 Explore

- Browse all sport activities with **server-side pagination**
- **Advanced filters**: search by keyword, sport category, province, and city
- Responsive filter layout with category badges
- Mobile-friendly collapsible filter panel

### 📄 Activity Detail

- Detailed activity information (date, time, location, price, organizer)
- Participant list with pagination
- Booking dialog for authenticated users
- Map link integration

### 👤 Profile

- View and edit personal information (name, phone number)
- Change password
- Skeleton loading states for better UX

### 💳 Transactions

- View all personal transactions with status badges (Pending, Paid, Success)
- Transaction detail page with activity snapshot
- Upload proof of payment via URL
- Skeleton loading states

### 🔐 Authentication

- User registration
- User login with token-based auth (`sessionStorage`)
- Protected routes — logged-in users are redirected away from auth pages

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
│   │   ├── layout.tsx            # Auth layout (redirects logged-in users)
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Register page
│   ├── components/
│   │   ├── navbar.tsx            # Global navigation bar
│   │   ├── footer.tsx            # Global footer
│   │   ├── layout-wrapper.tsx    # Navbar + Footer wrapper
│   │   └── event-card-items.tsx  # Reusable event card component
│   ├── explore/
│   │   ├── page.tsx              # Explore page with filters & pagination
│   │   └── [slug]/
│   │       ├── page.tsx          # Activity detail (Server Component)
│   │       └── _components/
│   │           ├── BookingDialog.tsx
│   │           └── ParticipantsList.tsx
│   ├── profile/
│   │   ├── page.tsx              # Profile settings
│   │   └── transaction/
│   │       ├── page.tsx          # Transaction list
│   │       └── [slug]/page.tsx   # Transaction detail
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── upcoming-event.tsx        # Upcoming events section
│   └── globals.css               # Global styles
├── lib/
│   ├── config.ts                 # API base URL config
│   └── interface/                # TypeScript interfaces
│       ├── user.ts
│       ├── sportactivity.ts
│       ├── sportcategory.ts
│       ├── transactiondetail.ts
│       ├── paymentmethod.ts
│       ├── province.ts
│       └── city.ts
├── public/                       # Static assets
├── .env                          # Environment variables
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

| Endpoint                                       | Method | Description                            |
| ---------------------------------------------- | ------ | -------------------------------------- |
| `/api/v1/sport-activities`                     | GET    | Fetch all sport activities (paginated) |
| `/api/v1/sport-activities/:id`                 | GET    | Fetch activity detail                  |
| `/api/v1/sport-categories`                     | GET    | Fetch all sport categories             |
| `/api/v1/location/provinces`                   | GET    | Fetch all provinces                    |
| `/api/v1/location/cities/:provinceId`          | GET    | Fetch cities by province               |
| `/api/v1/login`                                | POST   | User login                             |
| `/api/v1/register`                             | POST   | User registration                      |
| `/api/v1/me`                                   | GET    | Fetch current user profile             |
| `/api/v1/update-user/:id`                      | POST   | Update user profile / password         |
| `/api/v1/my-transaction`                       | GET    | Fetch user transactions                |
| `/api/v1/transaction/:id`                      | GET    | Fetch transaction detail               |
| `/api/v1/transaction/update-proof-payment/:id` | POST   | Upload proof of payment                |
| `/api/v1/payment-methods`                      | GET    | Fetch payment methods                  |
| `/api/v1/logout`                               | GET    | User logout                            |

---

## 👨‍💻 Author

**Fatih Safaat** — Dibimbing Front-End Bootcamp
