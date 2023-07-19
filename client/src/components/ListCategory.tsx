import React from 'react';
import { makeStyles } from '@mui/styles';
import {Box, Chip, Typography, Divider} from "@mui/material";
import {GetListCategoryApi} from "../apis/post.api";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'inline-block',
        padding: '10px 8px'
    },
})

export default function ListCategory(props: any) {
    const { setItem, item } = props;
    const classes = useStyles();
    const [categories, setCategories] = React.useState<{ category: string, count: number}[]>([]);
    const history = useHistory();

    React.useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await GetListCategoryApi(token)

            if (res.status === 200) {
                setCategories(res.data.data)
            }

        } else {
            history.push('/login')
        }
    }

    const select = (el: any) => {
        if (item.map((el: any) => el.category).includes(el.category)) return
        setItem([...item, el])
    }

    return (
        <Box className={classes.root}>
            <Typography>Categories: </Typography>
            <Divider />
            {categories.map(el => (
                <Chip sx={{ marginRight: '8px', marginTop: '8px', backgroundColor: '#54dff5' }} onClick={() => select(el)} label={el.category} />
            )) }
        </Box>
    )
}