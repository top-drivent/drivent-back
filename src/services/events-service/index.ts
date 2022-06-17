import { notFoundError } from '@/errors';
import eventRepository from '@/repositories/event-repository';
import dayjs from 'dayjs';

export type GetFirstEventResult = {
  title: string;
  backgroundImageUrl: string;
  logoImageUrl: string;
  startsAt: Date;
  endsAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

async function getFirstEvent(): Promise<GetFirstEventResult> {
  let event = await eventRepository.findFirst();
  if (!event) {
    const newEvent = {
      title: 'Driven.t',
      logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
      backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
      startsAt: dayjs().toDate(),
      endsAt: dayjs().add(21, 'days').toDate(),
    };
    await eventRepository.createEvent(newEvent);
    event = await eventRepository.findFirst();
  }
  if (!event) throw notFoundError();

  return event;
}

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
