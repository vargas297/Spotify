'use strict';

const express = require('express');
const router = express.Router();
const Artista = require('../models/artistas.model');


router.post('/registro-artistas', (req, res) => {
    let artista = JSON.parse(req.body.artista)
    let nuevo_artista = new Artista({
        nombre: artista.nombre,
        disquera: artista.disquera,
        fecha_nacimiento: artista.fecha_nacimiento,
        edad: artista.edad,
        estado: 'Activo'
    });
    nuevo_artista.save((err, artista_db) => {
        if (err) {
            //Error a nivel de la base de datos
            res.json({
                resultado: false,
                msj: 'No se pudo registrar el artista, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                resultado: true,
                msj: 'Los datos se enviaron de forma exitosa',
                artista_db
            })
        }
    });
});

router.get('/listar-artistas', (req, res) => {
    Artista.find((err, lista_artistas) => {
        if (err) {
            //Error a nivel de la base de datos
            res.json({
                resultado: false,
                msj: 'No se pudieron listar los artistas',
                err
            })
        } else {
            res.json({
                resultado: true,
                msj: 'Los artistas se listaron existosamente',
                lista_artistas
            })
        }
    });
});

router.get('/buscar-artista-id', (req, res) => {
    Artista.findOne({ _id: req.query._id }, (err, artista) => {
        if (err) {
            res.json({
                'msj': 'Ocurrió un error al buscar el artista',
                err
            });
        } else {
            if (artista) {
                res.json({
                    'msj': 'Se encontró el artista correctamente',
                    artista
                });
            } else {
                res.json({
                    'msj': 'No se enocntró el artista',
                });
            }
        }
    });
});

router.put('/modificar-artista', (req, res) => {
    let artista = JSON.parse(req.body.artista_modificado)
    Artista.updateOne({ _id: artista._id }, {
        $set: {
            _id: artista._id,
            nombre: artista.nombre,
            disquera: artista.disquera,
            fecha_nacimiento: artista.fecha_nacimiento,
            edad: artista.edad,
            estado: artista.estado
        }
    }, (err, artista_modi) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar el artista, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                msj: 'Los datos se enviaron de forma exitosa',
                artista_modi
            })
        }
    })
})

router.delete('/eliminar-artista', (req, res) => {
    let id = JSON.parse(req.body.artista_eliminado);
    let artista = Artista.findByIdAndDelete({ _id: id }, () => {
        if (artista) {
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

router.put('/estado-artista', (req, res) => {
    let obj_artista = JSON.parse(req.body.estado_artista);

    let artista_E = Artista.findByIdAndUpdate({ _id: obj_artista._id }, { estado: obj_artista.estado }, (err, artista) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar el estado del artista, ocurrió el siguiente error',
                err
            })
        } else {
            if (artista_E) {
                res.json({
                    'msj': 'Se cambió el estado del artista correctamente',
                    artista
                });
            } else {
                res.json({
                    'msj': 'No se enocontró el artista',
                });
            }
        }
    })
})

module.exports = router;