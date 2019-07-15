import mongoose from 'mongoose';
import { Clientes } from './db';

export const resolvers = {
	Query: {
		getClientes: (_, { limite, offset }) => {
			return Clientes.find().limit(limite).skip(offset)
		},
		getCliente: (_,{ id }) => {
			return new Promise((resolve, reject) => {
				Clientes.findById(id, (error, cliente) => {
					if (error) reject(error)
					else resolve(cliente)
				});
			});
		},
		totalClientes: (root) => {
			return new Promise((resolve, reject) => {
				Clientes.countDocuments({}, (error, count) => {
					if (error) reject(error)
					else resolve(count)
				})
			})
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
			return new Promise((resolve, reject) => {
				Clientes.findOneAndUpdate( { _id : input.id } , input, { new: true}, (error, cliente) => {
					if(error) reject(error)
					else resolve(cliente)
					
				});
			});
		},
		eliminarCliente: (root, { id }) => {
			return new Promise((resolve, reject) => {
				Clientes.findOneAndRemove( { _id : id}, (error) => {
					if(error) reject(error)
					else resolve("Se elimino correctamente")
				})
			})
		}
	}
};
