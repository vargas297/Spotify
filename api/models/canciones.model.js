'use strict';

const mongoose = require('mongoose');
const schema_registro_canciones = new mongoose.Schema({
    'nombre': { type: String, required: true, unique: true },
    'duracion': { type: String, required: true, unique: false },
    'artista': { type: Object, required: true, unique: false },
    'album': { type: Object, required: true, unique: false },
    'estado': { type: String, required: true, unique: false }
});

module.exports = mongoose.model('Cancion', schema_registro_canciones, 'Canciones');