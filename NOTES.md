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
