import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt'); // Definido apenas como string | null
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        // Reagir a alterações no token e sincronizar com localStorage
        reaction(
            () => this.token,
            (token) => {
                if (token) {
                    localStorage.setItem('jwt', token);
                } else {
                    localStorage.removeItem('jwt');
                }
            }
        );
    }

    setServerError = (error: ServerError) => {
        this.error = error;
        console.error("Server error captured:", error); // Adicionado log de erro
    };

    setToken = (token: string | null) => {
        this.token = token;
    };

    setAppLoaded = () => {
        this.appLoaded = true;
    };
}
