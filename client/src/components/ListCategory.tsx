import React from 'react';
import { makeStyles } from '@mui/styles';
import {Box, Chip, Typography, Divider, TextField} from "@mui/material";
import {GetListCategoryApi} from "../apis/post.api";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'inline-block',
        padding: '20px 8px'
    },
    inputSearch: {
        marginTop: '10px',
        height: '36px !important',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px !important',
    },
})

export default function ListCategory(props: any) {
    const { setItem, item, keyword, setKeyword } = props;
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

    const handleDeleteCategory = (el: any) => {
        setItem(item.filter((_el: any) => _el.category != el.category))
    }

    return (
        <Box className={classes.root}>
            <TextField
                className={classes.inputSearch}
                placeholder="Search post by content"
                size="small"
                value={keyword}
                onChange={(event: any) => setKeyword(event.target.value)}
            />
            <div style={{ marginTop: '20px'}}>
                <Typography>Categories: </Typography>
                <Divider />
                {categories.map((el, index) => {
                    if (item.map((el: any) => el.category).includes(el.category)) {
                        return (
                            <Chip
                                key={index}
                                sx={{ marginRight: '8px', marginTop: '8px', backgroundColor: '#e36b6b' }}
                                label={el.category}
                                onDelete={() => handleDeleteCategory(el)}
                            />
                        )
                    } else {
                        return (
                            <Chip
                                key={index}
                                onClick={() => select(el)}
                                sx={{marginRight: '8px', marginTop: '8px', backgroundColor: '#54dff5' }}
                                label={el.category}
                            />
                        )
                    }
                })}
            </div>
        </Box>
    )
}