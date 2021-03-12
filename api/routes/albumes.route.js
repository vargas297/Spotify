'use strict';

const express = require('express');
const router = express.Router();
const Album = require('../models/albumes.model');


router.post('/registro-albumes', (req, res) => {
    let album = JSON.parse(req.body.album);
    let nuevo_album = new Album({
        nombre: album.nombre,
        fecha_lanzamiento: album.fecha_lanzamiento,
        cantidad_canciones: album.cantidad_canciones,
        duracion: album.duracion,
        estado: 'Activo'
    });
    album.artista.forEach(artista => {
        nuevo_album.artista.push(artista._id);
    });
    album.canciones.forEach(cancion => {
        nuevo_album.canciones.push(cancion._id);
    });
    nuevo_album.save((err, album_db) => {
        if (err) {
            //Error a nivel de la base de datos
            res.json({
                resultado: false,
                msj: 'No se pudo registrar el álbum, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                resultado: true,
                msj: 'Los datos se enviaron de forma exitosa',
                album_db
            })
        }
    });
});

router.get('/listar-albumes', (req, res) => {
    Album.find().populate(['artista', 'canciones']).exec((err, lista) => {
        if (err) {
            res.json({
                msj: 'Los álbumes no se pudieron listar',
                err
            });
        } else {
            res.json({
                lista
            });
        }
    });
});
router.get('/buscar-album-id', (req, res) => {
    Album.findOne({ _id: req.query._id }, (err, album) => {
        if (err) {
            res.json({
                'msj': 'Ocurrió un error al buscar el álbum',
                err
            });
        } else {
            if (album) {
                res.json({
                    'msj': 'Se encontró el álbum correctamente',
                    album
                });
            } else {
                res.json({
                    'msj': 'No se enocntró el álbum',
                });
            }
        }
    });
});
router.put('/modificar-album', (req, res) => {
    let album = JSON.parse(req.body.album_modificado)
    Album.updateOne({ _id: album._id }, {
        $set: {
            _id: album._id,
            nombre: album.nombre,
            fecha_lanzamiento: album.fecha_lanzamiento,
            cantidad_canciones: album.cantidad_canciones,
            duracion: album.duracion,
            artista: album.artista,
            canciones: album.canciones,
            estado: album.estado
        }
    }, (err, album_modi) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar el álbum, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                msj: 'Los datos se enviaron de forma exitosa',
                album_modi
            })
        }
    })
})
router.delete('/eliminar-album', (req, res) => {
    let id = JSON.parse(req.body.album_eliminado);
    let album = Album.findByIdAndDelete({ _id: id }, () => {
        if (album) {
            res.json({
                'msj': 'Se eliminó el álbum correctamente',
            });
        } else {
            res.json({
                'msj': 'No se enocntró el álbum',
            });
        }
    })
})
router.put('/estado-album', (req, res) => {
    let obj_album = JSON.parse(req.body.estado_album);

    let album_E = Album.findByIdAndUpdate({ _id: obj_album._id }, { estado: obj_album.estado }, (err, album) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar el estado del álbum, ocurrió el siguiente error',
                err
            })
        } else {
            if (album_E) {
                res.json({
                    'msj': 'Se cambió el estado del álbum correctamente',
                    album
                });
            } else {
                res.json({
                    'msj': 'No se enocontró el álbum',
                });
            }
        }
    })
})
module.exports = router;