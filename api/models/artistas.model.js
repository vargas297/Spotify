'use strict';

const mongoose = require('mongoose');
const schema_registro_artistas = new mongoose.Schema({
    'nombre': { type: String, required: true, unique: true },
    'disquera': { type: String, required: true, unique: false },
    'fecha_nacimiento': { type: Date, required: true, unique: false },
    'edad': { type: Number, required: true, unique: false },
    'estado': { type: String, required: true, unique: false }
});

module.exports = mongoose.model('Artista', schema_registro_artistas, 'Artistas');