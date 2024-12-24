import { Alert, AlertTitle, List, ListItem, ListItemText } from "@mui/material";

interface Props {
    errors: string[];
}

export default function ValidationError({ errors }: Props) {
    return (
        <Alert severity="error">
            <AlertTitle>Validation Error</AlertTitle>
            {errors && (
                <List>
                    {errors.map((err, i) => (
                        <ListItem key={i}>
                            <ListItemText primary={err} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Alert>
    );
}
