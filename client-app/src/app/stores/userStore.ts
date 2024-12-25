import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";
import { router } from "../router/Routes";
import { toast } from "react-toastify";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            store.favoriteStore.loadFavorites();
            store.modalStore?.closeModal(); // Verifique se modalStore está sendo usado
            router.navigate('/movies');
            console.log('Navigating to /movies'); // Atualize para a rota apropriada
        } catch (error) {
            toast.error('Login failed.');
            throw error;
        }
    };

    logout = () => {
        store.commonStore.setToken(null);
        localStorage.removeItem('jwt'); // Certifique-se de que o token seja removido
        runInAction(() => {
            this.user = null;
        });
        store.favoriteStore.clearFavorites(); 
        store.movieStore.clearSearch();
        toast.info('Logout successful.');
        router.navigate('/');
    };

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
            });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            
            // Armazena o token e atualiza o estado do usuário
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
            });
            
            // Navega para a rota de filmes
            router.navigate('/movies');
            console.log("Redirecionado para /movies"); 
            // Fecha o modal, se aplicável
            if (store.modalStore) store.modalStore.closeModal();
            
            // Exibe uma mensagem de sucesso
            toast.success('User created!');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred.');
            }
            throw error; // Relança o erro para ser tratado posteriormente
        }
    };
    

    setDisplayName = (name: string) => {
        if (this.user) {
            this.user.displayName = name;
        }
    };
}
