'use strict';

const mongoose = require('mongoose');
const schema_registro_usuarios = new mongoose.Schema({
    'nombre': { type: String, required: true, unique: false },
    'apellidos': { type: String, required: true, unique: false },
    'fecha_nacimiento': { type: Date, required: true, unique: false },
    'correo': { type: String, required: true, unique: true },
    'genero': { type: String, required: false, unique: false },
    'tipo': { type: String, required: true, unique: false },
    'contrasenia': { type: String, required: true, unique: false },
    'estado': { type: String, required: true, unique: false }
});

module.exports = mongoose.model('Usuario', schema_registro_usuarios, 'Usuarios');