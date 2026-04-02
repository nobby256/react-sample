以下は、**PermissionProvider / PermissionGate / useHasActionPermission の使い方を、チーム向けの読み物としてまとめたもの**です。

***

# PermissionProvider / PermissionGate の使い方

権限は **BFF で判定、フロントでは「表示制御」にだけ使う** 方針です。  
この前提で、フロント側の設計を以下の 3 レイヤーに分けます。

- PermissionProvider … 権限データの取得と共有
- PermissionGate … 画面（ルート）単位の表示制御
- useHasActionPermission … ボタンなどアクション単位の表示制御

## 1. Provider の仕込み方

### 1-1. UI 権限 API

BFF から「画面とアクションの権限一覧」を取得する API を用意します。

```ts
// src/features/permission/api/fetchUiPermissions.ts
import { ofetch } from 'ofetch'
import type { UiPermissions } from '../model/UiPermissions'

export async function fetchUiPermissions(): Promise<UiPermissions> {
  return ofetch<UiPermissions>('/api/ui-permissions', {
    method: 'GET',
    credentials: 'include',
  })
}
```

`/api/ui-permissions` のレスポンス例:

```json
{
  "screens": ["top", "detail.view", "report.list"],
  "actions": ["detail.update", "detail.delete", "report.export"]
}
```

### 1-2. Context と Provider

TanStack Query で権限を取得し、Context でアプリ全体に配ります。

```tsx
// src/features/permission/model/UiPermissions.ts
export type UiPermissions = {
  screens: string[]
  actions: string[]
}
```

```tsx
// src/features/permission/providers/PermissionProvider.tsx
'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { UiPermissions } from '../model/UiPermissions'
import { fetchUiPermissions } from '../api/fetchUiPermissions'

type PermissionContextValue = {
  isLoading: boolean
  screens: string[]
  actions: string[]
  hasScreen: (screen: string) => boolean
  hasAction: (action: string) => boolean
}

const PermissionContext = createContext<PermissionContextValue | null>(null)

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = useQuery<UiPermissions>({
    queryKey: ['ui-permissions'],
    queryFn: fetchUiPermissions,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  })

  const value = useMemo<PermissionContextValue>(() => {
    const screens = data?.screens ?? []
    const actions = data?.actions ?? []

    return {
      isLoading: isPending,
      screens,
      actions,
      hasScreen: (screen: string) => screens.includes(screen),
      hasAction: (action: string) => actions.includes(action),
    }
  }, [data, isPending])

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider')
  }

  return context
}
```

### 1-3. layout.tsx への組み込み

PermissionProvider は **QueryClientProvider の内側**に置きます。  
通信を伴うためエラーが想定されます。  
その様なProviderはBaseLayoutに置いてください。  

```tsx
// src/app/(base)/layout.tsx
'use client'

import { AppBootstrapper } from '@/filters/AppBootstrapper'
import { PermissionProvider } from '@/features/permission'
import type { ReactNode } from 'react'

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionProvider>
      <AppBootstrapper>
        {children}
      </AppBootstrapper>
    </PermissionProvider>
  )
}
```

これで、アプリ全体から `usePermissions` / `PermissionGate` / `useHasActionPermission` が使える状態になります。

***

## 2. 画面側から見た使い方（画面権限）

### 2-1. AppError(403) を投げる PermissionGate

画面の表示権限チェックは、NG のとき **AppError(403)** を投げます。  
これにより、既存のエラー処理（例: error.tsx や global-error.tsx）と連携しやすくなります。

```ts
// src/errors/AppError.ts
export class AppError extends Error {
  readonly status: number

  constructor(status: number, message?: string) {
    super(message ?? `AppError: ${status}`)
    this.name = 'AppError'
    this.status = status
  }
}
```

```tsx
// src/features/permission/components/PermissionGate.tsx
'use client'

import type { ReactNode } from 'react'
import { AppError } from '@/errors/AppError'
import { usePermissions } from '../providers/PermissionProvider'

type PermissionGateProps = {
  screen: string
  children: ReactNode
}

export function PermissionGate({ screen, children }: PermissionGateProps) {
  const { isLoading, hasScreen } = usePermissions()

  // 権限情報がまだ無い間は何も出さない（ローディングは親が担当してもよい）
  if (isLoading) {
    return null
  }

  if (!hasScreen(screen)) {
    throw new AppError(403, 'Forbidden')
  }

  return <>{children}</>
}
```

### 2-2. 画面での使い方

画面コンポーネント側からは、**「この画面を見るにはどの screen 権限が必要か」** を指定します。

```tsx
// src/app/report/page.tsx
'use client'

import { PermissionGate } from '@/features/permission/components/PermissionGate'
import { ReportPageContent } from '@/features/report/components/ReportPageContent'

export default function ReportPage() {
  return (
    <PermissionGate screen="report.list">
      <ReportPageContent />
    </PermissionGate>
  )
}
```

このとき:

- `screens` に `"report.list"` が含まれていればページを表示
- 含まれていなければ `AppError(403)` を throw → エラー境界で 403 画面に誘導

という挙動になります。

***

## 3. 利用者から見た使い方（アクション権限）

画面全体ではなく、**ボタンやメニュー項目だけを制御したい** 場合は、boolean を返す hook を使った方が書きやすいです。

### 3-1. boolean を返す hook

```ts
// src/features/permission/hooks/useHasActionPermission.ts
'use client'

import { usePermissions } from '../providers/PermissionProvider'

export function useHasActionPermission(action: string): boolean {
  const { isLoading, hasAction } = usePermissions()

  if (isLoading) {
    return false
  }

  return hasAction(action)
}
```

必要なら複数チェック版も用意できます。

```ts
// src/features/permission/hooks/useHasActionPermissions.ts
'use client'

import { usePermissions } from '../providers/PermissionProvider'

type CheckMode = 'all' | 'some'

export function useHasActionPermissions(
  requiredActions: string[],
  mode: CheckMode = 'all',
): boolean {
  const { isLoading, actions } = usePermissions()

  if (isLoading) {
    return false
  }

  if (requiredActions.length === 0) {
    return true
  }

  if (mode === 'all') {
    return requiredActions.every((a) => actions.includes(a))
  }

  return requiredActions.some((a) => actions.includes(a))
}
```

### 3-2. ボタンでの使い方

```tsx
// src/features/report/components/ReportToolbar.tsx
'use client'

import { useHasActionPermission } from '@/features/permission/hooks/useHasActionPermission'

export function ReportToolbar() {
  const canExport = useHasActionPermission('report.export')

  return (
    <div>
      {canExport && (
        <button type="button">
          CSV出力
        </button>
      )}
    </div>
  )
}
```

あるいは **disabled 制御**にも使えます。

```tsx
const canUpdate = useHasActionPermission('detail.update')

<button type="button" disabled={!canUpdate}>
  更新
</button>
```

これで、

- 画面自体に入れるかどうか → PermissionGate（403 を投げる）
- 画面に入れた後の細かい操作可否 → useHasActionPermission（true / false）

と、使い分けできます。

***

## 4. 役割まとめ

利用者目線での「どこで何をするか」は次の通りです。

- **PermissionProvider**
  - どこで権限を取るか
  - → アプリ起動時に `/api/ui-permissions` を 1 回取得し、Context で配る
- **PermissionGate（画面）**
  - 何に使うか
  - → ページコンポーネントを包んで、screen 権限がなければ `AppError(403)` を投げる
- **useHasActionPermission（アクション）**
  - 何に使うか
  - → ボタンやメニューの表示／disabled を boolean で制御する

フロントでの判定はあくまで **UX のための表示制御** であり、**本当の権限チェックは BFF / API 側** という前提は変わりません。  
この設計にしておくと、画面側のコードは「この画面には何の権限が必要か」「このボタンには何の権限が必要か」だけを宣言的に書けばよくなります。