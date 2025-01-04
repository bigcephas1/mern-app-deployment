// schema is a field that the database will have
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true,

        unique:true
    },
    password: {
        type: String,
        required:true
    }
}, {
    timestamps:true
})
// schema hooks, this line means adding to the userschema from the user.create function
userSchema.pre('save', async function (next) {
    // this pertains to the user we're saving from the userRoute
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})
// adding methods to the userSchema
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
const User = mongoose.model('User', userSchema)
export default User


