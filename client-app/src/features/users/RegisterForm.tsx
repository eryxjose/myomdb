import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Box, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default observer(function RegisterForm() {
    const { userStore } = useStore();
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                displayName: "",
                username: "",
                email: "",
                password: "",
                error: null,
            }}
            onSubmit={(values, { setErrors }) => userStore.register(values).then(() => navigate("/movies")).catch((error) => setErrors({ error }))}
            validationSchema={Yup.object({
                displayName: Yup.string().required("Display Name is required"),
                username: Yup.string().required("Username is required"),
                email: Yup.string()
                    .required("Email is required")
                    .email("Invalid email format"),
                password: Yup.string().required("Password is required"),
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                        maxWidth: 400,
                        mx: "auto",
                    }}
                >
                    <Typography
                        variant="h5"
                        textAlign="center"
                        color="primary"
                        gutterBottom
                    >
                        Cadastro em MyOMDB
                    </Typography>
                    <MyTextInput name="displayName" placeholder="Display Name" />
                    <MyTextInput name="username" placeholder="Username" />
                    <MyTextInput name="email" placeholder="Email" />
                    <MyTextInput
                        name="password"
                        placeholder="Password"
                        type="password"
                    />
                    {errors.error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {errors.error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!isValid || !dirty || isSubmitting}
                        sx={{ mt: 2 }}
                    >
                        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                </Box>
            )}
        </Formik>
    );
});
