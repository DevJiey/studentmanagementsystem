// Wrapper para sa async controller functions.
// Kapag nag-reject yung promise (may error), ipapasa niya
// diretso sa centralized error handler natin sa server.js
// imbes na mag-crash o mangailangan ng try/catch sa bawat function.

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = asyncHandler;