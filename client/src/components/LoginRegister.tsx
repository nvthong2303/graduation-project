import React from 'react'
import { makeStyles } from "@mui/styles";
import { Typography, TextField, InputAdornment, IconButton, Button, Checkbox, Divider } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import teamsIcon from '../assets/images/streaming.png';
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ForgetPasswordApi, LoginApi, RegisterApi } from "../apis/user.api";
import { getInfoUserSuccess } from "../store/action/user.action";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        border: '1px solid #ee7a7a',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 24px 48px 24px'
    },
    teamsIcon: {
        width: '48px',
        height: 'auto'
    },
    form: {
        width: '100%'
    },
    input: {
        width: '100%',
    },
    button: {
        marginTop: '48px',
        backgroundColor: '#00a99d'
    },
    errorMessage: {
        fontSize: '12px',
        float: 'left',
        color: '#db0000',
        margin: '2px auto 0 2px'
    }
});
function LoginRegister() {
    const [type, setType] = React.useState<'login' | 'register' | 'forgot'>('login');
    const [showPassword, setShowPassword] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const formikLogin = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email format")
                .required("Required!"),
            password: Yup.string()
                .min(6, "Minimum 6 characters")
                .required("Required!"),
        }),
        onSubmit: values => {
            handleLogin(values)
        }
    });

    const formikForgotPassword = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email format")
                .required("Required!"),
        }),
        onSubmit: values => {
            handleForgetPassword()
        }
    });

    const formikRegister = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirm_password: ""
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .min(2, "Minimum 2 characters")
                .max(15, "Maximum 15 characters")
                .required("Required!"),
            email: Yup.string()
                .email("Invalid email format")
                .required("Required!"),
            password: Yup.string()
                .min(6, "Minimum 6 characters")
                .required("Required!"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], "Password's not match")
                .required("Required!")
        }),
        onSubmit: values => {
            console.log(formikRegister)
            // handleRegister()
        }
    });

    const handleLogin = async (data: any) => {
        try {
            const res = await LoginApi(data)

            if (res.status === 200 && res.data) {
                localStorage.setItem('_token_', res.data.token);
                localStorage.setItem('_user_id_', res.data.user._id);
                dispatch(getInfoUserSuccess(res.data))
            } else {

            }
        } catch (e: any) {
            enqueueSnackbar(e.response.data.message, {
                variant: 'error'
            });
        }

    }

    const handleRegister = async () => {
        try {
            const body = {
                username: formikRegister.values.fullName,
                password: formikRegister.values.password,
                email: formikRegister.values.email,
            }
            const res = await RegisterApi(body)

            if (res.status === 200) {
                enqueueSnackbar('Register success', {
                    variant: 'success'
                });
                formikLogin.setFieldValue('email', formikRegister.values.email)
                formikLogin.setFieldValue('password', formikRegister.values.password)
                setType('login')
            } else {
                console.log(res)
                enqueueSnackbar(res.data.message, {
                    variant: 'error'
                });
            }
        } catch (e: any) {
            enqueueSnackbar(e.response.data.message, {
                variant: 'error'
            });
        }
    }

    const handleForgetPassword = async () => {
        try {
            const res = await ForgetPasswordApi(formikForgotPassword.values.email)

            if (res.status === 200) {
                enqueueSnackbar(res.data.message, {
                    variant: 'success'
                });
                setType('login')
            } else {
                console.log(res)
                enqueueSnackbar(res.data.message, {
                    variant: 'error'
                });
            }
        } catch (e: any) {
            enqueueSnackbar(e.response.data.message, {
                variant: 'error'
            });
        }
    }

    return (
        <div className={classes.root}>
            <img className={classes.teamsIcon} src={teamsIcon} />
            {type === 'login' ? (
                <div className={classes.form}>
                    <form onSubmit={formikLogin.handleSubmit}>
                        <Typography variant='h5'>Sign In</Typography>
                        <TextField
                            className={classes.input}
                            sx={{
                                marginTop: '24px'
                            }}
                            id="input-with-icon-textfield"
                            label="Email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            value={formikLogin.values.email}
                            onChange={(event) => formikLogin.setFieldValue('email', event.target.value)}
                        />
                        {formikLogin.errors.email && formikLogin.touched.email && (
                            <p className={classes.errorMessage}>{formikLogin.errors.email}</p>
                        )}
                        <TextField
                            className={classes.input}
                            sx={{
                                marginTop: '16px'
                            }}
                            id="input-with-icon-textfield"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            variant="standard"
                            value={formikLogin.values.password}
                            onChange={(event) => formikLogin.setFieldValue('password', event.target.value)}
                        />
                        {formikLogin.errors.password && formikLogin.touched.password && (
                            <p className={classes.errorMessage}>{formikLogin.errors.password}</p>
                        )}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 0,
                                alignItems: 'center',
                                marginTop: '8px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                    checked={rememberMe}
                                    onClick={() => {
                                        setRememberMe(!rememberMe)
                                    }
                                    } />
                                <Typography variant='body2'>Remember me</Typography>
                            </div>

                            <Typography
                                onClick={() => {
                                    setType('forgot')
                                }}
                                variant='caption'
                                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >Forgot Password ?</Typography>
                        </div>
                        <Divider sx={{
                            marginTop: '16px'
                        }} />

                        <Button
                            sx={{
                                marginTop: '16px',
                                backgroundColor: '#1976d2',
                                color: '#000000'
                            }}
                            type="submit"
                            variant="outlined">Login</Button>

                        <Divider sx={{
                            marginTop: '48px'
                        }} />
                        <Typography
                            sx={{ display: 'flex', alignItems: 'center' }}
                            variant='caption'
                        >
                            Don't have a account ?
                            <p onClick={() => {
                                setType('register')
                            }} style={{ color: '#0256b9', textDecoration: 'underline', cursor: 'pointer', marginLeft: '2px' }}>Sign Up</p>
                        </Typography>
                    </form>
                </div>
            ) : type === 'register' ? (
                <div className={classes.form}>
                    <form onSubmit={formikRegister.handleSubmit}>
                        <Typography variant='h5'>Sign Up</Typography>
                        <TextField
                            className={classes.input}
                            sx={{
                                marginTop: '24px'
                            }}
                            id="input-with-icon-textfield"
                            label="Fullname"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            value={formikRegister.values.fullName}
                            onChange={(event) => formikRegister.setFieldValue('fullName', event.target.value)}
                        />
                        {formikRegister.errors.fullName && formikRegister.touched.fullName && (
                            <p className={classes.errorMessage}>{formikRegister.errors.fullName}</p>
                        )}

                        <TextField
                            className={classes.input}
                            sx={{
                                marginTop: '16px'
                            }}
                            id="input-with-icon-textfield"
                            label="Email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            value={formikRegister.values.email}
                            onChange={(event) => formikRegister.setFieldValue('email', event.target.value)}
                        />
                        {formikRegister.errors.email && formikRegister.touched.email && (
                            <p className={classes.errorMessage}>{formikRegister.errors.email}</p>
                        )}

                        <TextField
                            className={classes.input}
                            sx={{
                                marginTop: '16px'
                            }}
                            id="input-with-icon-textfield"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            variant="standard"
                            value={formikRegister.values.password}
                            onChange={(event) => formikRegister.setFieldValue('password', event.target.value)}
                        />
                        {formikRegister.errors.password && formikRegister.touched.password && (
                            <p className={classes.errorMessage}>{formikRegister.errors.password}</p>
                        )}

                        <TextField
                            className={classes.input}
                            sx={{
                                marginTop: '16px'
                            }}
                            id="input-with-icon-textfield"
                            label="Confirm password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            variant="standard"
                            value={formikRegister.values.confirm_password}
                            onChange={(event) => formikRegister.setFieldValue('confirm_password', event.target.value)}
                        />
                        {formikRegister.errors.confirm_password && formikRegister.touched.confirm_password && (
                            <p className={classes.errorMessage}>{formikRegister.errors.confirm_password}</p>
                        )}

                        <Button
                            sx={{
                                marginTop: '24px',
                                backgroundColor: '#1976d2',
                                color: '#000000'
                            }}
                            type='submit'
                            onClick={handleRegister}
                            disabled={!formikRegister.isValid}
                            variant="outlined">Register</Button>

                        <Divider sx={{
                            marginTop: '32px'
                        }} />
                        <Typography
                            sx={{ display: 'flex', alignItems: 'center' }}
                            variant='caption'
                        >
                            Already have an account ?
                            <p onClick={() => {
                                setType('login')
                            }} style={{ color: '#0256b9', textDecoration: 'underline', cursor: 'pointer', marginLeft: '2px' }}>Sign In</p>
                        </Typography>
                    </form>
                </div>
            ) : (
                <div>
                    <form onSubmit={formikForgotPassword.handleSubmit}>
                        <Typography variant='h5'>Forgot password</Typography>

                        <p style={{
                            float: 'left',
                            fontSize: '12px'
                        }}>Please enter your email, we will resend a new password to your email.</p>
                        <TextField
                            className={classes.input}
                            sx={{
                                marginTop: '24px'
                            }}
                            id="input-with-icon-textfield"
                            label="Email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            value={formikForgotPassword.values.email}
                            onChange={(event) => formikForgotPassword.setFieldValue('email', event.target.value)}
                        />
                        {formikForgotPassword.errors.email && formikForgotPassword.touched.email && (
                            <p className={classes.errorMessage}>{formikForgotPassword.errors.email}</p>
                        )}

                        <Button
                            sx={{
                                marginTop: '64px',
                                backgroundColor: '#1976d2',
                                color: '#000000'
                            }}
                            onClick={handleForgetPassword}
                            type='submit'
                            disabled={!formikForgotPassword.isValid}
                            variant="outlined">Send</Button>

                        <Divider sx={{
                            marginTop: '32px'
                        }} />
                        <Typography
                            sx={{ display: 'flex', alignItems: 'center' }}
                            variant='caption'
                        >
                            Already have an account ?
                            <p onClick={() => {
                                setType('login')
                            }} style={{ color: '#0256b9', textDecoration: 'underline', cursor: 'pointer', marginLeft: '2px' }}>Sign In</p>
                        </Typography>
                    </form>
                </div>
            )}
        </div>
    )
}

export default LoginRegister