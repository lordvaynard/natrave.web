import { Navigate } from 'react-router-dom'
import { useLocalStorage } from 'react-use'

export function Home() {
  const [auth] = useLocalStorage('auth', {})//verifica DB local

  if(auth?.user?.id){//se logado vai para dashboard
    return <Navigate to="/dashboard" replace={true} />
}

  return (
    <div className='h-screen bg-red-700 text-white p-4 space-y-6 flex flex-col items-center'>
      <header className='container max-w-5xl p-4 flex justify-center'>
        <img src="/public/imgs/logo-fundo-vinho.svg" className='w-40' />
      </header>
    <div className='container max-w-5xl flex-1 p-4 flex flex-col items-center  md:flex-row space-y-6 md:space-y-0 md:space-x-6'>
      <div className='md:flex-1 flex justify-center'>
        <img src="/imgs/photo.png" className='w-full max-w-md' />
      </div>
      <div className='md:flex-1 flex flex-col space-y-6'>
      <h1 className='text-2xl text-center md:text-left font-bold'>Dê o seu palpite na Copa do Mundo do Catar 2022! </h1>

      <a href="/signup" className='text-center text-red-700 bg-white text-xl py-4 px-8 rounded-xl'>
        Criar minha conta
        </a>

        <a href="/login" className='text-center text-white bg-red border border-white text-xl py-4 px-8 rounded-xl'>
        Fazer Login
      </a>
      </div>
    </div>
    </div>
  )
}