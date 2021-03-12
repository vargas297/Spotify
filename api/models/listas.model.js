'use strict';

const mongoose = require('mongoose');
const schema_registro_listas = new mongoose.Schema({
    nombre: { type: String, required: true, unique: false },
    lista_canciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cancion'
    }],
    estado: { type: String, required: true, unique: false }
});

module.exports = mongoose.model('Lista', schema_registro_listas, 'Listas');