import "./globals.css";

export const metadata = {
  title: "Neural Networks Frontend",
  description: "Interactive neural net visualizer with SSE + charts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
