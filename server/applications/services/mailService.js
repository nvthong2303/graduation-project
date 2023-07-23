export default function mailService(service) {

    const sendMailForgetPassword = (newPassword, email) => {
        console.log(service)

        return service.sendMailResetPassword(newPassword, email)
    };


    return {
        sendMailForgetPassword
    }
}