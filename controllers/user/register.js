const {User} = require('../../models');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const registerUser = async (req, res, next) => {
    // collect user details from the requet body
    const {firstName, lastName, email, password} = req.body

    //check if the password length is greater than 6
    if(password.length < 6){
        // return an error if it is not
        return res.status(400).json({error: "Password is less than 6 characters"})
    }else{
        //find if a user with this email address exists already
        const existingUser = await User.findOne({ where: { email } });

        // if the user exists already return
        if(existingUser){
           return res.status(400).send({message: "User with this email exists already"})
        }else{
            // create a new user
            const workFactor = 8;
            // Combined function to generate salt and hash for privacy
            const hashedPassword = await bcrypt.hash(password, workFactor);

            if (hashedPassword){
                // create a new user
                try {
                    const user = await User.create({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword
                    })
    
                    const token = jwt.sign(
                        { user_id: user.id, email },
                        process.env.TOKEN_KEY
                    )
    
                    res.status(200).json({
                        message: "User has been successfully created!",
                        user,
                        token
                    })
                    
                } catch (error) {
                    return res.status(400).json({error: error.message})
                    
                }
    
            }else{
                return res.status(400).send(err)
            }

        }

    }
}


module.exports = registerUser