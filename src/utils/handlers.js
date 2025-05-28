const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const serviceHandler =
	(fn) =>
	async (...args) => {
		try {
			return await fn(...args);
		} catch (err) {
			console.error("Service Error:", err);
			throw err;
		}
	};

export { asyncHandler, serviceHandler };
