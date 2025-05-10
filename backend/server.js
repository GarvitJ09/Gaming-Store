const app = require('./app');
const dotenv = require('dotenv');
const envFile = `.env.${process.env.APP_ENV || 'development'}`;
dotenv.config({ path: envFile });
const connectDB = require('./config/db');
console.log(process.env.APP_ENV);
const PORT = process.env.PORT;
connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
