import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: 'http://localhost:5100/api',
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    setTimeout(() => {
      // toast.dismiss()
    }, 500)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const errorStatus = error.response?.status
    const errorMessages = {
      400: 'Bad request',
      401: () => {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return 'Unauthorized'
      },
      403: 'You do not have access to this page',
      404: 'Page not found',
      405: 'Method not allowed',
      406: 'Not acceptable',
      408: 'Request timeout',
      409: 'Conflict',
      410: 'Gone',
      411: 'Length required',
      412: 'Precondition failed',
      413: 'Payload too large',
      414: 'URI too long',
      415: 'Unsupported media type',
      416: 'Range not satisfiable',
      417: 'Expectation failed',
      418: 'I\'m a teapot',
      421: 'Misdirected request',
      422: 'Unprocessable entity',
      423: 'Locked',
      424: 'Failed dependency',
      425: 'Too early',
      426: 'Upgrade required',
      428: 'Precondition required',
      429: 'Too many requests',
      431: 'Request header fields too large',
      451: 'Unavailable for legal reasons',
      500: 'Internal server error',
      501: 'Not implemented',
      502: 'Bad gateway',
      503: 'Service unavailable',
      504: 'Gateway timeout',
      505: 'HTTP version not supported',
      506: 'Variant also negotiates',
      507: 'Insufficient storage',
      508: 'Loop detected',
      510: 'Not extended',
      511: 'Network authentication required',
      599: 'Network connect timeout error'
    }

    let message = error.response?.data?.message;
    
    if (!message) {
      const errorHandler = errorMessages[errorStatus as keyof typeof errorMessages];
      message = typeof errorHandler === 'function' 
        ? errorHandler()
        : errorHandler || 'An unknown error occurred';
    }
    toast.error(message)

    return Promise.reject(error)
  }
)
