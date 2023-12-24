'use client'
import Header from '@/components/header'
import Upload from '@/components/upload'
import React, { useCallback, useState } from 'react';

export default function Home() {

  return (
    <div className='w-full h-screen'>
      <Header />
      <Upload />
    </div>
  )
}
