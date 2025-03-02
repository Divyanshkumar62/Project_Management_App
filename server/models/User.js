const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }, 
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "TeamMember"],
        default: "TeamMember"
    },
    profilePicture: {
        type: String,
        default: '',
    }
}, {timestamps: true})

userSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err){
        next(err)
    }
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)