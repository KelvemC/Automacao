const mongoose = require("mongoose");
const AgendamentoGrupos = new mongoose.Schema({
    usuario:{
        type: String,
        required: true
    },
    dispositivos:{
        type: [String],
        required: true,
    },
    inicio:{
        type: Date,
        required: true
    },
    fim:{
        type: Date,
        required: true
    },
    HorasLigado:{
        type: String,
        default: "none"
    },
    id:{
        type: String,
        required: true,
    }
});

mongoose.model("AgendamentoGrupos", AgendamentoGrupos);