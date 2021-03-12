'use strict';

const express = require('express');
const router = express.Router();
const Cancion = require('../models/canciones.model');


router.post('/registro-canciones', (req, res) => {
    let cancion = JSON.parse(req.body.cancion)
    let nueva_cancion = new Cancion({
        nombre: cancion.nombre,
        duracion: cancion.duracion,
        estado: 'Activo'
    });
    cancion.artista.forEach(art => {
        nueva_cancion.artistas.push(art._id);
    });
    nueva_cancion.save((err, cancion_db) => {
        if (err) {
            //Error a nivel de la base de datos
            res.json({
                resultado: false,
                msj: 'No se pudo registrar la canción, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                resultado: true,
                msj: 'Los datos se enviaron de forma exitosa',
                cancion_db
            })
        }
    });
});

router.get('/listar-canciones', (req, res) => {
    Cancion.find().populate({ path: 'artistas' }).exec((err, lista_canciones) => {
        if (err) {
            res.json({
                msj: 'Las canciones no se pudieron listar',
                err
            });
        } else {

            res.json({
                msj: 'Las canciones se listaron existosamente',
                lista_canciones
            });
        }
    });

});
router.get('/buscar-cancion-id', (req, res) => {
    Cancion.findOne({ _id: req.query._id }, (err, cancion) => {
        if (err) {
            res.json({
                'msj': 'Ocurrió un error al buscar la canción',
                err
            });
        } else {
            if (cancion) {
                res.json({
                    'msj': 'Se encontró la canción correctamente',
                    cancion
                });
            } else {
                res.json({
                    'msj': 'No se enocntró la canción',
                });
            }
        }
    });
});
router.put('/modificar-cancion', (req, res) => {
    let cancion = JSON.parse(req.body.cancion_modificada)
    Cancion.updateOne({ _id: cancion._id }, {
        $set: {
            _id: cancion._id,
            nombre: cancion.nombre,
            duracion: cancion.duracion,
            estado: cancion.estado
        }
    }, (err, cancion_modi) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar la canción, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                msj: 'Los datos se enviaron de forma exitosa',
                cancion_modi
            })
        }
    })
})
router.delete('/eliminar-cancion', (req, res) => {
    let id = JSON.parse(req.body.cancion_eliminada);
    let cancion = Cancion.findByIdAndDelete({ _id: id }, () => {
        if (cancion) {
            res.json({
                'msj': 'Se eliminó correctamente',
            });
        } else {
            res.json({
                'msj': 'No se enocontró la canción',
            });
        }
    })

})
router.put('/estado-cancion', (req, res) => {
    let obj_cancion = JSON.parse(req.body.estado_cancion);

    let cancion_E = Cancion.findByIdAndUpdate({ _id: obj_cancion._id }, { estado: obj_cancion.estado }, (err, c) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar el estado de la canción, ocurrió el siguiente error',
                err
            })
        } else {
            if (cancion_E) {
                res.json({
                    'msj': 'Se cambió el estado de la canción correctamente',
                    c
                });
            } else {
                res.json({
                    'msj': 'No se enocontró la canción',
                });
            }
        }
    })
})
module.exports = router;