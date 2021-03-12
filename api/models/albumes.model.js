'use strict';

const mongoose = require('mongoose');
const schema_registro_albumes = new mongoose.Schema({
    'nombre': { type: String, required: true, unique: true },
    'fecha_lanzamiento': { type: Date, required: true, unique: false },
    'cantidad_canciones': { type: Number, required: true, unique: false },
    'duracion': { type: String, required: true, unique: false },
    'artista': [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artista'
    }],
    'canciones': [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cancion'
    }],
    'estado': { type: String, required: true, unique: false }
});

module.exports = mongoose.model('Album', schema_registro_albumes, 'Albumes');