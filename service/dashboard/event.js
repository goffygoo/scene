import Module from "../app/event.js";

const PATCH = async ({ body }) => {
  const { eventId, eventData } = body;
  const event = await Module.getEvent(eventId);
  return Module.updateEvent(event, {
    ...eventData,
  });
};

export default {
  service: {
    PATCH,
  },
};
