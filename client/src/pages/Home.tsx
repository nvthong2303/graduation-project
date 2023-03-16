import React from 'react';
import HeaderHome from "../components/HeaderHomePage";
import { makeStyles } from "@mui/styles";
import { Player } from '@lottiefiles/react-lottie-player';
import * as lottieJson from '../assets/animation/work.json';
import Footer from '../components/Footer';
import { Grid, Button } from '@mui/material';
import LoginRegister from "../components/LoginRegister";

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
});

export default function HomePage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <HeaderHome />
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <div style={{ paddingBottom: '24px', paddingTop: '56px', height: '600px', width: '100%' }}>
                        <Player
                            controls={false}
                            autoplay
                            loop
                            src={lottieJson}
                            style={{ width: '30%' }}
                        ></Player>
                        <div
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                fontSize: 20,
                                fontWeight: 700
                            }}
                        >
                            Welcome to My Graduation Project
                        </div>
                        <div
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                fontSize: 14,
                                fontWeight: 400
                            }}
                        >
                            Let's explore my graduation project, invite your friends and create your own meeting room
                        </div>
                        <Button sx={{ marginTop: '24px' }}>Let's join</Button>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        padding: '24px 16px 32px 0px'
                    }}>
                        <LoginRegister />
                    </div>
                </Grid>
            </Grid>
            <Footer />
        </div>
    )
}