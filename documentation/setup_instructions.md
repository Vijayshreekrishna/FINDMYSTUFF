# Setup Instructions

## 1. Google OAuth Credentials

1.  Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2.  **Select/Create Project**:
    *   Select your project or create a new one.
3.  **Configure Consent Screen** (if not done):
    *   **APIs & Services** > **OAuth consent screen**.
    *   Ensure it's set to **External** (or Internal if you have a Workspace).
4.  **Create Credentials**:
    *   **APIs & Services** > **Credentials**.
    *   **+ CREATE CREDENTIALS** > **OAuth client ID**.
    *   **Application type**: **Web application**.
    *   **Authorized JavaScript origins**: `http://localhost:3000`
    *   **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
    *   Click **Create**.
5.  **Copy Keys**:
    *   Copy **Client ID** and **Client Secret** to `.env.local`.

## 2. Cloudinary Setup (Existing Account)

1.  **Log in** to your **[Cloudinary Console](https://console.cloudinary.com/)**.
2.  **Find Your Cloud Name**:
    *   Look at the **Dashboard** (the main landing page).
    *   In the top-left "Product Environment Credentials" box, copy the **Cloud Name**.
    *   Paste it into `.env.local` as `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3.  **Create/Find Upload Preset**:
    *   Click the **Settings** icon (gear ⚙️) in the bottom-left sidebar.
    *   Click **Upload** in the left sidebar menu.
    *   Scroll down to the **Upload presets** section.
    *   **Check for existing**: If you see a preset with **Mode: Unsigned**, you can use that name.
    *   **Create new (Recommended)**:
        *   Click **Add upload preset**.
        *   **Name**: `findmystuff_preset` (or similar).
        *   **Signing Mode**: Select **Unsigned** (Crucial!).
        *   Click **Save**.
    *   Copy the **Name** of the preset (e.g., `findmystuff_preset`).
    *   Paste it into `.env.local` as `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

### Example .env.local
```env
MONGODB_URI=mongodb://localhost:27017/findmystuff
NEXTAUTH_SECRET=supersecretkey
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name
```
