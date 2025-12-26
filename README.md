# Tour Planner AI - Frontend

A modern Next.js-based travel planning application with AI-powered chat interface, authentication, and interactive map features.

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive chat with travel planning AI assistant
- **User Authentication**: Secure signup and signin functionality
- **Interactive Dashboard**: Personalized user dashboard with travel planning tools
- **Map Integration**: Dynamic map display with zoom controls for visualizing travel routes
- **Chat Persistence**: Chat history saved across browser sessions using localStorage
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS

## 📋 Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun package manager
- Backend API server running (default: `http://localhost:8000`)

Demo Images
<img width="1366" height="768" alt="tp-1" src="https://github.com/user-attachments/assets/cf475fa9-5c54-4ba5-a879-18786fbfc7c2" />
<img width="1366" height="721" alt="tp-2" src="https://github.com/user-attachments/assets/1f886cff-b4f0-45b8-8b3d-8a0fd2ea1009" />
<img width="1366" height="722" alt="tp-3" src="https://github.com/user-attachments/assets/20e08d8a-70c9-4cc9-9d34-aab6ac67cf6d" />
<img width="1366" height="720" alt="tp-4" src="https://github.com/user-attachments/assets/e9eea36c-46cf-4602-8090-faba3276f07f" />

## 🛠️ Getting Started

### 1. Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Environment Variables

**Required:**
- `NEXT_PUBLIC_API_URL`: The base URL for the backend API
  - Development: `http://localhost:8000`
  - Production: Update to your production API URL (e.g., `https://api.yourapp.com`)

**Optional:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key (for maps features)
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics tracking ID

> **Important Notes:**
> - Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
> - Never commit `.env.local` to version control (it's in `.gitignore`)
> - After changing environment variables, restart the development server

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
app/
├── app/
│   ├── auth/
│   │   ├── signin/      # Sign-in page
│   │   └── signup/      # Sign-up page
│   ├── dashboard/       # User dashboard
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page with chat interface
├── public/              # Static assets
├── .env.local          # Environment variables (create this)
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🔑 Key Features Explained

### Authentication System
- Secure user registration with password hashing
- Login functionality with session management
- Protected routes requiring authentication

### Chat Interface
- Real-time AI responses for travel planning
- Message history persistence using localStorage
- Support for text and map-based responses

### Map Integration
- Dynamic map generation from API responses
- Zoom controls (buttons, keyboard shortcuts, mouse scroll)
- Journey visualization with origin and destination markers

## 🏗️ Build for Production

```bash
npm run build
npm run start
```

## 🧹 Linting

```bash
npm run lint
```

## 🔧 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: React 19
- **Font**: [Geist](https://vercel.com/font) - optimized with `next/font`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to a Git repository
2. Import your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Other Platforms

This Next.js application can be deployed to any platform that supports Node.js:
- AWS
- Google Cloud Platform
- Azure
- DigitalOcean
- Railway
- Render

## 🐛 Troubleshooting

### API Connection Issues
- Ensure the backend server is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local` is correct
- Check browser console for network errors

### Environment Variables Not Working
- Restart the development server after changing `.env.local`
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access

### Build Errors
- Clear `.next` folder: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📝 Development Notes

- The page auto-updates as you edit files
- TypeScript is configured for strict type checking
- ESLint is configured for code quality
- Tailwind CSS v4 with PostCSS for styling

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ using Next.js**
