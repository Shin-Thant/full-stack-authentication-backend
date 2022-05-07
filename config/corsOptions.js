const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
    origin: (origin, callback) => {
        // console.log("origin: ", origin);
        // TODO: after development, you have to remove " !origin " from if condition

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS!"));
        }
    },
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;
