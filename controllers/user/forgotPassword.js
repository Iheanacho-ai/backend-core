const {User, Sequelize} = require('../../models');
const Op = Sequelize.Op;
const {Token} = require("../../models");
require('dotenv').config();
const sendEmail = require('../../utils/sendEmail');
const crypto = require("crypto");


const forgotPassword = async (req, res) => {

    try {
        const {email} = req.body;
        
        console.log(email, 'email getting passed in the function')
        // check if a user with this email address exists already
        
        try {
            const existingUser = await User.findOne({ where: { email } });
            console.log(existingUser, 'existing user')
        
            if(!existingUser){
                return res.status(400).send({message: 'User with this email does not exist'})
            } 

            try {
                //token expires after one hour
                const expireDate = new Date(new Date().getTime() + (60 * 60 * 1000));
                
                //destroy existing tokens with this email
                await Token.destroy({
                    where:{
                        email
                    }
                })
        
                //create a new token
              
                const token =  await Token.create({
                    email,
                    expiration: expireDate,
                    token: crypto.randomBytes(32).toString("hex"),
                });
        
                console.log(token)
              
                //link to send to the user's email for reset
                const link = 'To reset your password, please click the link below.\n\nhttps://'+process.env.DOMAIN+'/user/reset_password?token='+encodeURIComponent(token.token)+'&email='+email;
        
                // to check if it works
                res.status(200).send({
                    message: "Yay it works",
                    token,
                    link
                })
                //send this data to the email
                await sendEmail(email, "Password reset", link);
                return res.json(200).send('Password reset link sent to your email account');
                
            } catch (error) {
                console.log(error, 'error creating a token')
            }
            
        } catch (error) {
            console.log(error, 'error finding the User')
            
        }
       
        
    } catch (error) {
        return res.status(400).send({message: error})
    }

}

module.exports = forgotPassword;