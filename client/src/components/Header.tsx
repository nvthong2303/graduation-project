import React from 'react';
import { AppBar, Toolbar, InputBase, Typography, Button } from "@mui/material";
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import GroupsIcon from '@mui/icons-material/Groups';

const useStyles = makeStyles({
    header: {
        height: 40,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        height: '100% !important',
        minHeight: '40px !important',
        backgroundColor: '#ee7a7a'
    },
    root: {
        height: 32,
        justifyContent: 'space-between',
        display: 'flex',
        minWidth: '400px'
    },
    searchInput: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 32,
        marginLeft: '10px',
        borderRadius: 8,
        border: '0.1px solid #ccc',
        backgroundColor: '#ffffff'
    },
    homeButton: {
        display: 'flex',
        color: '#e0e0e0'
    }
})


export default function Header(props: any) {
    const classes = useStyles();

    const handleChange = (event: any) => {
        console.log(event)
    }

    return (
        <AppBar className={classes.header} position="static">
            <Toolbar className={classes.toolbar}>
                <Button className={classes.homeButton}>
                    <GroupsIcon style={{ color: '#e0e0e0' }} />
                    <Typography sx={{ color: '#e0e0e0', marginLeft: '4px' }}>Home</Typography>
                </Button>
                <div className={classes.root}>
                    <div className={classes.searchInput}>
                        <SearchIcon style={{ color: '#e0e0e0' }} />
                        <InputBase
                            fullWidth={true}
                            placeholder={'Search ...'}
                            onChange={(event: any) => handleChange(event)}
                        />
                    </div>
                </div>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}