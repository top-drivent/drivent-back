import { prisma } from '@/config';
import { redis } from '@/server';
import dayjs from 'dayjs';

async function findFirst() {
  const cache = await redis.get('event--drivent');
  return JSON.parse(cache);
}
async function createEvent() {
  const event = {
    title: 'Driven.t',
    logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
    backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
    startsAt: dayjs().toDate(),
    endsAt: dayjs().add(21, 'days').toDate(),
  };
  await redis.set('event--drivent', JSON.stringify(event));
}

const eventRepository = {
  findFirst,
  createEvent,
};

export default eventRepository;
