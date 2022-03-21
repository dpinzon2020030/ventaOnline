const Usuarios = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Facturas = require("../models/factura.model");

function login(req, res) {
  var parametros = req.body;
  Usuarios.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la consulta" });
    if (usuarioEncontrado !== null) {
      bcrypt.compare(
        parametros.password,
        usuarioEncontrado.password,
        (err, vertifiacionPassword) => {
          if (vertifiacionPassword !== null) {
            Facturas.find(
              { idUsuario: usuarioEncontrado._id },
              (err, facturasUsuario) => {
                if (err)
                  return res
                    .status(500)
                    .send({ mensaje: "Error en la peticion" });
                if (!facturasUsuario)
                  return res
                    .status(404)
                    .send({ mensaje: "Error en la busqueda" });

                if (parametros.obtenerToken === "true") {
                  return res
                    .status(200)
                    .send({
                      token: jwt.crearToken(usuarioEncontrado),
                      facturas: facturasUsuario,
                    });
                } else {
                  usuarioEncontrado.password = undefined;
                  return res.status(200).send({ usuario: usuarioEncontrado });
                }
              }
            );
          } else {
            return res
              .status(500)
              .send({
                mensaje: "La contraseña no coincide con el usuario logeado",
              });
          }
        }
      );
    } else {
      return res.status(200).send({ mensaje: "Los datos son incorrectos" });
    }
  });
}

function agregarUsuario(req, res) {
  var parametros = req.body;
  var modeloUsuarios = Usuarios();

  if (
    parametros.email &&
    parametros.password &&
    parametros.nombre &&
    parametros.apellido
  ) {
    if (verificacionesUsuariosGmail(parametros) === true) {
      return res
        .status(500)
        .send({ mensaje: "El correo ya se encuentra registrado" });
    } else {
      modeloUsuarios.nombre = parametros.nombre;
      modeloUsuarios.apellido = parametros.apellido;
      modeloUsuarios.email = parametros.email;
      modeloUsuarios.password = parametros.password;
      modeloUsuarios.rol = "cliente";
      bcrypt.hash(parametros.password, null, null, (err, passwordEncrypt) => {
        modeloUsuarios.password = passwordEncrypt;

        modeloUsuarios.save((err, usuarioGuardado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!usuarioGuardado)
            return res
              .status(404)
              .send({ mensaje: "Error al agregar el usuario" });


          return res.status(200).send({ usuario: usuarioGuardado });
        });
      });
    }
  } else {
    return res.status(404).send({ mensaje: "Debes llenar todos los campos" });
  }
}

function editarUsuarios(req, res) {
  var parametros = req.body;
  var idUser = req.user.sub;

  if (req.user.rol === "cliente") {
    Usuarios.findById(idUser, (err, usuariosEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!usuariosEncontrado)
        return res
          .status(500)
          .send({ mensaje: "El usuario ingresado no existe" });

      if (parametros.password || parametros.email) {
        return res
          .status(404)
          .send({ mensaje: "Estos parametros no se pueden modificar" });
      } else {
        if (parametros.rol === "administrador") {
         Usuarios.findByIdAndUpdate(
            idUser,
            parametros,
            { new: true },
            (err, usuarioModificado) => {
              if (err)
                return res
                  .status(500).send({
                    mensaje: "Error al modificar",
                  });
              if (!usuarioModificado)
                return res
                  .status(500).send({
                    mensaje: "Error al modificar al usuario",
                  });
              return res.status(200).send({ usuarios: usuarioModificado });
            }
          );
        } else {
          Usuarios.findByIdAndUpdate(
            idUser,
            parametros,
            { new: true },
            (err, usuarioModificado) => {
              if (err)
                return res
                  .status(500)
                  .send({
                    mensaje: "Error al tratar de modificar",
                  });
              if (!usuarioModificado)
                return res
                  .status(500)
                  .send({
                    mensaje: "Error al tratar de modificar",
                  });
              return res.status(200).send({ usuarios: usuarioModificado });
            }
          );
        }
      }
    });
  } else {
    return res
      .status(500)
      .send({ mensaje: "Error de credenciales" });
  }
}



module.exports = {
  login,
  agregarUsuario,
  editarUsuarios
};
