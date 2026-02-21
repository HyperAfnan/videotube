export const videoQueryKeys = {
  all: ['videos'],
  list: () => [...videoQueryKeys.all, 'list'],
  comments: (id) => [...videoQueryKeys.all, 'comments', id],
  detail: (id) => [...videoQueryKeys.all, 'detail', id],
  subscribers: (channelId) => ['subscriptions', 'subscribers', channelId],
  subscriptions: (userId) => ['subscriptions', 'channels', userId],
};
