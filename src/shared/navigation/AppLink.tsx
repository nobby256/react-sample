'use client';

import React from 'react';
import { useAppRouter } from './useAppRouter';

/**
 * AppLink コンポーネントのプロパティ。
 *
 * 通常の左クリックは AppRouter による遷移へ切り替えつつ、
 * 新しいタブで開くブラウザ標準動作は維持する。
 */
type AppLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  appBack?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

function shouldHandleWithAppRouter(event: React.MouseEvent<HTMLAnchorElement>): boolean {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

  const target = event.currentTarget.getAttribute('target');
  if (target && target !== '_self') return false;

  return true;
}

/**
 * 同一タブ遷移と別タブ起動の両方を想定したリンクコンポーネント。
 *
 * 通常の左クリックは横取りして AppRouter に委譲し、
 * 必要に応じて __appBack を保持した状態で遷移する。
 * 修飾キー付きクリック、中クリック、明示的な新規タブ指定は
 * ブラウザ標準動作に任せる。
 */
export function AppLink({
  href,
  appBack = false,
  replace = false,
  scroll,
  onClick,
  children,
  ...anchorProps
}: AppLinkProps) {
  const router = useAppRouter();

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);

    if (!shouldHandleWithAppRouter(event)) {
      return;
    }

    event.preventDefault();

    if (replace) {
      router.replace(href, { appBack, scroll });
      return;
    }

    router.push(href, { appBack, scroll });
  };

  return (
    <a href={href} onClick={handleClick} {...anchorProps}>
      {children}
    </a>
  );
}