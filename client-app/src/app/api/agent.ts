import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { MovieSummary, MovieDetail } from '../models/movie';
import { FavoriteMovie } from '../models/favorite';

// const sleep = (delay: number) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, delay);
//     });
// };

// Configuração da base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

// Interceptador para incluir o token nas requisições
axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Interceptador para lidar com respostas e erros
axios.interceptors.response.use(
    async (response) => {
        //await sleep(2000); // Simular atraso, se necessário
        return response;
    },
    (error: AxiosError) => {
        console.error('Erro na requisição:', error);
        console.error('Config:', error.config);
        console.error('Resposta:', error.response);
        //return Promise.reject(error);

        const { data, status, config } = error.response! as AxiosResponse;
        switch (status) {
            case 400:
                if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                    router.navigate('/not-found');
                }
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                toast.error('Unauthorized');
                break;
            case 403:
                toast.error('Forbidden');
                break;
            case 404:
                router.navigate('/not-found');
                break;
            case 500:
                store.commonStore.setServerError(data);
                router.navigate('/server-error');
                break;
        }
        return Promise.reject(error);
    }
);

// Helper para extrair o corpo da resposta
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// Requests genéricos para chamadas HTTP
const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// Serviços relacionados a filmes
const Movies = {
    search: (title: string, page: number) =>
        requests.get<MovieSummary[]>(`/movies/search?title=${title}&page=${page}`),
    details: (id: string) => requests.get<MovieDetail>(`/movies/${id}`),
};

// Serviços relacionados a favoritos
const Favorites = {
    list: () => requests.get<FavoriteMovie[]>('/favorites'),
    add: (favorite: FavoriteMovie) => requests.post<void>('/favorites', favorite),
    remove: (id: string) => requests.del<void>(`/favorites/${id}`),
};

// Serviços relacionados a contas de usuário
const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
};

// Exportação consolidada de agentes
const agent = {
    Movies,
    Favorites,
    Account,
};

export default agent;
