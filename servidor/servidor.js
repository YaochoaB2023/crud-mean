const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({path: 'usuario.env'});

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_usuarios, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
    .then(() => {
        console.log('conectado a mongo');
    })
    .catch(() => {
        console.log('error al conectar con mongo');
    });


const esquema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    apellido:{
        type:String,
        required:true
    },
    correo:{
        type:String,
        required:true
    },
    contraseña:{
        type:Number,
        required:true
    }
});

const usuarios  = mongoose.model('usuarios', esquema);

app.use(cors());
app.use(express.json());


app.get('/todos', async (req, res) => {
    try {
        const todos = await usuarios.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener los usuarios'});
    }
});

app.get('/todos/:id', async(req, res) => {
    try {
        const todo = await usuarios.findById(req.params.id);
        res.json(todo);
    } catch (error) {
        res.status(404).json({error: 'Usuario no encontrado'});
    }
});

app.post('/todos', async (req, res) => {
    try {
        const todo = new usuarios(req.body);
        await todo.save();
        res.status(200).json(todo);
    } catch (error) {
        res.status(400).json({error: 'Error al crear el usuario'});
    }
});

app.put('/todos/:id', async (req,res) => {
    try {
        const todo = await usuarios.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
        });
        res.json(todo);
    } catch (error) {
        res.status(400).json({error: 'Error al actualizar el usuario'});
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        await usuarios.findByIdAndDelete(req.params.id);
        res.json({ message:'usuario eliminado '});
    } catch (error) {
        res.status(400).json({error: 'Error al eliminar el usuario'});
    }
})

app.listen(port, () => {
    console.log('servidor en funcionamiento')
})