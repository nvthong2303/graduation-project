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
    TextField,
    Divider,
    Chip
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
        overflow: 'hidden',
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
        padding: '40px 20px 0 20px'
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

    const handleDeleteCategory = (el: any) => {
        setCategoriesSelected(categoriesSelected.filter(_el => _el.category != el.category))
    }

    return (
        <div className={classes.root}>
            <Header />
            <Box className={classes.search} sx={{ height: categoriesSelected.length > 0 ? '120px' : '80px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                }}>
                    <TextField
                        className={classes.inputSearch}
                        placeholder="Search post by content"
                        size="small"
                    />
                    <Button
                        sx={{
                            marginLeft: '20px',
                            fontSize: '12px',
                            height: '40px'
                        }}
                        variant="contained" endIcon={<BorderColorIcon />}>
                        Create Post
                    </Button>
                </div>
                {categoriesSelected.length > 0 ?
                    <div style={{
                        width: '100%',
                        height: '40px',
                        overflowX: 'auto',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginTop: '12px'
                    }} >
                        {categoriesSelected.map(el => (
                            <Chip sx={{marginRight: '8px', backgroundColor: 'yellow' }} label={el.category} onDelete={() => handleDeleteCategory(el)} />
                        ))}
                    </div>
                    : null}
            </Box>
            <Divider />
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
                    <ListCategory item={categoriesSelected} setItem={setCategoriesSelected}/>
                </Grid>
                <Grid
                    className={classes.posts}
                    item
                    xs={7}
                >
                    <Posts />
                </Grid>
                <Grid
                    className={classes.author}
                    item
                    xs={2}
                >
                    <LeftPostPage />
                </Grid>
            </Grid>
        </div>
    )
}