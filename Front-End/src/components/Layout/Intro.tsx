import React, { useContext } from 'react'
import { MdOutlineHistory } from 'react-icons/md'
import { Context } from '@/store/globalContext'
import InfoCard from './InfoCard'
import DescriptionCard from './DescriptionCard'

const Intro: React.FC = () => {

  const { fetchInitialChatHistory } = useContext(Context)
  
  return (
    <div className='w-[100%] absolute bottom-[7rem] grid grid-cols-2 max-[650px]:h-auto
    grid-rows-2 gap-2 max-[650px]:flex max-[650px]:flex-col'>
      <DescriptionCard title='Chatbot de Tránsito - Ciudad de México' description='¡¡Hola! Soy 
      un asistente virtual llamado Pepe, que sabe todo sobre el Reglamento de Tránsito de la 
      Ciudad de México. ¡Hazme una pregunta!' />
      <InfoCard question='¿Cuál es la multa por estacionarse en un lugar prohibido?'
      answer='La multa por estacionarse en un lugar prohibido puede variar, pero generalmente 
      es de alrededor de 700 pesos.' />
      <InfoCard question='¿Cuál es la velocidad máxima permitida en las avenidas principales?'
      answer='La velocidad máxima permitida en las avenidas principales de la Ciudad de México 
      es de 50 km/h, a menos que se indique lo contrario.' />
      <div className='col-span-2 w-[100%] flex flex-row justify-center'>
        <button className='text-xs py-[.15rem] rounded-full border-[1px] border-[#E93A90] px-1
        w-[5rem] text-[#E93A90] hover:bg-[#E93A90] hover:text-white flex flex-row items-center
        justify-around' onClick={fetchInitialChatHistory}>
          History <MdOutlineHistory />
        </button>
      </div>
    </div>
  )
}

export default Intro