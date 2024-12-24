import { Link } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function NotFound() {
    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <SearchIcon sx={{ fontSize: 80, marginBottom: 2, color: "grey.500" }} />
                <Typography variant="h4" gutterBottom>
                    Página não encontrada
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}>
                    A página que você está tentando acessar não existe ou foi removida.
                </Typography>
                <Button
                    component={Link}
                    to="/appointments"
                    variant="contained"
                    color="primary"
                >
                    Retornar para a página de agendamentos
                </Button>
            </Box>
        </Container>
    );
}
