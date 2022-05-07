const verifyRoles =
    (...allowedRoles) =>
    (req, res, next) => {
        if (!req.roles) return res.sendStatus(401);

        const result = req.roles.some((role) => allowedRoles.includes(role));

        if (!result) return res.sendStatus(401);

        next();
    };

module.exports = verifyRoles;
