// Import Product model
const { Product } = require('../models/product');
const { Category } = require('../models/category');
// Configuracion Router 
const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

// Get Endpoint to get Product List
// Estructura con async await.
// GET Filtro de productos por categoria usando query
router.get(`/`, async (req, res) => {
    let filter = {};
    // Check si existe categories y spliteo los strings en un array para poder enviarlos al metodo find y asi seleccionar mas de una categoria
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }
    // El metodo find trae una lista de todos los Modelos asociados, el metodo find retorna una promise.
    const productList = await Product.find(filter).populate('category');
    // ? Como elegir que valores traer de cada objeto
    // ? El valor de _id se trae por defecto para eliminarlo podemos elegir el simbolo - delante de la declaracion
    // const productList = await Product.find().select('name image -_id');

    if (!productList) {
        res.status(500).json({
            success: false
        });
    }
    res.send(productList);
});

// GET Product by ID
router.get(`/:id`, async (req, res) => {
    // El metodo find trae una lista de todos los Modelos asociados, el metodo find retorna una promise.
    // El metodo populate despliega la informacion del ObjectId al que hace referencia el valor de category.
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({
            success: false
        });
    }
    res.send(product);
});

// Post Endpoint create a new Product
router.post(`/`, async (req, res) => {

    // Check si la categoria asginada existe.
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid Category');
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();

    if (!product) {
        return res.status(500).send('The product cannot be created')
    }

    res.send(product);
});

router.put('/:id', async (req, res) => {
    // Metodo de mongoose para checkear si el id es un objeto valido.
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id');
    }
    // Check si la categoria asginada existe.
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid Category');
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        // ? Como 3er parametro configuro que la response sea la data actualizada y no la antigua.
        { new: true }
    )

    if (!product) {
        return res.status(404).send('The Product cannot be updated');
    }
    // Envio a la db la categoria actualizada.
    res.send(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'Product Deleted!'
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found!'
                })
            }
        })
        .catch(err => {
            return res.status(400).json({
                success: false,
                error: err
            })
        })
});


// GET Cantidad de productos agregados con metodo countDocuments
router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();

    if (!productCount) {
        res.status(500).json({
            success: false
        });
    }
    res.send({
        productCount: productCount
    });
});

// GET featured products
router.get(`/get/featured/:count`, async (req, res) => {
    // ? Ternario donde alojo la cantidad de elementos que voy a traer y si no elijo ninguno es 0 osea todos.
    const count = req.params.count ? req.params.count : 0
    // ? En el metodo find podemos enviar un objeto como parametro donde asignamos los valores que necesitamos filtrar de los documentos.
    // ? El simbolo + delante de count parsea a Int el string que proviene de params.
    const featuredProducts = await Product.find({ isFeatured: true }).limit(+count);

    if (!featuredProducts) {
        res.status(500).json({
            success: false
        });
    }
    res.send(featuredProducts);
});



module.exports = router;