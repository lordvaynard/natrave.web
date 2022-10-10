import axios from 'axios'
import { useFormik } from 'formik'
import { useLocalStorage } from 'react-use'
import * as yup from 'yup'


const validationSchema = yup.object().shape({
    homeScore: yup.string().required(),
    awayScore: yup.string().required()
})

export const Card = ({homeTeam, awayTeam, homeScore, awayScore, gameTime, disabled, gameId }) => {
    const [auth] = useLocalStorage('auth') //pega tudo do storage

    const formik = useFormik({
        onSubmit: (values) => {
            axios({
                method:'post',
                baseURL:import.meta.env.VITE_API_URL,
                url:'/tips', 
                headers: { 
                    authorization: `Bearer ${auth.accessToken}` //pega o token do usuario
                },
                data:{ //data por ser posts
                    ...values,
                    gameId
                }
            })
        },
        initialValues: {
            homeScore,
            awayScore
        },
        validationSchema
    })
    return(
    <div className='rounded-xl border border-grey-300 p-4  text-center space-y-4'>
        <span className='text-sm md:text-base text-grey-700 font-bold'>{gameTime}</span>
        <form className='flex space-x-4 justify-center items-center'>
            <span className='uppercase'>{homeTeam}</span> 
            <img src={`/imgs/flags/${homeTeam}.png`} alt="" />
            <input 
                className='bg-red-300/[0.2] w-[50px] h-[55px] text-red-700 text-xl text-center' 
                max={10} min={0}
                type="number"
                name= 'homeScore'
                value={formik.values.homeScore}
                onChange = {formik.handleChange}
                onBlur = {formik.handleSubmit}
                disabled = {disabled}                    
            />
            <span className='text-red-500 font-bold'>X</span>
            <input 
                className='bg-red-300/[0.2] w-[50px] h-[55px] text-red-700 text-xl text-center' 
                max={10} min={0}  
                type="number" 
                name= 'awayScore'
                value={formik.values.awayScore}
                onChange = {formik.handleChange}
                onBlur = {formik.handleSubmit}       
                disabled = {disabled}         
            />
            <img src={`/imgs/flags/${awayTeam}.png`} alt="" />   
            <span className='uppercase'>{awayTeam}</span>       
        </form>
    </div>
    )
}