# Navigation機能ガイド

このドキュメントは、プロジェクトで提供している navigation 機能の使い方をまとめたものです。`NavigationProvider` をアプリへ組み込み、`useAppRouter()` から `push`、`replace`、`back`、`canGoBack` を利用する構成を前提にしています。[1][2]

この navigation 機能は、ブラウザ全体の history 件数ではなく、このタブ内でのアプリ内遷移をもとに「戻れるか」を判定します。これにより、検索一覧から詳細へ移動したあとに `back()` で自然に戻しつつ、直アクセスや新規タブで開いた画面では戻るボタンを無効化しやすくなります。[3][4]

## 提供する機能

この機能がアプリへ提供する API は、`push`、`replace`、`back`、`canGoBack` の4つです。公開 API を最小限に絞ることで、画面側は特定の router 実装に依存しすぎず、将来ほかの router 実装へ移行しやすくなります。[2][5][6]

| 機能 | 用途 |
|---|---|
| `push(to, options?)` | 新しい履歴を積んで画面遷移します。[2] |
| `replace(to, options?)` | 現在の履歴を置き換えて画面遷移します。[2][7] |
| `back()` | 戻れる場合だけ 1 つ前の画面へ戻ります。[2][4] |
| `canGoBack` | アプリ内履歴に基づいて戻るボタンを有効化できるかを表します。[4][8] |

## 仕組み

`NavigationProvider` は `usePathname()` と `useSearchParams()` で現在の route を組み立て、`sessionStorage` に保持しているアプリ内履歴と突き合わせて stack を更新します。[9][10] `push` のときは履歴を追加し、`replace` のときは末尾を置き換え、ブラウザの戻る操作が起きたときは現在 route に合わせて stack を整合させる想定です。[2][7]

この方式により、`history.length` のようなブラウザ全体の履歴件数に頼らずに、アプリとして意味のある「戻れるかどうか」を扱えます。`history.length` は別サイトから来た履歴や別用途の履歴も含むため、アプリ内戻るの判定にはそのまま使いにくいです。[4][8]

## Providerの組み込み

`NavigationProvider` は、アプリ全体で利用できるようにルートレイアウトなどの上位で 1 回だけ仕込みます。React では Context Provider で共通機能を配布し、画面側は custom hook から利用する構成が保守しやすいです。[11][1]

```tsx
import { NavigationProvider } from '@/shared/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <NavigationProvider>{children}</NavigationProvider>
      </body>
    </html>
  )
}
```

## AppRouterの使い方

画面コンポーネントでは `next/navigation` の `useRouter()` を直接使わず、`useAppRouter()` を使います。これにより、戻る可否の判定や履歴管理のルールを画面側に漏らさず、ルーター差し替え時の影響範囲も抑えられます。[12][13]

```tsx
'use client'

import { useAppRouter } from '@/shared/navigation'

export function SearchActions() {
  const router = useAppRouter()

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push('/search?keyword=react&page=1')}
      >
        検索一覧へ
      </button>

      <button
        type="button"
        onClick={() =>
          router.replace('/search?keyword=react&page=1', {
            scroll: false,
          })
        }
      >
        URLを置換
      </button>

      <button type="button" onClick={router.back} disabled={!router.canGoBack}>
        戻る
      </button>
    </div>
  )
}
```

### pushを使う場面

通常の画面遷移には `push()` を使います。たとえば検索一覧から詳細画面へ進む場合や、一覧条件を保ったまま別画面へ進む場合は `push()` が自然です。[2]

```tsx
router.push('/detail/123?keyword=react&page=1')
```

### replaceを使う場面

戻る履歴として残したくない遷移には `replace()` を使います。たとえば URL 正規化、初期条件の付与、不要な中継画面の置き換えなどで有効です。[7][2]

```tsx
router.replace('/search?keyword=react&page=1', { scroll: false })
```

### backを使う場面

一覧から詳細へ移動し、その後に「当時の一覧状態へ戻したい」場合は `back()` が最も自然です。検索条件を URL に載せていれば、戻った時点の URL から一覧状態を再現しやすくなります。[4][10]

```tsx
if (router.canGoBack) {
  router.back()
}
```

## 戻るボタンの作り方

戻るボタン自体の見た目や配置はアプリのデザイン次第なので、UI コンポーネントとしては各アプリ側で作る想定です。実装上のポイントは、`canGoBack` を見て `disabled` を切り替えることと、押下時は `back()` を呼ぶことです。[4][8]

```tsx
'use client'

import { useAppRouter } from '@/shared/navigation'

type BackButtonProps = {
  label?: string
}

export function BackButton({ label = '戻る' }: BackButtonProps) {
  const router = useAppRouter()

  return (
    <button
      type="button"
      onClick={router.back}
      disabled={!router.canGoBack}
      aria-disabled={!router.canGoBack}
    >
      {label}
    </button>
  )
}
```

## Link相当のシンプルな作り方

標準の `<Link>` をそのまま使うと、アプリ独自の履歴ルールを通らない場面が出る可能性があるため、必要に応じて薄いラッパーを用意すると運用しやすくなります。見た目はアプリごとに変えられるようにして、遷移処理だけ `useAppRouter()` へ寄せる形が扱いやすいです。[14][12]

```tsx
'use client'

import { MouseEvent, ReactNode } from 'react'
import { useAppRouter } from '@/shared/navigation'

type AppLinkProps = {
  to: string
  children: ReactNode
  replace?: boolean
  className?: string
}

export function AppLink({
  to,
  children,
  replace = false,
  className,
}: AppLinkProps) {
  const router = useAppRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    if (replace) {
      router.replace(to)
      return
    }

    router.push(to)
  }

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
```

このサンプルは最小構成なので、実運用では Ctrl/Cmd + click、中央クリック、新規タブ、外部 URL 判定などを追加で考慮するとより実用的です。UI とアクセシビリティの要件に応じて調整してください。[14][11]

## 検索一覧から詳細へ戻る例

この navigation 機能が特に有効なのは、検索条件を URL に保持して一覧再現を行うケースです。たとえば検索一覧で `keyword` や `page` を query string に載せて詳細へ遷移すれば、詳細画面の戻るボタンから `back()` した時に、その時点の URL をもとに一覧を復元できます。[10][4]

```tsx
// 一覧画面
router.push('/detail/123?keyword=react&page=2')
```

```tsx
// 詳細画面
<button type="button" onClick={router.back} disabled={!router.canGoBack}>
  一覧に戻る
</button>
```

## 利用時のルール

この機能を正しく動かすには、プログラム的な画面遷移をなるべく `useAppRouter()` に統一するのが重要です。別の場所で `next/navigation` の生の `router.push()` や `router.replace()` を直接使うと、アプリ内履歴の整合が崩れる可能性があります。[2][7]

運用ルールとしては、次のように決めておくと分かりやすいです。

- 通常遷移は `push()` を使う。[2]
- 履歴として残したくない遷移だけ `replace()` を使う。[7]
- 戻る UI は `canGoBack` を見て活性・非活性を制御する。[4][8]
- 検索状態の再現は URL パラメータで行う。[10]

## export一覧

この機能は `index.ts` からまとめて import できる想定です。barrel file は便利ですが、内部実装ファイル同士で多用すると循環参照やビルドコストの問題につながることがあるため、外部公開 API としての利用を基本にすると安全です。[15][16]

```ts
import {
  NavigationProvider,
  useAppRouter,
  type AppRouter,
  type AppNavigationOptions,
  type AppRouteTo,
} from '@/shared/navigation'
```