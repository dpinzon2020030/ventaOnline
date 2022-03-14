// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();
// IMPORTACIONES RUTAS
const AdministradorRutas = require('./src/routes/administrador.routes')
const UsuarioRutas = require('./src/routes/usuario.routes')

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuarioRutas, AdministradorRutas);


module.exports = app;