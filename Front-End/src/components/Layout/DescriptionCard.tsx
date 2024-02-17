import React from 'react'
import Image from 'next/image'
import descriptionIcon from '../../../public/images/description.svg'

interface DescriptionCardProps {
  title: string,
  description: string
}


const DescriptionCard: React.FC<DescriptionCardProps> = ({title, description}) => {
  return (
    <div className='col-span-2 rounded-xl shadow-md bg-[#FCDDDF] p-4 flex flex-row 
    justify-between gap-8 max-[650px]:flex max-[650px]:flex-col  max-[650px]:bg-[#F491B0]'>
      <Image src={descriptionIcon} alt='Description Icon' className='w-24 h-24 object-cover
      max-[650px]:hidden' />
      <div className='flex flex-col gap-2 text-left h-[100%] justify-center'>
        <h4 className='text-md text-[#000000] font-bold max-[650px]:text-sm
         max-[650px]:text-[#FCDDDF]'>
          {title}
        </h4>
        <p className='text-[#696969] text-sm font-medium max-[650px]:text-xs
         max-[650px]:text-white'>
          {description}
        </p>
      </div>
    </div>
  )
}

export default DescriptionCard