import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Neural Networks Frontend",
  description: "Interactive neural net visualizer with SSE + charts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Provide a fallback meta tag (still optional) */}
        <meta name="api-base" content={process.env.NEXT_PUBLIC_API_BASE_URL} />
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {/* This script runs before any client JS and defines the API base */}
        <Script id="api-base-script" strategy="beforeInteractive">
          {`window.__API_BASE__ = "${process.env.NEXT_PUBLIC_API_BASE_URL}";`}
        </Script>
        {children}
      </body>
    </html>
  );
}
