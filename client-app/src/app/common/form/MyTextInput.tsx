import { useField } from 'formik';
import { TextField } from '@mui/material';

interface Props {
    placeholder: string;
    name: string;
    type?: string;
    label?: string;
}

export default function MyTextInput(props: Props) {
    const [field, meta] = useField(props.name);

    return (
        <TextField
            {...field}
            {...props}
            fullWidth
            variant="outlined"
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? meta.error : ''}
        />
    );
}
