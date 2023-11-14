const {User, Sequelize} = require('../../models');
const Op = Sequelize.Op;
const {Token} = require("../../models");
const bcrypt = require('bcrypt');
require('dotenv').config();


const getResetPassword = async(req, res, next) => {
    const {email, token} = req.query;

    //destroy all the tokens that have expired
    await Token.destroy({
        where:{
            //uses Sequelize Op method to find which token has an expiry date less than today's date
            expiration: {[Op.lt]: Sequelize.fn('CURDATE')},
        }
    })
    //find a token associated with the email that has not expired
    const record = await Token.findOne({
        where: {
            email,
            //uses Sequelize Op method to find which token has an expiry date greater than today's date
            expiration: {[Op.gt]: Sequelize.fn('CURDATE')},
            token,
        }
    })
    
    // if token doesnt exist, tell them to redo the forgot password process
    if(!record){
        return res.status(200).send({
            message: "Token is invalid or has expired, please click on forgot password",
            showForm: false
        })
    }

    // if the token exist show the form to allow the user enter their password
    res.status(200).send({
        message: "token exist",
        record,
        showForm: true
    })
}


const postResetPassword = async(req, res, next) => {
    const {email, password1, password2} = req.body

    //check if both passowrd provided by the user are the same
    if( password1 !== password2 ){
       return res.status(400).send({message: 'Passwords do not match. Please try again'})
    }

    //check if the password is greater than 6

    if (password1.length < 6 ){
        return res.status(400).send({message: 'Password does not meet the minimum requirements'})
    }

    //find the reset token associated with this email
    const token = await Token.findOne({
        where: {
            email
        }

    })

    // if token doesnt exist, tell them to redo the forgot password process
    if (!token){
       return res.status(400).send({message: 'Token is invalid or has expired. Please try the reset process again'})
    }else{
        try {
            const workFactor = 8;
            // Combined function to generate salt and hash for privacy
            const newPassword = await bcrypt.hash(password1, workFactor);

            //update the user password

            const updateUserPassword = await User.update(
                {
                    password: newPassword
                },
                {
                    where: {
                        email
                    }
                }
            
            )
        
           return res.status(200).send(
                {
                    updateUserPassword,
                    message: 'Password has been reset. Please continue with your new password.'
                }
            )
        
        
        } catch (error) {
           return res.status(400).send({
            error,
            message: 'Error updating the password'}) 
        }
    }

    
}



module.exports = {getResetPassword, postResetPassword}