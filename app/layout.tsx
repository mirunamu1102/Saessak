import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 클래스 학습 일지 | 미려",
  description: "AI를 배워가는 과정을 솔직하게 기록하는 공간이에요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
