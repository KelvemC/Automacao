const mongoose = require("mongoose");
const Dispositivo = new mongoose.Schema({
    nome:{
        type: String,
        required: true,
        unique: true,
    },
    on_off:{
        type: Boolean,
        required: true,
    },
    used:{
        type: Boolean,
        required: true,
    },
    wifi:{
        type: String,
        required: true,
    },
    senha_wifi:{
        type: String,
        required: true,
    },
    usuario:{
        type: String,
        required: true,
    },
},{
    timestamps: true
});

mongoose.model("Dispositivos", Dispositivo);