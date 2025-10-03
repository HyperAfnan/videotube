export const watchLaterKeys = {
  all: ['watchLater'],
  list: () => [...watchLaterKeys.all, 'list'],
  detail: (id) => [...watchLaterKeys.all, 'detail', id],
};
