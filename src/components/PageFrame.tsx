'use client';

import { memo } from 'react'
import { useEffect } from 'react'

type PageFrameProps = {
    children?: React.ReactNode;
    title: string;
    backButton?: boolean;
};

export const PageFrame = memo(function PageFrame({
    children,
    title,
    backButton = true
}: PageFrameProps) {

    useEffect(() => {
        document.title = title
    }, [title])

    const onClickBackButton = () => {
        window.history.back();
    }

    return (
        <>
            <header>
                <button type="button" disabled={!backButton} onClick={onClickBackButton}>
                    戻る
                </button>
                <h1>{title}</h1>
            </header>
            <main>{children}</main>
            <footer>
            </footer>
        </>
    )
})