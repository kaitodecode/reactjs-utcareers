import { create } from 'zustand'
import { z } from 'zod'

// Define user schema using Zod
const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: z.string()
})

type User = z.infer<typeof userSchema>

interface AuthState {
  user: User | null
  isLogged: boolean
  loginLoading: boolean
  token: string | null

  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isLogged: !!localStorage.getItem('user'),
  loginLoading: false,
  token: localStorage.getItem('token'),
  
  login: (user: User, token: string) => {
    // Validate user data
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    
    set({
      user: user,
      isLogged: true,
      loginLoading: false,
      token: token
    })
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    set({
      user: null,
      isLogged: false,
      loginLoading: false,
      token: null
    })
  }
}))
