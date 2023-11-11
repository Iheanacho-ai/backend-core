const {User} = require('../models')

const registerUser = async (req, res, next) => {
    const {firstName, lastName, email, password} = req.body

    if(password.length < 6){
        return res.status(400).json({message: "Password is less than 6 characters"})
    }else{

        try {
            const user = await User.create({
                firstName,
                lastName,
                email,
                password
            })
            res.status(200).json({
                message: "User has been successfully created!",
                user
            })
            
        } catch (error) {
            return res.status(400).json({error: error.message})
            
        }

    }
}

module.exports = {registerUser}