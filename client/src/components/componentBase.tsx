import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
    },
})

export default function Base(props: any) {
    const classes = useStyles();

    return (
        <>base</>
    )
}