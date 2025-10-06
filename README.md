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
\`\`\`bash
npm install
\`\`\`

2. Create a \`.env.local\` file:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

3. Update the API URL in \`.env.local\`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

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


# Client-Side Encryption Implementation

## Overview

This application implements **client-side encryption** to ensure that passwords are encrypted before being sent to the server. The server never has access to plaintext passwords.

## Encryption Library

**CryptoJS** - A JavaScript library for cryptographic operations.

## Encryption Method

### AES (Advanced Encryption Standard)
- **Algorithm**: AES-256
- **Mode**: CBC (Cipher Block Chaining) with PKCS7 padding
- **Key Derivation**: PBKDF2 (Password-Based Key Derivation Function 2)

## How It Works

### 1. Master Key Generation
When a user logs in, a master encryption key is generated using:
- **Input**: User's email + User's ID
- **Algorithm**: PBKDF2
- **Iterations**: 10,000
- **Key Size**: 256 bits

```typescript
const masterKey = CryptoJS.PBKDF2(email, userId, {
  keySize: 256 / 32,
  iterations: 10000,
}).toString()
```

### 2. Password Encryption (Before Saving)
When a user saves a vault item:
1. The plaintext password is encrypted using AES with the master key
2. Only the encrypted password is sent to the server
3. The server stores the encrypted blob in MongoDB

```typescript
const encryptedPassword = CryptoJS.AES.encrypt(plaintext, masterKey).toString()
```

### 3. Password Decryption (When Viewing)
When a user views a vault item:
1. The encrypted password is retrieved from the server
2. It's decrypted client-side using the master key
3. The plaintext is displayed only when the user clicks "Show"

```typescript
const decryptedPassword = CryptoJS.AES.decrypt(encrypted, masterKey).toString(CryptoJS.enc.Utf8)
```

## Security Features

### 1. Zero-Knowledge Architecture
- The server **never** sees plaintext passwords
- All encryption/decryption happens in the browser
- Master key is derived from user credentials and never stored

### 2. Key Derivation
- Uses PBKDF2 with 10,000 iterations to slow down brute-force attacks
- Combines user email and ID as salt for uniqueness

### 3. Network Security
- Only encrypted data is transmitted over the network
- Even if network traffic is intercepted, passwords remain secure

### 4. Database Security
- MongoDB stores only encrypted blobs
- Database compromise does not expose plaintext passwords
- Each user's data is encrypted with their unique master key

## Verification

You can verify encryption by:

1. **Network Tab**: Inspect API requests - you'll see encrypted strings like:
   ```
   "encryptedPassword": "U2FsdGVkX1+abc123..."
   ```

2. **Database**: Check MongoDB documents - passwords are stored as encrypted strings:
   ```json
   {
     "encryptedPassword": "U2FsdGVkX1+xyz789...",
     "username": "user@example.com"
   }
   ```

3. **Browser Console**: The master key is generated but never sent to the server

## Why CryptoJS?

1. **Mature & Battle-Tested**: Used by millions of developers
2. **Browser-Native**: Works directly in the browser without server-side dependencies
3. **AES-256**: Industry-standard encryption algorithm
4. **PBKDF2**: Recommended key derivation function
5. **Easy Integration**: Simple API for encryption/decryption

## Limitations & Considerations

1. **Master Key Security**: The master key is derived from user credentials. If a user's account is compromised, their vault is accessible.
2. **Browser Storage**: The master key exists in memory during the session. Use HTTPS to prevent man-in-the-middle attacks.
3. **No Password Recovery**: Since encryption is client-side, forgotten passwords cannot be recovered (by design).

## Future Enhancements

- **2FA**: Add two-factor authentication for additional security
- **Biometric Auth**: Use WebAuthn for passwordless authentication
- **Key Rotation**: Implement periodic master key rotation
- **Encrypted Export**: Allow users to export encrypted vault backups
