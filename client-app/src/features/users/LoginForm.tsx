import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Box, Button, Typography, Alert } from "@mui/material";

export default observer(function LoginForm() {
    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ email: "", password: "", error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore
                    .login(values)
                    .catch(() => setErrors({ error: "Invalid email or password" }))
            }
        >
            {({ handleSubmit, isSubmitting, errors }) => (
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
                    <Typography variant="h5" textAlign="center" color="primary" gutterBottom>
                        Acessar MyOMDB
                    </Typography>
                    <MyTextInput name="email" placeholder="Email" />
                    <MyTextInput name="password" placeholder="Password" type="password" />
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
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                    >
                        {isSubmitting ? "Acessando..." : "Login"}
                    </Button>
                </Box>
            )}
        </Formik>
    );
});
