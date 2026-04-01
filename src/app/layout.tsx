'use client'

import { Suspense, type ReactNode } from 'react'
import { Providers } from '@/filters/Providers'
import { MockProvider } from '@/mocks/MockProvider'

// ここで発生した例外はglobal-error.tsxでしかキャッチできない。
// そして、global-error.tsxはdevモードでは実行されない。
// よって極力エラーが発生しない処理しか実行してはいけない。
// たとえば、<html><body></body></html>と、各種ライブラリのプロバイダーなどが該当する。
// 逆に、通信が発生する処理は絶対呼び出さない事。
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <MockProvider>
          <Providers>
            <Suspense>
              {children}
            </Suspense>
          </Providers>
        </MockProvider>
      </body>
    </html>
  )
}