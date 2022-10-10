import { addDays, subDays, format, formatISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Icon } from '~/components/Icon'

export const DateSelect = ({ currentDate, onChange }) => {//recebe a data atal e passa a data nova
    const date = new Date(currentDate) //para facilitar o new date nas duas funções abaixo
    const prevDay = () => {
        const nextDate = subDays(date,1)//Subtrai um dia
        onChange(formatISO(nextDate))  
    }

    const nextDay = () => {
        const nextDate = addDays(date,1) //Soma um dia
        onChange(formatISO(nextDate))  
    }
        return (
        <div className='p-4 flex space-x-4 justify-center'>
            <Icon name='arrowLeft' className='w-6 text-red-500' onClick={prevDay} />
            <span className='font-bold'>{format(date, "d' de 'MMMM' de 'Y", { locale:ptBR })}</span>
            <Icon name='arrowRight' className='w-6 text-red-500' onClick={nextDay} />
        </div>
    )
}