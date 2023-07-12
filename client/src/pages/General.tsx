import React from 'react';
import { makeStyles } from '@mui/styles';
import {useDispatch, useSelector} from "react-redux";
import {GetInfoApi} from "../apis/user.api";
import {getInfoUserSuccess} from "../store/action/user.action";
import {useHistory} from "react-router-dom";
import Header from "../components/Header";

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
})

export default function General(props: any) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: any) => state.userReducer.userInfo);

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

    return (
        <div className={classes.root}>
            <Header />
            <div></div>
            <div></div>
        </div>
    )
}