'use strict';

const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarios.model');


router.post('/registro-usuario', (req, res) => {
    let usuario = JSON.parse(req.body.usuario)
    let nuevo_usuario = new Usuario({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        fecha_nacimiento: usuario.fecha_nacimiento,
        correo: usuario.correo,
        genero: usuario.genero,
        tipo: usuario.tipo,
        contrasenia: usuario.contrasenia,
        estado: 'Activo'
    });
    nuevo_usuario.save((err, usuario_db) => {
        if (err) {
            //Error a nivel de la base de datos
            res.json({
                resultado: false,
                msj: 'No se pudo registrar el usuario, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                resultado: true,
                msj: 'Los datos se enviaron de forma exitosa',
                usuario_db
            })
        }
    });
});

router.get('/listar-usuarios', (req, res) => {
    Usuario.find((err, lista_usuarios) => {
        if (err) {
            //Error a nivel de la base de datos
            res.json({
                resultado: false,
                msj: 'No se pudieron registrar los usuarios',
                err
            })
        } else {
            res.json({
                resultado: true,
                msj: 'Los usuarios se listaron existosamente',
                lista_usuarios
            })
        }
    });
});

router.post('/validar-credenciales', (req, res) => {
    Usuario.findOne({ correo: req.body.correo }).then(
        function(usuario) {
            if (usuario) {
                if (usuario.contrasenia == req.body.contrasenia) {
                    res.json({
                        success: true,
                        usuario: usuario
                    })
                } else {
                    res.json({
                        success: false
                    })
                }
            } else {
                res.json({
                    success: false,
                    msj: 'El usuario no existe'
                });
            }
        }
    )
});
router.get('/buscar-usuario-id', (req, res) => {
    Usuario.findOne({ _id: req.query._id }, (err, usuario) => {
        if (err) {
            res.json({
                'msj': 'Ocurrió un error al buscar al usuario',
                err
            });
        } else {
            if (usuario) {
                res.json({
                    'msj': 'Se encontró el usuario correctamente',
                    usuario
                });
            } else {
                res.json({
                    'msj': 'No se enocntró el usuario',
                });
            }
        }
    });
});

router.put('/modificar-usuario', (req, res) => {
    let usuario = JSON.parse(req.body.usuario_modificado)
    Usuario.updateOne({ _id: usuario._id }, {
        $set: {
            _id: usuario._id,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            fecha_nacimiento: usuario.fecha_nacimiento,
            correo: usuario.correo,
            genero: usuario.genero,
            tipo: usuario.tipo,
            contrasenia: usuario.contrasenia,
            estado: usuario.estado
        }
    }, (err, usuario_modi) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar el usuario, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                msj: 'Los datos se enviaron de forma exitosa',
                usuario_modi
            })
        }
    })
})

router.delete('/eliminar-usuario', (req, res) => {
    let id = JSON.parse(req.body.usuario_eliminado);
    let usuario = Usuario.findByIdAndDelete({ _id: id }, () => {
        if (usuario) {
            res.json({
                'msj': 'Se eliminó correctamente',
            });
        } else {
            res.json({
                'msj': 'No se encontró el usuario',
            });
        }
    })

})

router.put('/estado-usuario', (req, res) => {
    let obj_usuario = JSON.parse(req.body.estado_usuario);

    let usuario_E = Usuario.findByIdAndUpdate({ _id: obj_usuario._id }, { estado: obj_usuario.estado }, (err, usuario) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar el estado del usuario, ocurrió el siguiente error',
                err
            })
        } else {
            if (usuario_E) {
                res.json({
                    'msj': 'Se cambió el estado del usuario correctamente',
                    usuario
                });
            } else {
                res.json({
                    'msj': 'No se enocontró el usuario',
                });
            }
        }
    })
})

module.exports = router;