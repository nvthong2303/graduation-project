const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

import config from '../../config/config';

export default function mailService() {
    const sendMailResetPassword = async (newPassword, email) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.EMAIL,
                    pass: config.PASSWORD
                }
            });

            const content = `
        <!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" viewBox="0 0 512 512">
                                        <defs>
                                            <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
                                                <stop offset="0%" stop-color="#007B55"></stop>
                                                <stop offset="100%" stop-color="#00AB55"></stop>
                                            </linearGradient>
                                            <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
                                                <stop offset="0%" stop-color="#5BE584"></stop>
                                                <stop offset="100%" stop-color="#00AB55"></stop>
                                            </linearGradient>
                                            <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
                                                <stop offset="0%" stop-color="#5BE584"></stop>
                                                <stop offset="100%" stop-color="#00AB55"></stop>
                                            </linearGradient>
                                        </defs>
                                        <g fill="#00AB55" fill-rule="evenodd" stroke="none" stroke-width="1">
                                            <path fill="url(#BG1)"
                                                d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z">
                                            </path>
                                            <path fill="url(#BG2)"
                                                d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994">
                                            </path>
                                            <path fill="url(#BG3)"
                                                d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48">
                                            </path>
                                        </g>
                                    </svg>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1
                                                    style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                    You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                    Here is your new password, try to log back into the system and change it
                                                    back to make it easier for you to remember
                                                </p>
                                                <p
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                    ${newPassword}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                <address>
                                <a style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;"
                                    href="mailto:nvthong2304@gmail.com">@: nvthong2303@gmail.com</a>.<br>
                            </address>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>
        `;

            const mailOptions = {
                from: config.EMAIL,
                to: email,
                subject: 'DATN-teams Reset password',
                html: content
            };

            try {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        // do something useful
                        return {
                            state: true,
                            message: 'reset password success'
                        }
                    }
                });
            } catch (error) {
                console.log('error send mail', error)
                return {
                    state: false,
                    message: 'reset password failed'
                };
            }
        } catch (e) {
            console.log('error send mail reset password')
            return {
                state: false,
                message: e
            };
        }
    }

    return {
        sendMailResetPassword
    }
}