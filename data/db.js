import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/clientes', { useNewUrlParser: true }).then( ()=> {
    console.log('Mongo esta escuchando');
}, (error) => {
    console.log('Ocurrio un error');
})

mongoose.set('setFindAndModify', false);


const clientesSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    empresa: String,
    emails: Array,
    edad: Number,
    tipo: String,
    pedidos: Array
});

const Clientes = mongoose.model('clientes', clientesSchema);


const productosSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    stock: Number
});

const Productos = mongoose.model('productos', productosSchema);

const pedidosSchema = new mongoose.Schema({
    pedido: Array,
    total: Number,
    fecha: Date,
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'clientes',
        required: [true, 'El cliente es obligatorio.']
    },
    estado: String
})

const Pedidos = mongoose.model('pedidos', pedidosSchema);

export { Clientes, Productos, Pedidos };