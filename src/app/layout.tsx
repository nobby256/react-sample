'use client'

import { memo, Suspense, type ReactNode } from 'react'
import { QueryProvider } from '@/shared/query'
import { MockProvider } from '@/mocks/MockProvider'

// ここで発生した例外はglobal-error.tsxでしかキャッチできない。
// そして、global-error.tsxはdevモードでは実行されない。
// よって極力エラーが発生しない処理しか実行してはいけない。
// たとえば、<html><body></body></html>と、各種ライブラリのプロバイダーなどが該当する。
// 逆に、通信が発生する処理は絶対呼び出さない事。
export default memo(function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Suspense>
          <MockProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </MockProvider>
        </Suspense>
      </body>
    </html>
  )
})