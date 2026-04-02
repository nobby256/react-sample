import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const isDev = process.env.NODE_ENV === 'development'

export function QueryProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * 失敗時の自動リトライ回数
             * - デフォルト: 3 回（v4/v5 共通）[web:279][web:282]
             * - 開発中は 0 回にしてエラーをすぐ可視化
             * - 本番では 2 回までリトライして一時的なネットワーク揺れを吸収
             */
            retry: isDev ? false : 2,

            /**
             * エラーをレンダリングフェーズで throw するか
             * - デフォルト: undefined（= useQuery の `throwOnError` オプションに任せる）[web:301][web:285]
             * - true にすると、エラー時に ErrorBoundary（今回だと Next の error.tsx）へ伝播させやすい
             */
            throwOnError: true,

            /**
             * コンポーネントが「再マウント」されたときに常に refetch するか
             * - デフォルト: true（v4）または 'always' 相当 [web:279][web:281]
             * - 'always' にすると、画面遷移で戻る／進むのたびに
             *   同じ queryKey を使うコンポーネントでは必ず再フェッチされる
             *   → 「過去にエラーだったからまたエラー」の状態を避けられる前提に合う
             */
            refetchOnMount: 'always',

            /**
             * オフライン→オンライン復帰時に自動で refetch するか
             * - デフォルト: true [web:279][web:282]
             * - 'always' にしておけば、復帰時に必ず最新を取りに行く
             *   （完全CSRの業務系なら true でも 'always' でも体感差は小さい）
             */
            refetchOnReconnect: 'always',

            /**
             * タブにフォーカスが戻ったときに自動 refetch するか
             * - デフォルト: true [web:279][web:282]
             * - モバイルでタブ切り替えが頻繁な場合はうるさいので false にしておく
             *   （最新化は refetchOnMount/OnReconnect と明示的な操作で担保）
             */
            refetchOnWindowFocus: false,

            /**
             * データを「fresh」と見なす時間（ミリ秒）
             * - デフォルト: 0（取得直後から stale 扱い）[web:279][web:282]
             * - 今回は「常に取り直す」前提なので明示指定はせず、0 のままで問題なし
             */
            // staleTime: 0,
          },

          mutations: {
            /**
             * 失敗したミューテーションの自動リトライ回数
             * - デフォルト: 0（= retry なし）[web:299]
             * - 書き込み系で自動リトライはリスクが高いので常に false 固定
             */
            retry: false,

            /**
             * ミューテーションエラーを ErrorBoundary に伝播させるか
             * - デフォルト: undefined（= useMutation の個別設定に任せる）[web:304][web:301]
             * - true にすると、App レイヤーの ErrorBoundary でまとめて扱いやすい
             */
            throwOnError: true,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}