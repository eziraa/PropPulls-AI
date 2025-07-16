'use client'
import GlobalProvider from '@/lib/providers/global.provider'
import React from 'react'

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <GlobalProvider>
        {children}
    </GlobalProvider>
  )
}

export default Layout