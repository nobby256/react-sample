'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useProfileStore } from '../stores/useProfileStore'
import { useAppDataStore } from '../stores/useAppDataStore'

type AppBootstrapperProps = {
    children: ReactNode
    fallback?: ReactNode
}

export function AppBootstrapper({
    children,
    fallback,
}: AppBootstrapperProps) {
    const profileStatus = useProfileStore((state) => state.status)
    const profileLoad = useProfileStore((state) => state.load)
    const profileReset = useProfileStore((state) => state.reset)

    const appDataStatus = useAppDataStore((state) => state.status)
    const appDataLoad = useAppDataStore((state) => state.load)
    const appDataReset = useAppDataStore((state) => state.reset)

    const [bootstrapError, setBootstrapError] = useState<Error | null>(null)

    useEffect(() => {
        if (profileStatus !== 'blank') {
            return
        }

        const run = async () => {
            try {
                await profileLoad()
            } catch (error) {
                profileReset()
                appDataReset()
                setBootstrapError(
                    error instanceof Error ? error : new Error('Profile load failed'),
                )
            }
        }

        void run()
    }, [profileStatus, profileLoad, profileReset, appDataReset])

    useEffect(() => {
        if (profileStatus !== 'success' || appDataStatus !== 'blank') {
            return
        }

        const run = async () => {
            try {
                await appDataLoad()
            } catch (error) {
                profileReset()
                appDataReset()
                setBootstrapError(
                    error instanceof Error ? error : new Error('AppData load failed'),
                )
            }
        }

        void run()
    }, [
        profileStatus,
        appDataStatus,
        appDataLoad,
        profileReset,
        appDataReset,
    ])

    if (bootstrapError) {
        throw bootstrapError
    }

    const isLoading =
        profileStatus === 'blank' ||
        profileStatus === 'loading' ||
        appDataStatus === 'blank' ||
        appDataStatus === 'loading'

    if (isLoading) {
        return <>{fallback ?? <p>アプリデータを読み込んでいます...</p>}</>
    }

    return <>{children}</>
}