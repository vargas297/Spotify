'use strict';

const mongoose = require('mongoose');
const schema_registro_canciones = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    duracion: { type: String, required: true, unique: false },
    artistas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artista'
    }],
    estado: { type: String, required: true, unique: false }
});

module.exports = mongoose.model('Cancion', schema_registro_canciones, 'Canciones');