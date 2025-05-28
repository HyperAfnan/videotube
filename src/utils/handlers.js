const asyncHandler = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch((err) => next(err));
	};
};

const serviceHandler = (fn) => {
	return async (...args) => {
		try {
			return await fn(...args);
		} catch (err) {
			console.error("Service Error:", err);
			throw err;
		}
	};
};

export { asyncHandler, serviceHandler };
