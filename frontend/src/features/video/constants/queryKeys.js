export const videoQueryKeys = {
  all: ['videos'],
  list: () => [...videoQueryKeys.all, 'list'],
  detail: (id) => [...videoQueryKeys.all, 'detail', id],
};
