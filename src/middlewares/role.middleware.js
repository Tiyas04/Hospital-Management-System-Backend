import ApiError from "../utils/apierror.js";

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.User.role)) {
            throw new ApiError(403, `Access denied for role: ${req.User.role}`);
        }
        next();
    }
}

export {authorizeRole}