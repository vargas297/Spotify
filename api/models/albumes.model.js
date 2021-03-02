'use strict';

const mongoose = require('mongoose');
const schema_registro_albumes = new mongoose.Schema({
    'nombre': { type: String, required: true, unique: true },
    'fecha_lanzamiento': { type: Date, required: true, unique: false },
    'cantidad_canciones': { type: Number, required: true, unique: false },
    'duracion': { type: String, required: true, unique: false },
    'canciones': { type: Array, required: true, unique: false },
    'estado': { type: String, required: true, unique: false }
});

module.exports = mongoose.model('Album', schema_registro_albumes, 'Albumes');