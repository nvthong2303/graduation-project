import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '172px',
        backgroundColor: '#26272b',
        color: '#ffff',
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    technology: {
        margin: '4px auto 0px 0px',
        fontSize: '12px'
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '6px'
    },
    linkContact: {
        color: '#fe6b8b',
        textDecoration: 'none',
        marginLeft: '6px'
    }
})

function Footer() {
    const classes = useStyles();

    return (
        <footer className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={4}>
                    <div className={classes.flexColumn}>
                        <Typography style={{ textAlign: 'start' }}>
                            About Project
                        </Typography>
                        <p style={{ textAlign: 'start', fontSize: '12px' }}>
                            This is my graduation project, is a software that provides a place to
                            set up online meetings,message and exchange with friends and colleagues
                            and create classrooms where teachers can teach online in schools
                            special case.
                        </p>
                        <a
                            style={{
                                textAlign: 'start',
                                fontSize: '12px',
                                textDecoration: 'none',
                                color: '#ffff'
                            }} href='https://github.com/nvthong2303/graduation-project'>view more ...</a>
                    </div>
                </Grid>
                <Grid item xs={2} style={{ paddingLeft: '24px', height: '164px' }}>
                    <div className={classes.flexColumn}>
                        <Typography style={{ textAlign: 'start', marginBottom: '8px' }}>
                            Technologies
                        </Typography>
                        <div style={{ textAlign: 'start', display: 'flex', flexDirection: 'column', fontSize: '14px' }}>
                            <p className={classes.technology}>NodeJS + Express</p>
                            <p className={classes.technology}>ReactJs</p>
                            <p className={classes.technology}>Socket.IO + WebRTC</p>
                            <p className={classes.technology}>MongoDB</p>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <div className={classes.flexColumn}>
                        <Typography style={{ textAlign: 'start', marginBottom: '8px' }}>
                            Contact
                        </Typography>
                        <div style={{ textAlign: 'start', display: 'flex', flexDirection: 'column', fontSize: '14px' }}>
                            <div className={classes.contactItem}>
                                <FacebookIcon style={{ color: '#e0e0e0', fontSize: '14px' }} />
                                <a style={{ color: '#1197f5' }} href='https://www.facebook.com/nvthong2303/' target='blank' className={classes.linkContact}>Facebook</a>
                            </div>
                            <div className={classes.contactItem}>
                                <GitHubIcon style={{ color: '#e0e0e0', fontSize: '14px' }} />
                                <a style={{ color: '#f0f6fc' }} href='https://github.com/nvthong2303' target='blank' className={classes.linkContact}>Github</a>
                            </div>
                            <div className={classes.contactItem}>
                                <MailIcon style={{ color: '#e0e0e0', fontSize: '14px' }} />
                                <a href='mailto:nvthong2303@gmail.com' className={classes.linkContact}>nvthong2303@gmail.com</a>
                            </div>
                            <div className={classes.contactItem}>
                                <LocalPhoneIcon style={{ color: '#e0e0e0', fontSize: '14px' }} />
                                <p className={classes.linkContact} style={{ margin: '0 0 0 6px' }}>0961 001 262</p>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
        </footer>
    )
}

export default Footer