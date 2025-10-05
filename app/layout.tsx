import type { Metadata } from "next";
import './globals.css'

export const metadata: Metadata = {
  title: "Password Vault - Secure Password Manager",
  description: "Generate and securely store your passwords",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
