"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateUser = void 0;
const authenticateUser = async (req, res, next) => {
    next();
};
exports.authenticateUser = authenticateUser;
const optionalAuth = async (req, res, next) => {
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=authMiddleware.js.map