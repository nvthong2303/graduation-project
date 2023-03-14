import React from 'react';
import { makeStyles } from "@mui/styles";
import Header from "../components/Header";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden'
    }
});

export default function EmptyLayout() {
    const classes = useStyles();


    return (
        <>
            <div className={classes.root}>
                <Header />
            </div>
        </>
    )
}