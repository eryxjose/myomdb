import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Box, Typography, Container, Paper } from "@mui/material";

export default observer(function ServerError() {
    const { commonStore } = useStore();

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h3" component="h1" color="error" gutterBottom>
                Server Error
            </Typography>
            <Typography variant="h6" color="error" gutterBottom>
                {commonStore.error?.message || "An unexpected error occurred"}
            </Typography>
            {commonStore.error?.details && (
                <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                        Stack trace:
                    </Typography>
                    <Box component="pre" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {commonStore.error.details}
                    </Box>
                </Paper>
            )}
        </Container>
    );
});
