import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Cliente {
        id: ID
        nombre: String
        apellido: String
        empresa: String
        emails: [Emails]
        edad: Int
        tipo: TipoCliente
        pedidos: [Pedido]
    }
    type Query {
        getCliente(id: ID): Cliente
    }
    
    type Emails {
        email: String
    }

    type Pedido {
        producto: String
        precio : Int
    }

    enum TipoCliente {
        BASICO
        PREMIUM
    }

    input PedidoInput {
        producto: String
        precio: Int
    }

    input EmailInput {
        email: String
    }

    """ Campos para el modelo de cliente """
    input ClienteInput {
        id: ID
        nombre: String!
        apellido: String!
        empresa: String!
        emails: [EmailInput]!
        edad: Int!
        tipo: TipoCliente!
        pedidos: [PedidoInput]!
    }

    """ Mutation para crear clientes """
    type Mutation {
        #Nombre del resolver, input con datos y valor de retornado
        """ Permite crear nuevos clientes """
        crearCliente(input: ClienteInput): Cliente
    }
`);

export default schema;