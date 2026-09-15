import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Looking-Back-OCR",
  description: "Web app for OCR with OpenRouter API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased bg-slate-950 text-slate-200" suppressHydrationWarning>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                  processEscapes: true,
                },
                svg: {
                  fontCache: 'global'
                }
              };
            `,
          }}
        />
        <script
          type="text/javascript"
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        />
      </body>
    </html>
  );
}
