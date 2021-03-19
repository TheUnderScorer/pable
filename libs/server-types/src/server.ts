import { FastifyInstance } from 'fastify';

export type RegisterRouteFn = (fastify: FastifyInstance) => void;
