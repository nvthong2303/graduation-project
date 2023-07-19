import React from 'react';
import { makeStyles } from '@mui/styles';
import {useSelector} from "react-redux";
import {GetListPostByOption} from "../apis/post.api";
import {getInfoUserSuccess} from "../store/action/user.action";
import {useHistory} from "react-router-dom";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const useStyles = makeStyles({
    root: {
        backgroundColor: '#e2fbe3',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        marginTop: '20px',
        borderRadius: '4px',
        border: '1px solid #7f8387',
        display: 'flex',
        flexDirection: 'column',
    },
    post: {
        width: '100%',
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        border: '1px solid #7f8387',
    }
})

export default function Posts(props: any) {
    const { keyword, categories } = props;
    const classes = useStyles();
    const history = useHistory();

    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom);
    const [skip, setSkip] = React.useState(0)
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        getListPosts();
    }, []);

    const getListPosts = async () => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await GetListPostByOption({
                keyword,
                categories,
                skip,
                limit: 20
            }, token)

            if (res.status === 200) {
                console.log(res.data.data)
                setPosts(res.data.data)
            } else {
                history.push('/login')
            }
        }
    }

    const ex = {
        "author": "nvthong2303@gmail.com",
        "authorName": "nguyen van thong",
        "countLike": 0,
        "comment": [],
        "createdAt": "2023-07-19T16:15:25.863Z",
        "updatedAt": "2023-07-19T16:15:25.863Z",
        "content": "Borges luôn người kể chuyện, nhà tư tưởng và nhà triết học về một thế giới mà anh ấy đã diễn giải theo cách riêng của mình, theo cách chân thực nhất có thể. Đối với ông ấy là những câu chuyện tuyệt vời như Funes, ký ức, Tàn tích hình tròn, Phía nam nhưng, đặc biệt, The Aleph, một câu chuyện sẽ mang lại danh hiệu cho tuyển tập truyện nổi tiếng nhất của anh ấy. Được xuất bản vào năm 1945, The Aleph nói về sự vĩnh cửu, cuộc tìm kiếm không ngừng của một tác giả, người đã xác định được điểm mà tất cả các vũ trụ gặp nhau trong một tầng hầm. Bùa mê siêu hình thuần túy.",
        "categories": "lich su",
        "attachments": [],
        "_id": "64b80c1df1cef03d78215f3b",
        "liked": false
    }

    return (
        <div className={classes.root}>
            {posts.map((el: any, index) => {
                return (
                    <div className={classes.post}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        R
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    This impressive paella is a perfect party dish and a fun meal to cook
                                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                                    if you like.
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites">
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
}