const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryt = require('bcrypt-nodejs');

// Define our model

const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function

userSchema.pre('save', function(next){

    // get access to the user model
    const user = this;
    
    // generate a salt then run callback
    bcryt.genSalt(10, function(err, salt){
        if(err){
            return next(err);
        }

        // has (encrypt) our password using the salt
        bcryt.hash(user.password, salt, null, function(err, hash){
            if(err){
                return next(err);
            }

            //overwrite plain text password with encrypted password
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcryt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err){
            return callback(err);
        }
        callback(null, isMatch);
    })
}

// Create the model class 

const ModalClass = mongoose.model('user', userSchema);

// Export the model

module.exports = ModalClass;