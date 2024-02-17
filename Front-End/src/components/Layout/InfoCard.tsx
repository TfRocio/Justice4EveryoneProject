import React from 'react'

interface InfoCardProps {
  question: string,
  answer: string
}

const InfoCard: React.FC<InfoCardProps> = ({question, answer}) => {
  return (
    <div className='h-32 bg-[#F491B0] rounded-xl shadow-md flex flex-col max-[650px]:h-auto
    items-start gap-2 p-4 text-left overflow-hidden break-words whitespace-normal  max-[650px]:hidden'>
      <h4 className='text-sm text-[#FCDDDF] max-[650px]:text-xs '>
        {question}
      </h4>
      <p className='text-white text-xs'>
        {answer}
      </p>
    </div>
  )
}

export default InfoCard