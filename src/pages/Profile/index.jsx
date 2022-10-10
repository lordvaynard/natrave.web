import { useState, useEffect } from 'react'
import axios from 'axios'
import { Fragment } from 'react'
import { useAsyncFn, useLocalStorage } from 'react-use' //controle do react localStorage
import { useNavigate, useParams } from 'react-router-dom' 
import { format, formatISO } from 'date-fns'
import { Icon, Card, DateSelect } from '~/components'

export const Profile = () => {
    const params = useParams() //pega o usuario da pagina
    const navigate = useNavigate()
    const [currentDate, setDate] = useState(formatISO(new Date(2022, 10, 20)))//JS janeiro é mes 0 - pega o timeZone da maquina que esta executando
    const [auth, setAuth] = useLocalStorage('auth', {})    //verifica DB local

    const [{value:user, loading, error }, fetchTips] = useAsyncFn(async () => {
        const res = await axios({ //useAsync gerencia a promisse do axios
            method: 'get',
            baseURL:import.meta.env.VITE_API_URL,
            url:`/${params.username}`
        })

        const tips = res.data.tips.reduce((acc, tip) => {
            acc[tip.gameId] = tip
            return acc
        }, {})
        
        return {
            ...res.data,//name: res.data.name,
            tips
        }
    })    

    const [games,fetchGames] = useAsyncFn(async (params) => {
        const res = await axios({ //useAsync gerencia a promisse do axios
            method: 'get',
            baseURL:import.meta.env.VITE_API_URL,
            url:'/games',
            params //Params por ser método get, se fosse post seria data
        })
        return res.data
    })

    const logout = () => {
        setAuth({})
        navigate('/login')
    }
    const isLoading = games.loading || loading
    const hasError = games.error || error
    const isDone = !isLoading && !hasError

    useEffect(() => { //Carrega os jogos antes da pagina
        fetchGames({ gameTime: currentDate })
        fetchTips()
    }, [currentDate]) //sempre que mudar o currentDate executa o doFetch

    return (    
    <Fragment>
        <header className="bg-red-500 text-white">
                <div className="container max-w-3xl flex justify-between p-4">
                    <img src="/imgs/logo-fundo-vermelho.svg" className="w-28 md:w-40" />
                    {auth?.user?.id && (
                        <div onClick={logout} className='p-2 cursor-pointer'> 
                            Sair
                        </div>
                    )}
                </div>
        </header>        

        <main className='space-y-6'>
            <div className="bg-red-500 text-white p-4 ">
                <div className="container max-w-5xl space-y-6">
                <a href='/dashboard'>
                    <Icon name="back" className="w-10" />
                </a>
                <h3 className='text-2xl font-bold'>{user?.name}</h3>
                </div>
            </div>

            <section id='content' className='container max-w-3xl p-4 space-y-4'>

                <h2 className='text-red-500 text-xl font-bold'>Seus palpites</h2>

                <DateSelect currentDate={currentDate} onChange={setDate} />

                <div  className='space-y-4'>
                        {isLoading && 'Carregando jogos...'}
                        {hasError && 'Algo deu errado...'}
                        {isDone && games.value?.map(game => ( 
                        <Card 
                                key ={game.id} //obrigatoria key unica num loop
                                gameId ={game.id}
                                homeTeam={game.homeTeam}
                                awayTeam={game.awayTeam}
                                gameTime={format(new Date(game.gameTime),'H:mm')} //datefns espera um new date por ser objeto
                                homeScore={user.tips?.[game.id]?.homeScore || ''} //se encontrado palpite retorna, se não vazio
                                awayScore={user.tips?.[game.id]?.awayScore || ''} //se encontrado palpite retorna, se não vazio
                                disabled={true}
                        />  
                        ))}
                    </div>
            </section>

        </main>
    </Fragment>
)
}