import React, { useState, ChangeEvent, 
  useContext, useRef, useEffect } from 'react'
import { Context } from '@/store/globalContext'
import { BsSend } from 'react-icons/bs'

interface InputProps {
  onSendMessage: (message: string) => void
}

const LoadingAnimation: React.FC = () => {

  const { dots } = useContext(Context)

  return <span>{'.'.repeat(dots)}</span>

}

const Input: React.FC<InputProps> = ({ onSendMessage }) => {

  const [inputText, setInputText] = useState('')
  const { isLoading } = useContext(Context)
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleSendClick = () => {
    if (inputText.trim() !== '') {
      onSendMessage(inputText)
      setInputText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendClick()
    }
  }

  return (
    <div className="absolute bottom-[3rem] flex flex-row
    justify-between w-[100%] gap-0">
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Ingresa tu pregunta aquí..."
        className="w-[92%] left-0 text-lg bg-white
        p-[.75rem] pl-4 rounded-full shadow-md h-[52px]
        max-[1000px]:w-[80%] max-[650px]:text-sm
        max-[640px]:text-[#E93A90]"
      />
      <button onClick={handleSendClick} className="!w-[50px]
      !h-[50px] text-white rounded-full
      text-2xl shadow-md flex justify-center items-center
      bg-[#E93A90]">
        {isLoading ? (
        <p className='relative bottom-2'>
          <LoadingAnimation />
        </p>
      ) : <BsSend className='mr-[.25rem]' />}
      </button>
    </div>
  )
}

export default Input

