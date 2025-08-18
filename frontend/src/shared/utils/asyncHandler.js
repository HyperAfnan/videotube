const asyncHandler =
  (fn) =>
  async (...args) => {
    // eslint-disable-next-line no-useless-catch
    try {
      return await fn(...args);
    } catch (err) {
      throw err;
    }
  };

export default asyncHandler;
