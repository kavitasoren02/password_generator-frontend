# Password Vault Frontend

A secure password manager built with Next.js, TypeScript, and client-side encryption.

## Features

- **Password Generator**: Generate strong passwords with customizable options
- **Secure Vault**: Store passwords with client-side AES-256 encryption
- **Search & Filter**: Quickly find saved passwords
- **Pagination**: Efficiently browse large password collections
- **Copy to Clipboard**: Auto-clearing clipboard after 15 seconds
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Encryption**: CryptoJS (AES-256 + PBKDF2)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Home/redirect page
│   ├── login/page.tsx        # Login page
│   ├── register/page.tsx     # Registration page
│   ├── vault/page.tsx        # Vault management page
│   ├── generator/page.tsx    # Password generator page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── PasswordGenerator.tsx # Password generator component
│   ├── VaultItemCard.tsx     # Vault item display card
│   ├── ThemeToggle.tsx       # Button to change dark to light and light to dark mode
│   └── VaultItemModal.tsx    # Add/edit vault item modal
├── hooks/
│   ├── useTheme.ts           # Manage state for theme i.e. dark or light mode
│   └── useAuth.ts            # Authentication hook
├── lib/
│   ├── api.ts                # Axios instance with interceptors
│   ├── auth.ts               # Authentication service
│   ├── crypto.ts             # Encryption/decryption utilities
│   ├── vault.ts              # Vault API service
│   └── passwordGenerator.ts  # Password generation logic
└── package.json
```

## Security

This application implements **client-side encryption** using AES-256. See [NOTES.md](./NOTES.md) for detailed information about the encryption implementation.

### Key Security Features:
- Passwords are encrypted before leaving the browser
- Server never sees plaintext passwords
- Master key derived from user credentials using PBKDF2
- Zero-knowledge architecture

## Usage

### 1. Register/Login
Create an account or login with your credentials.

### 2. Generate Passwords
- Navigate to the Generator page
- Customize length (8-64 characters)
- Select character types (uppercase, lowercase, numbers, symbols)
- Optionally exclude look-alike characters
- Click "Generate Password"

### 3. Save to Vault
- Click "Add New Item" in the Vault
- Fill in title, username, password, URL, and notes
- Use the built-in generator or enter your own password
- Click "Save Item"

### 4. Manage Vault Items
- **View**: Click "Show" to reveal passwords
- **Copy**: Click "Copy" to copy username or password (auto-clears in 15s)
- **Edit**: Click "Edit" to modify an item
- **Delete**: Click "Delete" to remove an item
- **Search**: Use the search bar to filter items

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (required)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
