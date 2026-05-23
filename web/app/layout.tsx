import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberOS — Operating system за бръснари",
  description:
    "Платформа за бръснари: онлайн записване, график, услуги и клиенти на едно място.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
