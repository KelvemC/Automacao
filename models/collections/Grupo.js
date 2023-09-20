const mongoose = require("mongoose");
const Grupos = new mongoose.Schema({
    nomeDoGrupo:{
        type: String,
        required: true,
        unique: true
    },
    on_off:{
        type: Boolean,
        required: true,
    },
    dispositivos:{
        type: [String],
        required: true, 
    },
    usuario:{
        type: String,
        required: true,
    }
},{
    timestamps: true, 
});

mongoose.model("Grupos", Grupos);