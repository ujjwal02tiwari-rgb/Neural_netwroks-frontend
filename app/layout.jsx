import "./globals.css";

export const metadata = {
  title: "Neural Net Studio",
  description: "Train, stream metrics, and test your CNN models",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
