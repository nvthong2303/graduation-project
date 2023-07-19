import React from 'react';
import { makeStyles } from '@mui/styles';
import {useSelector} from "react-redux";
import {CommentPostAPI, DeletePostAPI, GetListPostByOption, LikePostAPI} from "../apis/post.api";
import {getInfoUserSuccess} from "../store/action/user.action";
import {useHistory} from "react-router-dom";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Chip,
    Pagination,
    TextField,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Divider, MenuItem, Menu
} from "@mui/material";
import {useSnackbar} from "notistack";
import _ from "lodash";
import DialogDeletePost from "./Dialog/DialogDeletePost";

const useStyles = makeStyles({
    root: {
        scrollBehavior: 'smooth',
        backgroundColor: '#e2fbe3',
        width: '100%',
        marginTop: '20px',
        borderRadius: '4px',
        border: '1px solid #7f8387',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'hidden',
        '&:hover': {
            overflowY: 'auto'
        },
        '&:hover&::-webkit-scrollbar': {
            width: 10
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#bdbdbd',
            borderRadius: 10
        }
    },
    post: {
        width: '100%',
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
    },
    card: {
        border: '1px solid #7f8387',
    },
    avatar: {
        display: 'flex',
        alignItems: 'center'
    },
    commentBox: {
        display: 'flex',
        padding: '0 20px 10px 10px',
        flexDirection: "column"
    },
    input: {
        marginTop: '10px',
        height: '36px !important',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px !important',
        marginLeft: '12px'
    },
    comment: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: '12px'
    }
})

export default function Posts(props: any) {
    const { keyword, categories, setPostUpdate } = props;
    const classes = useStyles();
    const history = useHistory();
    const limit = 10;

    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom);
    const [page, setPage] = React.useState(1)
    const [posts, setPosts] = React.useState<any[]>([]);
    const [total, setTotal] = React.useState(0);
    const [comment, setComment] = React.useState('')
    const { enqueueSnackbar } = useSnackbar();
    const rootPostRef = React.useRef(null) as any;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [postSelected, setPostSelected] = React.useState<any>();

    React.useEffect(() => {
        getListPosts();
    }, [page, keyword, categories]);

    const getListPosts = async () => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await GetListPostByOption({
                keyword,
                categories,
                skip: (page - 1)*limit,
                limit
            }, token)

            if (res.status === 200) {
                console.log(res.data.data)
                setPosts(res.data.data)
                setTotal(Math.floor(res.data.total / limit) + 1)
            }
        } else {
            history.push('/login')
        }
    }

    const convertCreatedAt = (date: string) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = months[dateObj.getMonth()];
        const day = dateObj.getDate();

        return `${month} ${day}, ${year}`;
    }

    const handleLike = async (el: any) => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await LikePostAPI(el._id, token)

            if (res.status === 200) {
                enqueueSnackbar(res.data.message === 'liked' ? 'Like success' : 'UnLike Success', {
                    variant: 'success',
                    autoHideDuration: 1000
                });
                const newPosts = posts.map((p: any) => {
                    if (p._id === el._id) {
                        p.liked = res.data.message === 'liked';
                        if (res.data.message === 'liked') {
                            p.countLike += 1
                        } else {
                            p.countLike -= 1
                        }
                    }
                    return p
                })
                setPosts(newPosts)
            } else {
                enqueueSnackbar(res.data.message === 'liked' ? 'Like failed' : 'UnLike failed', {
                    variant: 'error',
                    autoHideDuration: 1000
                });
            }
        }
    }

    function handleKeyDown(event: any, post: any) {
        if (event.shiftKey && event.keyCode === 13) {
        } else if (event.keyCode === 13) {
            event.preventDefault();
            handleComment(post)
        }
    }

    const handleComment = async (post: any) => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await CommentPostAPI(comment, post._id, token)

            if (res.status === 200) {
                const newPosts = posts.map((p: any) => {
                    setComment('')
                    if (p._id === post._id) {
                        p.comment.push({
                            content: comment,
                            author: infoUser.email,
                            authorName: infoUser.fullName,
                            createdAt: Date.now()
                        })
                        console.log(p)
                    }
                    return p
                })
                setPosts(newPosts)
            }
        }
    }

    const onChangePage = (event: any, page: number) => {
        setPage(page)
        rootPostRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleOpenPopup = (event: React.MouseEvent<HTMLElement>, post: any) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
        setPostSelected(post)

    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
    }

    const handleDeletePost = () => {
        setOpenDelete(true)
    }

    const handleUpdatePost = (post: any) => {
        setPostUpdate(post)
    }

    const handleDelete = async () => {
        const token = localStorage.getItem('_token_')

        if (token) {
            const res = await DeletePostAPI(postSelected._id, token)

            if (res.status === 200) {
                setOpenDelete(false)
                handleClose()
                getListPosts();
                enqueueSnackbar('Delete Success', {
                    variant: 'success',
                    autoHideDuration: 1000
                });
            } else {
                enqueueSnackbar('Delete failed', {
                    variant: 'error',
                    autoHideDuration: 1000
                });
            }
        }
    }

    return (
        <div className={classes.root} ref={rootPostRef}>
            {posts.map((el: any, index) => {
                return (
                    <div key={index} className={classes.post}>
                        <Card className={classes.card}>
                            <CardHeader
                                sx={{ padding: '8px 12px !important'}}
                                avatar={
                                    <div className={classes.avatar}>
                                        <Avatar aria-label="recipe">
                                            {el.authorName[0]}
                                        </Avatar>
                                        <div style={{ marginLeft:'12px', display: 'flex', flexDirection: 'column'}}>
                                            <Typography variant="caption" display="block" gutterBottom>
                                                {el.authorName}
                                            </Typography>
                                            <Typography variant="caption" display="block" gutterBottom>
                                                {convertCreatedAt(el.createdAt)}
                                            </Typography>
                                        </div>
                                    </div>
                                }
                                action={
                                el.author === infoUser.email ? (
                                    <IconButton
                                        aria-label="settings"
                                        onClick={(event) => handleOpenPopup(event, el)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    ) : null
                                }
                                title={el.title}
                                subheader={<Chip sx={{ height: '18px', backgroundColor: '#54dff5' }} label={el.categories} />}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {el.content}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites" onClick={() => handleLike(el)}>
                                    <FavoriteIcon sx={{ color: el.liked ? 'red' : '#bdbdbd' }} />
                                </IconButton>
                                <p>{el.countLike}</p>
                                <IconButton aria-label="share">
                                    <CommentIcon />
                                </IconButton>
                                <p>{el.comment.length}</p>
                            </CardActions>
                            <Divider />
                            <div className={classes.commentBox}>
                                {el.comment.map((cmt: any, index: number) => (
                                    <div className={classes.comment} key={index}>
                                        <Avatar aria-label="recipe" sx={{ marginRight: '12px' }}>
                                            {cmt.authorName?.[0] ?? 'Z'}
                                        </Avatar>
                                        <Typography variant="subtitle2">
                                            {cmt.authorName}:
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginLeft: '12px'}}>
                                            {cmt.content}
                                        </Typography>
                                    </div>
                                ))}
                                <div className={classes.comment}>
                                    <Avatar aria-label="recipe" sx={{ marginRight: '12px' }}>
                                        {infoUser.fullName?.[0] ?? 'X'}
                                    </Avatar>
                                    <TextField
                                        className={classes.input}
                                        placeholder="Write a comment ..."
                                        size="small"
                                        value={comment}
                                        onKeyDown={(event) => handleKeyDown(event, el)}
                                        onChange={(event: any) => setComment(event.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            })}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '60px !important', padding: '12px' }}>
                <Pagination count={total} page={page} siblingCount={3} onChange={onChangePage} />
            </div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
                <MenuItem onClick={handleUpdatePost}>Update</MenuItem>
            </Menu>
            {openDelete ? (
                <DialogDeletePost
                    open={openDelete}
                    onClose={() => {
                        setOpenDelete(false)
                        handleClose()
                    }}
                    post={postSelected}
                    handleDelete={handleDelete} />
            ) : null}
        </div>
    )
}