import { useEffect, useState } from 'react'
import bgImage from '../../assets/login.jpg'
import pattern from '../../assets/pattern.png'
import logo from '../../assets/ut.png'
import { useAuthStore } from '../../stores/auth'
import toast from 'react-hot-toast'
import { api } from '../../lib/axios/api'
import { useNavigate } from 'react-router-dom'


export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [formdata, setFormData] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const { login,isLogged } = useAuthStore()

    useEffect(()=>{
        if(isLogged){
            toast.success('Welcome back!')
            navigate('/app/dashboard')
        }
    }, [isLogged])

    const handleLogin = async () => {
        try {
            const res = await api.post('/Auth/login', {
                email: formdata.email,
                password: formdata.password
            })
            login(res.data.data, res.data.data.token)

            toast.success('Login successful')
            navigate('/app/dashboard')

        } catch (error) {
            console.error('Login failed:', error)
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }

    return (
        <div className="h-[100dvh] w-screen relative flex items-center justify-center px-4">
            {/* Background pattern with blur */}
            <div 
                style={{ 
                    backgroundImage: `url(${pattern})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '1000px',
                    filter: 'blur(2px)'
                }}
                className="absolute inset-0 z-0"
            />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden bg-white/30">
                <div className="absolute -top-12 -left-12 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl"></div>
            </div>

            <div className='w-full max-w-6xl mx-auto flex items-center justify-center relative z-10'>
                <div className='bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 w-full max-w-5xl flex h-[90dvh]'>
                    <div className='w-1/2 flex flex-col px-12 py-16 justify-center space-y-8 bg-white'>
                        <div className='space-y-3'>
                            <div className='text-3xl font-bold flex items-center flex-col gap-4'>
                                <div className='relative'>
                                    <img src={logo} alt='login' className='w-16 h-16 relative transition-transform duration-300 hover:scale-105'/>
                                </div>
                                <h1 className='text-[#ffd401]'>
                                    UT Careers
                                </h1>
                            </div>
                            <p className='text-gray-600 text-center'>
                                Find your dream job here
                            </p>
                        </div>

                        <div className='space-y-4'>
                            <div className='relative'>
                                <span className='absolute left-4 top-1/2 -translate-y-1/2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </span>
                                <input 
                                    type="email" 
                                    placeholder="Email address"
                                    onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                                    value={formdata.email}
                                    className="w-full py-3 px-12 rounded-lg bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#ffd401] focus:ring-1 focus:ring-[#ffd401] transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div className='relative'>
                                <span className='absolute left-4 top-1/2 -translate-y-1/2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </span>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                                        value={formdata.password}
                                        className="w-full py-3 px-12 rounded-lg bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#ffd401] focus:ring-1 focus:ring-[#ffd401] transition-all placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffd401] transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <button 
                                onClick={handleLogin}
                                className='w-full bg-[#ffd401] mt-5 text-gray-900 py-3 px-8 rounded-lg font-medium
                                relative overflow-hidden
                                transition-all duration-300 ease-in-out
                                hover:shadow-[0_8px_16px_rgba(255,212,1,0.4)]
                                active:scale-[0.98]
                                before:content-[""]
                                before:absolute 
                                before:top-0
                                before:left-0
                                before:w-full
                                before:h-full
                                before:bg-gradient-to-r
                                before:from-transparent
                                before:via-white/30
                                before:to-transparent
                                before:-translate-x-full
                                hover:before:translate-x-full
                                before:transition-transform
                                before:duration-700
                                before:ease-in-out
                                flex items-center justify-center gap-3
                                group'>
                                
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        <span className="transform group-hover:translate-x-1 transition-transform">Sign In</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className='w-1/2 relative'>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-transparent rounded-3xl"></div>
                        <img src={bgImage} className='w-full h-full object-cover rounded-3xl'/>
                    </div>
                </div>
            </div>
        </div>
    )
}