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
    usuario.listas.forEach(lista => {
        nuevo_usuario.listas.push(lista._id);
    });
    usuario.canciones_favoritas.forEach(cancion_fav => {
        nuevo_usuario.canciones_favoritas.push(cancion_fav._id);
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
    Usuario.find().populate([{
            path: 'listas',
            populate: {
                path: 'lista_canciones',
                model: 'Cancion',
                populate: {
                    path: 'artistas',
                    model: 'Artista'
                }
            },

        }])
        .exec((err, lista) => {
            if (err) {
                res.json({
                    msj: 'Los usuarios no se pudieron listar',
                    err
                });
            } else {
                res.json({
                    lista
                });
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
            listas: usuario.listas,
            canciones_favoritas: usuario.canciones_favoritas,
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

router.put('/eliminar-lista-usuario', (req, res) => {
    let lista_eliminar = JSON.parse(req.body.lista);
    Usuario.findById(req.body._id, (err, usuario) => {
        if (err) {
            res.json({
                'msj': 'La lista no se encontró',
                err
            });
        } else {

            usuario.listas.pull(lista_eliminar);

            usuario.save((err, usuario) => {
                if (err) {
                    res.json({
                        'msj': 'La lista no se pudo registrar',
                        err
                    });
                } else {
                    res.json({
                        'msj': 'La lista se registró correctamente',
                        usuario
                    });
                }
            })
        }
    })

})

router.put('/eliminar-cancion-favorita', (req, res) => {
    let cancion_fav_eliminar = JSON.parse(req.body.cancion);
    Usuario.findById(req.body._id, (err, usuario) => {
        if (err) {
            res.json({
                'msj': 'La canción favorita no se encontró',
                err
            });
        } else {

            usuario.canciones_favoritas.pull(cancion_fav_eliminar);

            usuario.save((err, usuario) => {
                if (err) {
                    res.json({
                        'msj': 'La canción no se pudo registrar',
                        err
                    });
                } else {
                    res.json({
                        'msj': 'La canción se registró correctamente',
                        usuario
                    });
                }
            })
        }
    })

})

module.exports = router;