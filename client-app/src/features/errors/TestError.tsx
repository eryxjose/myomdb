import { Button, ButtonGroup, Typography, Box, Paper } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import ValidationError from "./ValidationError";

export default function TestErrors() {
    const baseUrl = "http://localhost:5000/api/";
    const [errors, setErrors] = useState(null);

    function handleNotFound() {
        axios.get(baseUrl + "buggy/not-found").catch((err) => console.log(err.response));
    }

    function handleBadRequest() {
        axios.get(baseUrl + "buggy/bad-request").catch((err) => console.log(err.response));
    }

    function handleServerError() {
        axios.get(baseUrl + "buggy/server-error").catch((err) => console.log(err.response));
    }

    function handleUnauthorised() {
        axios.get(baseUrl + "buggy/unauthorised").catch((err) => console.log(err.response));
    }

    function handleBadGuid() {
        axios.get(baseUrl + "appointments/notaguid").catch((err) => console.log(err.response));
    }

    function handleValidationError() {
        axios.post(baseUrl + "appointments", {}).catch((err) => setErrors(err.response));
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Test Error Component
            </Typography>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <ButtonGroup variant="outlined" color="primary" fullWidth>
                    <Button onClick={handleNotFound}>Not Found</Button>
                    <Button onClick={handleBadRequest}>Bad Request</Button>
                    <Button onClick={handleValidationError}>Validation Error</Button>
                    <Button onClick={handleServerError}>Server Error</Button>
                    <Button onClick={handleUnauthorised}>Unauthorised</Button>
                    <Button onClick={handleBadGuid}>Bad Guid</Button>
                </ButtonGroup>
            </Paper>
            {errors && <ValidationError errors={errors} />}
        </Box>
    );
}
