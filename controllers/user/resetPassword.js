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
            expiration: {[Op.lt]: Sequelize.fn('CURDATE')},
        }
    })
    //find a token associated with the email that has not expired
    const record = await Token.findOne({
        where: {
            email,
            expiration: {[Op.gt]: Sequelize.fn('CURDATE')},
            token,
        }
    })

    if(!record){
        return res.render('user/reset-password', {
            message: 'Token has expired. Please try password reset again.',
            showForm: false
        });
    }

    res.render('user/reset-password', {
        showForm: true,
        record: record
    });
}


const postResetPassword = async(req, res, next) => {
    const {email, password1, password2} = req.body

    //check if both passowrd provided by the user are the same
    if( password1 !== password2 ){
       return res.status(400).send({message: 'Passwords do not match. Please try again'})
    }

    //check if the password is greater than 6

    if (!password1.length > 6 ){
        return res.stautus(400).send({message: 'Password does not meet the minimum requirements'})
    }

    const token = await Token.findOne({
        where: {
            email
        }

    })

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
            console.log(error)
           return res.status(400).send({message: 'Error updating the password'}) 
        }
    }

    
}



module.exports = {getResetPassword, postResetPassword}