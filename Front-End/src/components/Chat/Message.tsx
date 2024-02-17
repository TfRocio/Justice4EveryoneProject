import React from 'react'
import { MessageData } from '@/types'


const Message: React.FC<MessageData> = ({ text, sender }) => (
  <div className={sender === 'user' ? 'user-message' : 'bot-message'} style={{ marginLeft: sender === 'user' ? 'auto' : undefined }}>
    {text}
  </div>
)

export default Message



