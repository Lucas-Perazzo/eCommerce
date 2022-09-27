const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
 });
 
 userSchema.set('toJSON', {
    virtuals: true,
 })
 

// ! Cuando exportamos de esta manera debemos importar el componente como un objeto {Name}
exports.User = mongoose.model('User', userSchema);