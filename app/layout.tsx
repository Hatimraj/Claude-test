import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Viral Food Art Studio",
  description: "Generate viral 3D charcuterie images, validate the best one, then turn it into a video."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 md:px-8">{children}</main>
      </body>
    </html>
  );
}
