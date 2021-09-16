if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();

    module.exports = {
        PUBLISH: process.env.PUBLISHABLE_KEY,
        SECRET: process.env.SECRET_KEY
    }
}