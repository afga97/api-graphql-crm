import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema'; // GrapHql
import resolvers from './resolvers';

const app = express();
const root = resolvers;

app.get('/', (req, res) => {
    res.send('Todo listo');
});

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}));
app.listen(3001, () => console.log('Express corriendo por el puerto 8000'))