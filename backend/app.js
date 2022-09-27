const express = require('express');
const app =  express();
// ? Middleware to log HTTP requests
const morgan = require('morgan');
// ? Connect to the MongoDB database
const mongoose = require('mongoose');
// ? Control de acceso HTTP
const cors = require('cors');

// ? DOTENV For use enviroment variables
require('dotenv/config');

// * Cors setup
app.use(cors());
app.options('*', cors());


// * Middleware body parser
app.use(express.json());
//  ? Options config in parameters to format the log.
app.use(morgan('tiny'));


// * Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);



// * Data Base Connection 
/**
 * @param 1  String with de name of cluster, username, password and collection name
 * @param 2 Object with config options
 */

mongoose.connect(process.env.CONNECTION_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eShopDataBase'
})
.then(() => {
    console.log('Database Connection is ready...');
})
.catch((error) => {
    console.log(error);
})

app.listen(3000, () => {
    console.log(
        'Server running on http://localhost:3000'
        );
});

