const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function(req, res, next){
    
    /*User has already had their email and password auth id
    we just need to given them a token*/
    res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next){

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(422).send({error: 'you must provide email and password'});
    }
    
    // See if a user with the given email already exits
    User.findOne({email: email}, function(err, existingUser){
        if(err){
            return next(err);
        }

        //If a user with email does exists, return an error
        if(existingUser){
            return res.status(422).send({error: 'Email is in use'});
        }

        // if a user with given email does not exists, create ans save user record

        const user = new User({
            email: email,
            password: password
        });

        user.save(function(err){
            if(err){
                return next(err);
            }

            // Respons to request indicatig the user was created

            res.json({token: tokenForUser(user)});
        });

    })
}