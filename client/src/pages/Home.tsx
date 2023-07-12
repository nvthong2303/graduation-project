import React from 'react';
import HeaderHome from "../components/HeaderHomePage";
import { makeStyles } from "@mui/styles";
import { Player } from '@lottiefiles/react-lottie-player';
import  lottieJson from '../assets/animation/work.json';
import Footer from '../components/Footer';
import { Grid, Button } from '@mui/material';
import LoginRegister from "../components/LoginRegister";
import { useDispatch, useSelector } from "react-redux";
import {GetInfoApi} from "../apis/user.api";
import {getInfoUserSuccess} from "../store/action/user.action";
import {GetListRoomApi} from "../apis/room.api";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto'
    },
});

export default function HomePage() {
    const classes = useStyles();
    const [isLogin, setIsLogin] = React.useState(false);
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const history = useHistory();
    const dispatch = useDispatch();

    React.useEffect(() => {
        const userId = localStorage.getItem('_user_id_')
        const token = localStorage.getItem('_token_')
        if (userId && token && !user.fullName) {
            handleGetInfo(userId, token)
        }
    }, [])

    const handleGetInfo = async (id: string, token: string) => {
        const res = await GetInfoApi(id, token)

        if (res.status === 200) {
            dispatch(getInfoUserSuccess({
                user: res.data,
                token
            }))
        } else {
            history.push('/login')
        }
    }

    React.useEffect(() => {
        if (user.email) {
            setIsLogin(true)
            history.push('/group')
        } else {
            setIsLogin(false)
        }
    }, [user.email])

    return (
        <div className={classes.root}>
             <HeaderHome />
             <Grid container spacing={2}>
                 <Grid item xs={isLogin ? 12 : 9}>
                     <div style={{ paddingBottom: '24px', paddingTop: '56px', height: 'auto', width: '100%', minHeight: '600px' }}>
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
                         {isLogin ? (
                             <Button
                                 sx={{ marginTop: '24px' }}
                                 onClick={() => {
                                     history.push('/group')
                                 }}
                             >
                                 Let's join
                             </Button>
                         ) : null}
                     </div>
                 </Grid>
                 {!isLogin ? (
                     <Grid item xs={3}>
                         <div style={{
                             width: '100%',
                             height: '100%',
                             padding: '24px 16px 32px 0px'
                         }}>
                             <LoginRegister />
                         </div>
                     </Grid>
                 ) : null}
             </Grid>
             <Footer />
        </div>
    )
}