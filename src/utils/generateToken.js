import jwt from 'jsonwebtoken';  

/**  
 * Generate a JSON Web Token for a given user ID  
 * @param {string} id - The user ID for which the token is generated  
 * @returns {string} - The generated JWT  
 */  
const generateToken = (id) => {  
  if (!id) {  
    throw new Error('User ID must be provided to generate token');  
  }  

  return jwt.sign({ id }, process.env.JWT_SECRET, {  
    expiresIn: '30d', // Token expiration time  
  });  
};  

export default generateToken;