import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../stores/store";

const PrivateRoute = () => {
    const { userStore } = useStore();
    return userStore.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
