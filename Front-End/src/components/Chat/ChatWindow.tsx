import React, { useContext, useRef, useEffect } from 'react'
import { MdOutlineLockReset } from 'react-icons/md'
import { Context } from '@/store/globalContext'
import Message from './Message'
import { MessageData } from '@/types'


interface ChatWindowProps {
  messages: MessageData[]
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  
  const context = useContext(Context)
  const { clearLocalStorage } = useContext(Context)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  

  useEffect(() => {

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }

  }, [context?.messages])

  return (
    <div className='w-[100%] absolute bottom-[7rem] overflow-y-scroll
    h-[-webkit-fill-available] mt-8' ref={scrollContainerRef}>
      {messages.map((message, index) => (
        <Message key={index} text={message.text} sender={message.sender} />
      ))}
      <div className='col-span-2 w-[100%] flex flex-row justify-center'>
        <button className='text-xs py-[.15rem] rounded-full border-[1px] border-[#E93A90] px-1
        w-[5rem] text-[#E93A90] hover:bg-[#E93A90] hover:text-white flex flex-row items-center
        justify-around' onClick={clearLocalStorage}>
          Clear <MdOutlineLockReset />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow


