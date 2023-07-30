import React from 'react';
import { makeStyles } from '@mui/styles';
import {useDispatch, useSelector} from "react-redux";
import {GetInfoApi} from "../apis/user.api";
import {getInfoUserSuccess} from "../store/action/user.action";
import {useHistory} from "react-router-dom";
import Header from "../components/Header";
import {
    Box,
    Button,
    Grid,
    Pagination
} from "@mui/material";
import LeftPostPage from "../components/LeftPostPage";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ListCategory from "../components/ListCategory";
import Posts from "../components/Posts";

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #ffe7ec 30%, #e7b59b 90%)',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto'
    },
    search: {
        width: '100%',
        height: '80px',
        paddingTop: '10px',
        paddingLeft: '30px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#e2fbe3',
        borderBottom: '1px solid #7f8387'
    },
    workSpace: {
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
    },
    listCategory: {
    },
    posts: {
        padding: '40px 20px 50px 20px',
        height: '100%'
    },
    author: {

    },
    inputSearch: {
        marginTop: '10px',
        height: '36px !important',
        width: '500px',
        backgroundColor: 'white',
        borderRadius: '8px !important'
    },
    buttonCreate: {
        fontSize: '14px',
        marginLeft: '20px'
    }
})

export default function General(props: any) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const [categoriesSelected, setCategoriesSelected] = React.useState<any[]>([])
    const [keyword, setKeyword] = React.useState('');
    const [postUpdate, setPostUpdate] = React.useState<any>(null);
    const [refresh, setRefresh] = React.useState(false);

    React.useEffect(() => {
        const userId = localStorage.getItem('_user_id_')
        const token = localStorage.getItem('_token_')
        if (userId && token && !user.fullName) {
            handleGetInfo(userId, token)
        }
    }, [])

    const handleGetInfo = async (id: string, token: string) => {
        const res = await GetInfoApi(id, token)

        if (res.status === 200 && res.data) {
            dispatch(getInfoUserSuccess({
                user: res.data,
                token
            }))
        } else {
            history.push('/login')
        }
    }

    const handleUpdate = (post: any) => {
        setPostUpdate(post)
    }

    return (
        <div className={classes.root}>
            <Header />
            <Grid
                className={classes.workSpace}
                container
                spacing={2}
            >
                <Grid
                    className={classes.listCategory}
                    item
                    xs={3}
                >
                    <ListCategory
                        item={categoriesSelected}
                        setItem={setCategoriesSelected}
                        keyword={keyword}
                        setKeyword={setKeyword}
                    />
                </Grid>
                <Grid
                    className={classes.posts}
                    item
                    xs={6}
                >
                    <Posts
                        keyword={keyword}
                        categories={categoriesSelected.map(el=> el.category).toString()}
                        setPostUpdate={handleUpdate}
                        refresh={refresh}
                    />
                </Grid>
                <Grid
                    className={classes.author}
                    item
                    xs={3}
                >
                    <LeftPostPage post={postUpdate} setKeyword={setKeyword} setRefresh={setRefresh}/>
                </Grid>
            </Grid>
        </div>
    )
}