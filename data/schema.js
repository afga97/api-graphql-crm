import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = importSchema('data/schema.graphql');

const schema = makeExecutableSchema({typeDefs, resolvers});

export { schema };