const mongoose = require('mongoose');

// Screma & Model
const productSchema = mongoose.Schema({
   name: {
    type: String,
    required: true
   },
   description: {
    type: String,
    required: true
   },
   richDescription: {
    type: String,
    default: ''
   },
   image: {
    type: String,
    default: ''
   },
   images: [{
    type: String
   }],
   brand: {
    type: String,
    default: ''
   },
   price: {
    type: Number,
    default: 0
   },
   // ? Referenciar un atributo del esquema con otro modelo.
   category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
   },
   countInStock: {
      type: Number,
      required: true,
      // ? Set minimo y maximo de cantidad
      // TODO: Buscar mas info de la propiedad min, max.
      min: 0,
      max: 255
   },
   rating: {
      type: Number,
      default: 0
   },
   numReviews: {
      type: Number,
      default: 0
   },
   isFeatured: {
      type: Boolean,
      default: false
   },
   dateCreated: {
      type: Date,
      default: Date.now,
   }
});

// Seteo un id sin el _ para que sea enviado en la response.
productSchema.virtual('id').get(function () {
   return this._id.toHexString();
});

productSchema.set('toJSON', {
   virtuals: true,
})


// ! Cuando exportamos de esta manera debemos importar el componente como un objeto {Name}
 exports.Product = mongoose.model('Product', productSchema);
                                                                                         