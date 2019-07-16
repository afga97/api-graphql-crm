import mongoose from 'mongoose';
import { Clientes, Productos } from './db';

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
		},
		getProductos: (_, { limite, offset}) => {
			return Productos.find().limit(limite).skip(offset)
		},
		getProducto: (_, { id }) => {
			return new Promise((resolve, reject) => {
				Productos.findById(id, (error, producto) => {
					if (error) reject(error)
					else resolve(producto)
				});
			})
		}
	},
	Mutation: {
		crearCliente: (_, { input }) => {
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
		actualizarCliente: (_, { input }) => {
			return new Promise((resolve, reject) => {
				Clientes.findOneAndUpdate( { _id : input.id } , input, { new: true}, (error, cliente) => {
					if(error) reject(error)
					else resolve(cliente)
					
				});
			});
		},
		eliminarCliente: (_, { id }) => {
			return new Promise((resolve, reject) => {
				Clientes.findOneAndRemove( { _id : id}, (error) => {
					if(error) reject(error)
					else resolve("Se elimino correctamente")
				})
			})
		},
		nuevoProducto: (_, { input }) => {
			const producto = new Productos({
				nombre: input.nombre,
				precio: input.precio,
				stock: input.stock
			})
			producto.id = producto._id;
			return new Promise((resolve, reject) => {
				producto.save((error) => {
					if (error) reject(error)
					else resolve(producto)
				})
			});
		},
		actualizarProducto: (_, { input }) => {
			return new Promise((resolve, reject) => {
				Productos.findOneAndUpdate( {_id: input.id}, input, { new: true}, (error, producto) => {
					if(error) reject(error)
					else resolve(producto)
				});
			})
		},
		eliminarProducto: (_, { id }) => {
			return new Promise((resolve, reject) => {
				Productos.findOneAndRemove( { _id: id }, (error) => {
					if (error) reject(error)
					else resolve("Se elimino correctamente")
				})
			})
		}
	}
};
