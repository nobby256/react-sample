'use client';

import { memo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation';
import { hasAppBackState, useAppRouter } from './useAppRouter';

type BackButtonMode = 'normal' | 'back';

type BackButtonProps = {
  mode: BackButtonMode;
  className?: string;
  disabledClassName?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

/**
 * アプリ内の戻るボタン用コンポーネント。
 *
 * normal モードでは常にブラウザ戻る相当の動作をする。
 * back モードでは、AppRouter.push()/replace() によって
 * 現在の履歴エントリに __appBack が設定されている場合のみ有効になる。
 *
 * また、呼び出し側から disabled を明示的に渡した場合は、
 * mode による判定よりも優先して無効化する。
 */
export const BackButton = memo(function BackButton({
  mode,
  className,
  disabledClassName,
  children,
  onClick,
  disabled = false,
}: BackButtonProps) {
  const router = useAppRouter();

  // layout.tsx 配下でも画面遷移時に再レンダーされるように購読する
  usePathname();
  useSearchParams();

  const internalDisabled = mode === 'back' ? !hasAppBackState() : false;
  const mergedDisabled = disabled || internalDisabled;

  const handleClick = () => {
    if (mergedDisabled) return;
    onClick?.();
    router.back();
  };

  const mergedClassName = mergedDisabled
    ? [className, disabledClassName].filter(Boolean).join(' ')
    : className;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={mergedDisabled}
      aria-disabled={mergedDisabled}
      className={mergedClassName}
    >
      {children ?? '戻る'}
    </button>
  );
})