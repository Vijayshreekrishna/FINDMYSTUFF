# FindMyStuff - Lost & Found PWA

A premium Progressive Web App for reporting and finding lost items. Built with Next.js 14, MongoDB, and NextAuth.

## Features

- 📍 Report lost and found items with location
- 🗺️ Interactive maps using Leaflet
- 🔐 Secure Google OAuth authentication
- 📱 Progressive Web App (installable)
- 🖼️ Image uploads via Cloudinary
- 🔍 Real-time search and filtering
- 📊 Responsive design for all devices

## Tech Stack

- **Framework:** Next.js 16.0.3
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth with Google OAuth
- **Maps:** Leaflet / React-Leaflet
- **Image Upload:** Cloudinary
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Google OAuth credentials
- Cloudinary account (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/Vijayshreekrishna/FINDMYSTUFF.git

# Install dependencies
cd FINDMYSTUFF
npm install

# Set up environment variables
cp env_template.txt .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Environment Variables

See `env_template.txt` for required environment variables.

## Deployment

This app is optimized for deployment on Vercel. See `setup_instructions.md` for detailed deployment guide.

## License

MIT

## Author

Vijayshreekrishna
