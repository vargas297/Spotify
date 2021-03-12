'use strict';

const express = require('express');
const router = express.Router();
const Lista = require('../models/listas.model');


router.post('/registro-listas', (req, res) => {
    let lista = JSON.parse(req.body.lista)
    let nueva_lista = new Lista({
        nombre: lista.nombre,
        estado: 'Activo'
    });
    lista.lista_canciones.forEach(obj_cancion => {
        nueva_lista.lista_canciones.push(obj_cancion._id);
    });
    nueva_lista.save((err, lista_db) => {
        if (err) {
            //Error a nivel de la base de datos
            res.json({
                resultado: false,
                msj: 'No se pudo registrar la lista, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                resultado: true,
                msj: 'Los datos se enviaron de forma exitosa',
                lista_db
            })
        }
    });
});

router.get('/listar-listas', (req, res) => {
    Lista.find().populate({
        path: 'lista_canciones',
        populate: {
            path: 'artistas',
            model: 'Artista'
        }
    }).exec((err, lista) => {
        if (err) {
            res.json({
                msj: 'Las listas no se pudieron listar',
                err
            });
        } else {

            res.json({
                msj: 'Las listas se listaron existosamente',
                lista
            });
        }
    });
});

router.get('/buscar-lista-id', (req, res) => {
    Lista.findOne({ _id: req.query._id }, (err, lista) => {
        if (err) {
            res.json({
                'msj': 'Ocurrió un error al buscar la lista',
                err
            });
        } else {
            if (lista) {
                res.json({
                    'msj': 'Se encontró la lista correctamente',
                    lista
                });
            } else {
                res.json({
                    'msj': 'No se encontró la lista',
                });
            }
        }
    });
});

router.get('/buscar-lista-nombre', (req, res) => {
    Lista.findOne({ nombre: req.query.nombre }, (err, lista) => {
        if (err) {
            res.json({
                'msj': 'Ocurrió un error al buscar la lista',
                err
            });
        } else {
            if (lista) {
                res.json({
                    'msj': 'Se encontró la lista correctamente',
                    lista
                });
            } else {
                res.json({
                    'msj': 'No se enocntró la lista',
                });
            }
        }
    });
});

router.put('/modificar-listas', (req, res) => {
    let lista = JSON.parse(req.body.lista_modificada)
    Lista.updateOne({ _id: lista._id }, {
        $set: {
            _id: lista._id,
            nombre: lista.nombre,
            lista_canciones: lista.lista_canciones,
            estado: lista.estado
        }
    }, (err, lista_modi) => {
        if (err) {
            res.json({
                msj: 'No se pudo modificar la lista, ocurrió el siguiente error',
                err
            })
        } else {
            res.json({
                msj: 'Los datos se enviaron de forma exitosa',
                lista_modi
            })
        }
    })
})

router.delete('/eliminar-listas', (req, res) => {
    let id = JSON.parse(req.body.lista_eliminada);
    let lista = Lista.findByIdAndDelete({ _id: id }, () => {
        if (lista) {
            res.json({
                'msj': 'Se eliminó correctamente',
            });
        } else {
            res.json({
                'msj': 'No se enocontró la lista',
            });
        }
    })

});

module.exports = router;