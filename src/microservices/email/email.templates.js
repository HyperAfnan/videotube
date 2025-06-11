export const templates = {
	registration: (username, confirmationToken) => ({
		subject: `Email Verification ${username} | Welcome to VideoTube`,
		html: `<p> Hey, your verification link is http://localhost:5000/api/v1/user/confirmEmail/${confirmationToken}</p>`,
	}),

   resetPassword: (forgotPasswordToken) => ({
      subject: `VideoTube Reset Password Requested`,
		html: `<p> Hey, your reset password link is http://localhost:5000/api/v1/user/resetPassword/${forgotPasswordToken}</p>`,
   })
};
