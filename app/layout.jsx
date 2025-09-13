export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
     <html lang="en">
      <head>
         <meta name="api-base" content="https://api.yourdomain.com" />
       </head>
       <body className="min-h-screen bg-black text-white">{children}</body>
     </html>
   );
 }
