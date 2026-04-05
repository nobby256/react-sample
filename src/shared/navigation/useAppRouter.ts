'use client';

import { useRouter } from 'next/navigation';

type NavigateOptions = {
  scroll?: boolean;
  appBack?: boolean;
};

type ReplaceOptions = {
  scroll?: boolean;
  appBack?: boolean;
};

/**
 * アプリケーション用の薄いルーター抽象。
 *
 * Next.js のルーティング API への直接依存を隠しつつ、
 * history.state にアプリ専用の戻るマーカーを保存する機能を追加する。
 */
export type AppRouter = {
  push: (url: string, options?: NavigateOptions) => void;
  replace: (url: string, options?: ReplaceOptions) => void;
  back: () => void;
};

const APP_BACK_KEY = '__appBack';

/**
 * Next.js App Router 用のアプリケーションルーターラッパを返す。
 *
 * push()/replace() は必要に応じて history.state に
 * アプリ用の戻るマーカーを書き込んだうえで Next.js の遷移を実行する。
 * back() は意図的に window.history.back() 相当の動作にしている。
 */
export function useAppRouter(): AppRouter {
  const router = useRouter();

  const push: AppRouter['push'] = (url, options) => {
    const { appBack = false, scroll } = options ?? {};

    if (appBack) {
      const currentState = window.history.state ?? {};
      const nextState = { ...currentState, [APP_BACK_KEY]: true };
      window.history.pushState(nextState, '', url);
    }

    router.push(url, scroll === undefined ? undefined : { scroll });
  };

  const replace: AppRouter['replace'] = (url, options) => {
    const { appBack = false, scroll } = options ?? {};

    if (appBack) {
      const currentState = window.history.state ?? {};
      const nextState = { ...currentState, [APP_BACK_KEY]: true };
      window.history.replaceState(nextState, '', url);
    }

    router.replace(url, scroll === undefined ? undefined : { scroll });
  };

  const back: AppRouter['back'] = () => {
    window.history.back();
  };

  return { push, replace, back };
}

export function hasAppBackState(): boolean {
  if (typeof window === 'undefined') return false;
  return window.history.state?.[APP_BACK_KEY] === true;
}
