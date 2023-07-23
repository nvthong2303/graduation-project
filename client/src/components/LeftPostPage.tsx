import React from 'react';
import { makeStyles } from '@mui/styles';
import {Box, Button, TextField, Typography} from '@mui/material';
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {CreatePostAPI, UpdatePostAPI} from "../apis/post.api";
import {useSnackbar} from "notistack";

const useStyles = makeStyles({
    root: {
        height: '100%',
        width: '100%',
        padding: '20px 12px 20px 0'
    },
    box: {
        width: '100%',
        maxHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        border: '1px solid #7f8387',
        backgroundColor: '#e2fbe3',
        borderRadius: '4px',
    },
    errorMessage: {
        fontSize: '12px',
        float: 'left',
        color: '#db0000',
        margin: '2px auto 0 2px'
    }
})

export default function LeftPostPage(props: any) {
    const { post, setKeyword, setRefresh } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        formikPost.setFieldValue('title', post ? post.title : '')
        formikPost.setFieldValue('category', post ? post.category : '')
        formikPost.setFieldValue('content', post ? post.content : '')
    }, [JSON.stringify(post)])

    const sx={
        marginTop: '10px'
    }

    const formikPost = useFormik({
        initialValues: {
            title: post ? post.title : '',
            category: post ? post.category : '',
            content: post ? post.content : ''
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .max(20, "Maximum 20 characters")
                .required("Required!"),
            category: Yup.string()
                .max(20, "Maximum 20 characters")
                .required("Required!"),
            content: Yup.string()
                .required("Required!"),
        }),
        onSubmit: values => {
        }
    });

    const handleCreatePost = async () => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const post = {
                title: formikPost.values.title,
                category: formikPost.values.category,
                content: formikPost.values.content,
            }
            const res = await CreatePostAPI(post, token);

            if (res.status === 200) {
                enqueueSnackbar('Create post success', {
                    variant: 'success'
                });
                setRefresh((prev: any) => {
                    return !prev
                })
            } else {
                enqueueSnackbar('Edit post success', {
                    variant: 'error'
                });
            }
        } else {
            history.push('/login')
        }
    }

    const handleUpdatePost = async () => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const _post = {
                title: formikPost.values.title,
                category: formikPost.values.category,
                content: formikPost.values.content,
            }
            const res = await UpdatePostAPI(post.id, _post, token)

            if (res.status === 200) {
                enqueueSnackbar('Update post success', {
                    variant: 'success'
                });
                setRefresh((prev: any) => {
                    return !prev
                })
            } else {
                enqueueSnackbar('Update post success', {
                    variant: 'error'
                });
            }

        } else {
            history.push('/login')
        }
    }

    return (
        <div className={classes.root}>
            <Box className={classes.box}>
                <Typography>{post ? 'Update Post' : 'Create Post'}</Typography>
                <TextField
                    sx={sx}
                    label="Title"
                    id="outlined-size-small"
                    size="small"
                    value={formikPost.values.title}
                    disabled={post}
                    onChange={(event) => formikPost.setFieldValue('title', event.target.value)}
                />
                {formikPost.errors.title && formikPost.touched.title && (
                    <p className={classes.errorMessage}>{formikPost.errors.title}</p>
                )}
                <TextField
                    sx={sx}
                    label="Category"
                    id="outlined-size-small"
                    size="small"
                    value={formikPost.values.category}
                    onChange={(event) => formikPost.setFieldValue('category', event.target.value)}
                />
                {formikPost.errors.category && formikPost.touched.category && (
                    <p className={classes.errorMessage}>{formikPost.errors.category}</p>
                )}
                <TextField
                    sx={sx}
                    label="Content"
                    id="outlined-size-small"
                    size="small"
                    multiline={true}
                    rows={6}
                    value={formikPost.values.content}
                    onChange={(event) => formikPost.setFieldValue('content', event.target.value)}
                />
                {formikPost.errors.content && formikPost.touched.content && (
                    <p className={classes.errorMessage}>{formikPost.errors.content}</p>
                )}
                <Button sx={{ marginTop: '20px' }} variant="outlined" onClick={() => {
                    if (post) {
                        handleUpdatePost();
                    } else {
                        handleCreatePost();
                    }
                }
                }>{post ? 'Update' : 'Create'}</Button>
            </Box>
        </div>
    )
}