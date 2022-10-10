import axios from 'axios'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useLocalStorage } from 'react-use' //controle do react localStorage
import { Navigate } from 'react-router-dom' //navegação de paginas
import { Icon, Input } from '../../components' 

 const validationSchema = yup.object().shape({
    name: yup.string().required('Preencha seu nome'),
    username: yup.string().min(3, 'minimo 3 caracteres').required('Preencha seu nome de usuário'),
    email: yup.string().email('Preencha um e-mail valido').required('Preencha seu e-mail'),
    password: yup.string().required('Preencha sua senha')
});

export const Signup = () => {
    const [auth,setAuth] = useLocalStorage('auth', {}) //verifica DB local

    if(auth?.user?.id){
      return <Navigate to="/dashboard" replace={true} />
    }

    const formik  = useFormik({//Chamada do back end para cadastrtar o usuario
        onSubmit: async (values) => {
            const res = await axios({
                method: 'post',
                baseURL: import.meta.env.VITE_API_URL,
                url: './users',
                data: values
            })
            
            setAuth(res.data) //função para gravar a autorização do login reactuse
            //window.localStorage.setItem('auth', JSON.stringify(res.data)) //gravando no banco local como string o auth
            //const auth = localStorage.getItem(JSON.parse('auth')) --ler banco local de autorização em texto e transformando em objeto
        },
        initialValues: {
            name: '',
            username: '',
            email: '',
            password: ''
        },
        validationSchema
    })

    if(auth?.user?.id){ //se logado vai para dashboard
        return <Navigate to="/dashboard" replace={true} />
    }

    return (
        <div>
        <header className=' p-4 border-b border-red-700'>
            <div className="container flex justify-center max-w-xl">
            <img src="/imgs/logo-fundo-branco.svg" className='w-32 md:w-40' />
            </div>
        </header>

        <main className="container max-w-xl p-4">
            <div className="p-4 flex space-x-4 items-center">
                <a href="/">
                    <Icon name="back" className="h-6"/>
                </a>
                <h2 className="text-xl font-bold">
                    Crie sua conta
                </h2>
            </div>
            <form action="" className="p-4 space-y-6" onSubmit={formik.handleSubmit}>

            <Input
                    type='text'
                    name='name'
                    label='Seu nome'
                    error={formik.touched.name && formik.errors.name}
                    placeholder='Digite seu nome'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />  

                <Input
                    type='text'
                    name='username'
                    label='Seu nome de usuário'
                    error={formik.touched.username && formik.errors.username}
                    placeholder='Digite um nome de usuário'
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />  

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
            {formik.isSubmitting ? 'Carregando...' : 'Criar minha conta'}
        </button>

            </form>
        </main>

        </div>
    )
}