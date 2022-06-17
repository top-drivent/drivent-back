import { notFoundError } from '@/errors';
import eventRepository from '@/repositories/event-repository';
import { exclude } from '@/utils/prisma-utils';
import { Event } from '@prisma/client';
import dayjs from 'dayjs';

async function getFirstEvent(): Promise<GetFirstEventResult> {
  let event = await eventRepository.findFirst();
  if (!event) {
    await eventRepository.createEvent();
    event = await eventRepository.findFirst();
  }
  if (!event) throw notFoundError();

  return event;
}

export type GetFirstEventResult = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
