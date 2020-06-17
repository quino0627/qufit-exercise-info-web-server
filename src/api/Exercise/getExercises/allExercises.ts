import { Exercise } from '@prisma/client';
import { Resolvers } from '../../../types/resolvers';

const resolvers: Resolvers = {
  Query: {
    allExercises: (_, __, { prisma }): Promise<[Exercise]> => prisma.exercise.findMany(),
  },
};

export default resolvers;
