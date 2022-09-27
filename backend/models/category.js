const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    },

})

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
 });
 
 categorySchema.set('toJSON', {
    virtuals: true,
 })
 

// ! Cuando exportamos de esta manera debemos importar el componente como un objeto {Name}
exports.Category = mongoose.model('Category', categorySchema);