import React from 'react';
import { AppBar, Toolbar, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    header: {
        height: 40,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'center',
        height: '100% !important',
        minHeight: '40px !important',
        backgroundColor: '#ee7a7a'
    }
})


export default function HeaderHome(props: any) {
    const classes = useStyles();

    return (
        <AppBar className={classes.header} position="static">
            <Toolbar className={classes.toolbar}>
                <Typography sx={{ color: '#e0e0e0', marginLeft: '4px' }}>Graduation Project</Typography>
            </Toolbar>
        </AppBar>
    )
}