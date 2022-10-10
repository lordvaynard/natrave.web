import axios from 'axios'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useLocalStorage } from 'react-use' //controle do react localStorage
import { Navigate } from 'react-router-dom' //navegação de paginas
import { Icon, Input } from '~/components' 

const validationSchema = yup.object().shape({
    email: yup.string().email('Preencha um e-mail valido').required('Preencha seu e-mail'),
    password: yup.string().required('Preencha sua senha')
});

export const Login = () => {
    const [auth,setAuth] = useLocalStorage('auth', {}) //controle do DB local React

    const formik  = useFormik({
        onSubmit: async (values) => {
            const res = await axios({
                method: 'get',
                baseURL: import.meta.env.VITE_API_URL,
                url: './login',
                auth: { //função do axios para login
                    username: values.email, //propriedade username do axios para login
                    password: values.password//propriedade password do axios para login
                }
            })
            //localStorage.setItem('auth', JSON.stringify(res.data)) - gravar banco local 
            //const auth = localStorage.getItem(JSON.parse('auth')) --ler banco local de autorização em texto e transformando em objeto
            //remove() apaga a autorização de login do banco local
            setAuth(res.data) //função para gravar a autorização do login reactuse
        },
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema
    })

    if(auth?.user?.id){ //se logado vai para o dashboard
        return <Navigate to="/dashboard" replace={true} />
    }

    return (
        <div>
        <header className=' p-4 border-b border-red-700'>
            <div className="container flex justify-center max-w-xl">
            <img src="/public/imgs/logo-fundo-branco.svg" className='w-32 md:w-40' />
            </div>
        </header>

        <main className="container max-w-xl p-4">
            <div className="p-4 flex space-x-4 items-center">
                <a href="/">
                    <Icon name="back" className="h-6"/>
                </a>
                <h2 className="text-xl font-bold">
                    Entre na sua conta
                </h2>
            </div>
            <form action="" className="p-4 space-y-6" onSubmit={formik.handleSubmit}>

                 <Input
                    type='text'
                    name='email'
                    label='Seu e-mail'
                    error={formik.touched.email && formik.errors.email}
                    placeholder='Digite seu e-mail'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />   
                              
                 <Input
                    type='password'
                    name='password'
                    label='Sua senha'
                    error={formik.touched.password && formik.errors.password}
                    placeholder='Digite sua senha'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />

        <button 
            className='w-full text-center text-white bg-red-500 py-3 px-6 rounded-xl disabled:opacity-50' 
            disabled={!formik.isValid || formik.isSubmitting}
            type="submit" 
        >
            {formik.isSubmitting ? 'Carregando...' : 'Entrar'} 
        </button>

            </form>
        </main>

        </div>
    )
}