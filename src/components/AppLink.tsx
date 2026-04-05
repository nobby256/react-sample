'use client';

import React from 'react';
import { useAppRouter } from './AppRouter';

/**
 * Props for AppLink.
 *
 * This component preserves standard browser new-tab behavior while routing
 * normal left-click navigation through AppRouter.
 */
export type AppLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
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
 * Anchor component for pages that may be opened either in the current tab or in a new tab.
 *
 * Normal left click is intercepted and delegated to AppRouter so __appBack can be stored.
 * Modified clicks, middle click, and explicit new-tab targets are left to the browser.
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