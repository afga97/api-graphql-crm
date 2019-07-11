import mongoose from 'mongoose';
import { Clientes } from './db';

export const resolvers = {
	Query: {
		getCliente: ({ id }) => {
			return new Cliente(id, clientesDB[id]);
		}
	},
	Mutation: {
		crearCliente: (root, { input }) => {
			const newClient = new Clientes({
				nombre: input.nombre,
				apellido: input.apellido,
				emails: input.emails,
				empresa: input.empresa,
				edad: input.edad,
				tipo: input.tipo,
				pedidos: input.pedidos
            })
            newClient.id = newClient._id;
            return new Promise((resolve, object) => {
                newClient.save((error) => {
                    if(error) reject(error)
                    else resolve(newClient)
                })
            });
		},
		actualizarCliente: (root, { input }) => {
			return new Promise((resolve, object) => {
				Clientes.findOneAndUpdate( { _id : input.id } , input, { new: true}, (error, cliente) => {
					if(error) reject(error)
					else resolve(cliente)
					
				});
			});
		}
	}
};
