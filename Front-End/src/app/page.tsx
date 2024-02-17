'use client'

import React, { useContext } from 'react'
import { Context } from '@/store/globalContext'
import { NextPage } from 'next'
import ChatWindow from '@/components/Chat/ChatWindow'
import Input from '@/components/Chat/Input'
import Navbar from '@/components/Layout/Navbar'
import Header from '@/components/Layout/Header'
import Intro from '@/components/Layout/Intro'
import Footer from '@/components/Layout/Footer'


const Home: NextPage = () => {

  const { messages, isVisible, handleSendMessage } = useContext(Context)

  return (
    <div>
      <main className='w-[50rem] max-[1000px]:w-[80vw] relative
      max-[640px]:bottom-2'>
        <Header />
        {isVisible ? <Intro /> :
        <ChatWindow messages={messages} />}
        <Input onSendMessage={handleSendMessage} />
        <Footer />
      </main>
    </div>
  )
}

export default Home
