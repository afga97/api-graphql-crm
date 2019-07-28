import { Clientes, Productos, Pedidos } from './db';

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
		getProductos: (_, { limite, offset, stock}) => {
			let filtro;
			if (stock) {
				filtro = { stock: {$gt : 0} };
			}
			return Productos.find(filtro).limit(limite).skip(offset)
		},
		getProducto: (_, { id }) => {
			return new Promise((resolve, reject) => {
				Productos.findById(id, (error, producto) => {
					if (error) reject(error)
					else resolve(producto)
				});
			})
		},
		totalProductos: (root) => {
			return new Promise((resolve, reject) => {
				Productos.countDocuments({}, (error, count) => {
					if (error) reject(error)
					else resolve(count)
				})
			})
		},
		getPedidos: (_, {cliente}) => {
			return new Promise((resolve, reject) => {
				Pedidos.find({cliente: cliente}).populate('cliente').exec((error, pedidos) => {
					if (error) reject(error)
					else resolve(pedidos)
				})
			})
		},
		topClientes: (_) => {
			return new Promise((resolve, reject) => {
				Pedidos.aggregate([
					{
						$match: { estado: "COMPLETADO" }
					},
					{
						$group: {
							_id : "$cliente",
							total: { $sum : "$total" }
						}
					},
					{
						$lookup: {
							from: "clientes",
							localField: '_id',
							foreignField: '_id',
							as: 'cliente'
						}
					},
					{
						$sort: { total : -1 }
					},
					{
						$limit: 10
					}	
				], (error, clientes) => {
					if (error) reject(error)
					else resolve(clientes)
				})
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
		},
		nuevoPedido: (_, { input }) => {
			const nuevoPedido = new Pedidos({
				pedido: input.pedido,
				fecha: new Date(),
				total: input.total,
				cliente: input.cliente,
				estado: "PENDIENTE"
			});
			nuevoPedido.id = nuevoPedido._id;
			return new Promise( (resolve, reject) => {
				nuevoPedido.save( (error) => {
					if(error) reject(error)	
					Pedidos.findById(nuevoPedido._id).populate('cliente')
						.exec(( error, pedido) => {
							if (error) reject(error)
							// pedido['errors'] = errors
							resolve(pedido)
					})
				})
			});
		},
		actualizarEstado: (_, {input}) => {
			return new Promise((resolve, reject) => {

				const { estado } = input;
				let instruccion;
				if (estado === 'COMPLETADO') {
					instruccion = '-';
				} else if (estado === 'CANCELADO'){
					instruccion = '+';
				}

				input.pedido.forEach(pedido => {
					Productos.updateOne({_id: pedido.id}, 
						{
							"$inc":
								{ "stock": `${instruccion}${pedido.cantidad}` }
						}, (error) => {
							if (error ) return new Error(error)
						}
					)
				})
				
				Pedidos.findOneAndUpdate({_id: input.id}, input, {new:false}, (error) => {
					if (error) reject(error);
					else resolve("Se actualizó correctamente")
				})
			})
		}
	}
};
