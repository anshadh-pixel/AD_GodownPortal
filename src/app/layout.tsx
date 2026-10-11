import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AD GODOWN PORTAL | Stock Viewer",
  description: "High performance godown stock viewer with instant search, low stock alerts, and Google Sheets integration.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AD GODOWN PORTAL"
  }
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('godown_stock_theme') || 'dark';
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch(e) {}

                // Block pinch zoom & double-tap zoom on touchscreens
                document.addEventListener('touchstart', function(e) {
                  if (e.touches && e.touches.length > 1) {
                    e.preventDefault();
                  }
                }, { passive: false });

                var lastTap = 0;
                document.addEventListener('touchend', function(e) {
                  var currentTime = new Date().getTime();
                  var tapLength = currentTime - lastTap;
                  if (tapLength < 350 && tapLength > 0) {
                    e.preventDefault();
                  }
                  lastTap = currentTime;
                }, { passive: false });

                document.addEventListener('gesturestart', function(e) {
                  e.preventDefault();
                });
                document.addEventListener('gesturechange', function(e) {
                  e.preventDefault();
                });
                document.addEventListener('gestureend', function(e) {
                  e.preventDefault();
                });
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
