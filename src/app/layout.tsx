import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MotionProvider } from '@/components/providers/motion-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OPTIC - 운송 운영을 한눈에',
  description:
    '오더부터 정산까지, 물류 주선 업무를 디지털화하는 통합 운송 관리 플랫폼',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'OPTIC - 운송 운영을 한눈에',
    description:
      '오더부터 정산까지, 물류 주선 업무를 디지털화하는 통합 운송 관리 플랫폼',
    url: 'https://optic.app',
    siteName: 'OPTIC',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OPTIC - 운송 운영을 한눈에',
    description:
      '오더부터 정산까지, 물류 주선 업무를 디지털화하는 통합 운송 관리 플랫폼',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
