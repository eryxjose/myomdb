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
            toast.error('Falha no login. Verifique suas credenciais.');
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
        toast.info('Você saiu do sistema.');
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
            console.log('Erro ao obter o usuário atual:', error);
        }
    };

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
            });
            router.navigate('/movies'); // Atualize para a rota apropriada
            store.modalStore?.closeModal(); // Verifique se modalStore está sendo usado
            toast.success('Registro realizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao realizar o registro.');
            throw error;
        }
    };

    setDisplayName = (name: string) => {
        if (this.user) {
            this.user.displayName = name;
        }
    };
}
