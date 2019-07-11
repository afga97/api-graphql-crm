import express from 'express';
import graphqlHTTP from 'express-graphql';
import { schema } from './data/schema';

const app = express();

app.get('/', (req, res) => {
    res.send('Todo listo');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(3001, () => console.log('Express corriendo por el puerto 3001'))