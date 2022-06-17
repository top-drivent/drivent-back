import { prisma } from '@/config';
import { redis } from '@/server';
import { GetFirstEventResult } from '@/services';
import dayjs from 'dayjs';

async function findFirst() {
  const cache = await redis.get('event--drivent');
  return JSON.parse(cache);
}
async function createEvent(event: Omit<GetFirstEventResult, 'createdAt' | 'updatedAt'>) {
  await redis.set('event--drivent', JSON.stringify(event));
}

const eventRepository = {
  findFirst,
  createEvent,
};

export default eventRepository;
