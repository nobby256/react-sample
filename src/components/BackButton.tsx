'use client';

import React, { useLayoutEffect, useState } from 'react';
import { hasAppBackState, useAppRouter } from './AppRouter';

/**
 * BackButton operation mode.
 *
 * - normal: always enabled and always executes router.back().
 * - back: enabled only when the current history entry contains __appBack.
 */
export type BackButtonMode = 'normal' | 'back';

/**
 * Props for BackButton.
 */
export type BackButtonProps = {
  mode: BackButtonMode;
  className?: string;
  disabledClassName?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

/**
 * Application back button component.
 *
 * In normal mode it always behaves like browser back.
 * In back mode it is disabled unless the current history entry is marked with
 * __appBack by AppRouter.push()/replace().
 */
export function BackButton({
  mode,
  className,
  disabledClassName,
  children,
  onClick,
}: BackButtonProps) {
  const router = useAppRouter();
  const [disabled, setDisabled] = useState(() => (mode === 'back' ? true : false));

  useLayoutEffect(() => {
    if (mode === 'normal') {
      setDisabled(false);
      return;
    }

    setDisabled(!hasAppBackState());
  }, [mode]);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    router.back();
  };

  const mergedClassName = disabled
    ? [className, disabledClassName].filter(Boolean).join(' ')
    : className;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={mergedClassName}
    >
      {children ?? '戻る'}
    </button>
  );
}