class Cliente {
    constructor(id, {nombre, apellido, empresa, emails, edad, tipo, pedidos}){
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.emails = emails;
        this.empresa = empresa;
        this.edad = edad;
        this.tipo = tipo;
        this.pedidos = pedidos;
    }
}

const clientesDB = {};

const resolvers = { 
    getCliente: ({id}) => {
        return new Cliente(id, clientesDB[id]);
    },
    crearCliente: ({input}) => {
        const id = require('crypto').randomBytes(10).toString('hex');
        clientesDB[id] = input;
        return new Cliente(id, input);
    }
};

export default resolvers;