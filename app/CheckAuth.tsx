'use client'
import { userStore } from '@/store/userStore';
import React, { useEffect } from 'react'

const CheckAuth = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { checkAuth } = userStore()
    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    return (
        <>
            {children}
        </>
    )
}

export default CheckAuth