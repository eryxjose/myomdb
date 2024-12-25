import { CircularProgress, Typography, Box } from "@mui/material";

interface Props {
    inverted?: boolean;
    content?: string;
}

export default function LoadingComponent({ inverted = false, content = "Loading..." }: Props) {
    return (
        <Box 
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: inverted ? "rgba(0, 0, 0, 0.8)" : "transparent",
                color: inverted ? "#fff" : "#000",
            }}
        >
            <CircularProgress color={inverted ? "inherit" : "primary"} />
            {content && (
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                    {content}
                </Typography>
            )}
        </Box>
    );
}
