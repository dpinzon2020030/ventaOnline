const mongoose = require('mongoose')
const app = require('./app');
const Administrador = require('./src/models/usuario.model')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/controlEmpresas', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Se conectó la base de datos");
    generarAdministrador()
    app.listen(3000, (req, res) => {
        console.log("El control de empresas esta corriendo")
        
    })

}).catch(error => console.log(error));

function generarAdministrador(req, res) {

    var administradorModel = new Administrador()

    Administrador.find({ email: 'admin@kinal.edu.gt' }, (err, adminEncontrado) => {

        if (adminEncontrado) {

            return console.log('El usuario administrador principal ya existe')

        } else {
            administradorModel.nombre = 'Admin';
            administradorModel.password = '123456'
            administradorModel.email = 'admin@kinal.edu.gt'
            administradorModel.rol = 'ADMIN'


                administradorModel.save((err, administradorGuardado) => {
                    if (err) return res.status(500)
                        .send({ mensaje: 'Error en la peticion' });
                    if (!administradorGuardado) return res.status(500)
                        .send({ mensaje: 'Error al agregar el Usuario' });
                return console.log('El usuario administrador ha sido creado')
            })
        }
    })

}


