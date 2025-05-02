'use client'
import { blogStore } from '@/store/blogStore';
import { userStore } from '@/store/userStore';
import React, { useEffect } from 'react'

const CheckAuth = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
      const { checkAuth, getAllUsers } = userStore()
      const { fetchBlogs } = blogStore()
    
    useEffect(() => {
        checkAuth();
    }, [checkAuth])
    
    useEffect(() => {
        getAllUsers()
        fetchBlogs()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <>
            {children}
        </>
    )
}

export default CheckAuth