import { createContext, useContext } from "react";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import MovieStore from "./movieStore";
import ModalStore from "./modalStore";
import FavoriteStore from "./favoriteStore";

interface Store {
    userStore: UserStore;
    commonStore: CommonStore;
    movieStore: MovieStore;
    modalStore: ModalStore;
    favoriteStore: FavoriteStore;
}

export const store: Store = {
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    movieStore: new MovieStore(),
    modalStore: new ModalStore(),
    favoriteStore: new FavoriteStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
