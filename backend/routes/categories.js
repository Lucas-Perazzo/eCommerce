const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();


// GET Categories List
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({
            success: false
        })
    }
    res.status(200).send(categoryList);
});

//GET Category By Id
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({
            success: false,
            message: 'The category with the given ID was not found'
        })
    }
    res.status(200).send(category);
})

// POST Add Category
// ? Post con async await
router.post('/', async (req, res) => {
    // Genero el objeto con los datos del frontend
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    // Genero la promesa que va a intentar guardar el documento
    category = await category.save();
    // Check si la categoria no fue creada, envio una advertencia con el codigo 404
    if (!category) {
        return res.status(404).send('The Category cannot be created');
    }
    // Envio a la db la categoria.
    res.send(category);
});

//PUT Update Category by Id
//? En el primer parametro envio el id que recupero de los params y el segundo es el objeto con la informacion que voy a actualizar.
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        // ? Como 3er parametro configuro que la response sea la data actualizada y no la antigua.
        { new: true }
    )

    if (!category) {
        return res.status(404).send('The Category cannot be updated');
    }
    // Envio a la db la categoria actualizada.
    res.send(category);
})

// DELETE Category by Id
// ? Delete con then catch
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: 'Category Deleted!'
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found!'
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

module.exports = router;