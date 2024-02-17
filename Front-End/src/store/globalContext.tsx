'use client'

import React, { createContext, ReactNode, useState,
  useEffect  } from 'react'
import { MessageData } from '@/types'

export const Context = createContext<any>('')

interface Props {
  children: ReactNode
}

export const ContextProvider: React.FC<Props> = ({children}) => {

  const [messages, setMessages] = useState<MessageData[]>([])
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dots, setDots] = useState(0)

  if (typeof window !== 'undefined') {
    let vh = window.innerHeight * 0.01 
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  const handleSendMessage = (userMessage: string) => {
    setIsLoading(true)
    const sendMessage = async () => {
      try {
        const response = await fetch(
          `/responseChatbot?user_input=${encodeURIComponent(userMessage)}`
          )
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server')
        }
  
        const responseData = await response.json()
        console.log(responseData)
  
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: responseData.user_input, sender: 'user' },
          { text: responseData.answer, sender: 'bot' },
        ])

        const updatedMessages = [
          ...messages,
          { text: responseData.user_input, sender: 'user' },
          { text: responseData.answer, sender: 'bot' },
        ]
        localStorage.setItem('chatHistory', JSON.stringify(updatedMessages))
  
        setIsVisible(false)
      } catch (error: any) {
        console.error('Error:', error.message)
      } finally {
        setIsLoading(false)
      }
    }
  
    sendMessage()
  }

  const fetchInitialChatHistory = async () => {  
    try {
      const storedChatHistory = localStorage.getItem('chatHistory')
  
      if (storedChatHistory) {
        const initialHistoryData = JSON.parse(storedChatHistory)
        setMessages(initialHistoryData)
        setIsVisible(false)
      }
    } catch (error: any) {
      console.error('Error:', error.message)
    }
  }

  const clearLocalStorage = () => {
    localStorage.clear()
    setIsVisible(false)
    console.log('Local storage cleared.')
  }

  useEffect(() => { 

    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots < 3 ? prevDots + 1 : 0))
    }, 500)

    return () => clearInterval(interval)

  }, [])


  return (
    <Context.Provider 
      value={{ messages, isVisible, handleSendMessage,
      isLoading, dots, fetchInitialChatHistory, clearLocalStorage }}>
      {children}
    </Context.Provider>
    )
}