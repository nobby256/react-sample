/**
 * アプリ内で扱う遷移先を表す型です。
 *
 * 現段階では router 実装に依存しないよう、文字列 URL を共通表現にしています。
 * 将来 React Router や TanStack Router へ移行する場合も、まずはこの型を入口にして
 * adapter 側で吸収できるようにする想定です。
 */
export type AppRouteTo = string

/**
 * アプリ共通の遷移オプションです。
 *
 * 現在は Next.js の `scroll` オプションに合わせて最小限にしています。
 * router 間で差異が大きい option は共通 API に入れず、必要になった時に
 * adapter 層で個別対応する方針です。
 */
export type AppNavigationOptions = {
  scroll?: boolean
}

/**
 * アプリ全体で利用する router 抽象です。
 *
 * 画面側は Next.js など具体的な router 実装を直接意識せず、
 * この型が提供する最小 API だけを利用します。
 *
 * - `push`: 新しい履歴を積んで遷移する
 * - `replace`: 現在の履歴を置き換えて遷移する
 * - `back`: 戻れる場合だけ 1 つ前へ戻る
 * - `canGoBack`: アプリ内履歴に基づいて戻るボタンを有効化できるかを示す
 */
export type AppRouter = {
  canGoBack: boolean
  push: (to: AppRouteTo, options?: AppNavigationOptions) => void
  replace: (to: AppRouteTo, options?: AppNavigationOptions) => void
  back: () => void
}