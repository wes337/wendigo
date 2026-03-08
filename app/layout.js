import Theme from "@/app/theme";
import "./globals.css";

export const metadata = {
  title: "WENDIGO CORP",
  description: "The official Wendigo Corp website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/nci3lbg.css" />
      </head>
      <body className="antialiased">
        <Theme />
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none bg-[url('/backgrounds/little-knobs.png')] opacity-10 z-0" />
        <div className="relative flex flex-col min-h-dvh items-center justify-center font-sans z-1">
          {children}
        </div>
      </body>
    </html>
  );
}
