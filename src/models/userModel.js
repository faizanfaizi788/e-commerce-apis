import mongoose from 'mongoose';  
import bcrypt from 'bcryptjs';  

const { Schema } = mongoose;  

// Define the user schema  
const userSchema = new Schema({  
  name: {  
    type: String,  
    required: true, // Ensure name is required  
  },  
  email: {  
    type: String,  
    required: true,  
    unique: true, // Ensure email is unique  
  },  
  password: {  
    type: String,  
    required: true,  
  },  
});  

// Hash the password before saving the user  
userSchema.pre('save', async function (next) {  
  if (!this.isModified('password')) {  
    return next();  
  }  
  const salt = await bcrypt.genSalt(10);  
  this.password = await bcrypt.hash(this.password, salt);  
  next(); // Call next here to continue the middleware chain  
});  

// Method to compare passwords  
userSchema.methods.matchPassword = async function (password) {  
  return await bcrypt.compare(password, this.password);  
};  

// Create the User model  
const User = mongoose.model('User', userSchema);  

// Export the User model  
export default User;