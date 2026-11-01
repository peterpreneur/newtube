import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/inline-script";
import { PhonePreview } from "@/components/phone-preview";
import { PHONE_PREVIEW_INIT_SCRIPT } from "@/lib/phone-preview";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
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
  title: {
    default: "CarTube",
    template: "%s · CarTube",
  },
  description: "Watch, upload, and share car videos on CarTube.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The head scripts set data-theme and data-device before hydration.
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={THEME_INIT_SCRIPT} />
        <InlineScript html={PHONE_PREVIEW_INIT_SCRIPT} />
      </head>
      <body className="min-h-full flex flex-col">
        <PhonePreview>{children}</PhonePreview>
      </body>
    </html>
  );
}
