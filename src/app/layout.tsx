import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Conor Douglas | Full Stack Engineer',
  description:
    'Portfolio of Conor Douglas — Full Stack Engineer with industry experience at Magnite and a strong academic foundation from Queen\'s University Belfast. Specialising in React, Next.js, Node.js, and cloud platforms.',
  openGraph: {
    title: 'Conor Douglas | Full Stack Engineer',
    description:
      'Portfolio of Conor Douglas — Full Stack Engineer specialising in React, Next.js, Node.js, and cloud platforms.',
    url: 'https://conordouglas.dev',
    siteName: 'Conor Douglas Portfolio',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conor Douglas | Full Stack Engineer',
    description:
      'Portfolio of Conor Douglas — Full Stack Engineer specialising in React, Next.js, Node.js, and cloud platforms.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider>
          <SmoothScroll>
            <ScrollProgress />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
