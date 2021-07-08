const app = require("../app");
const db = require("../src/model/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;


db.then(() => {
    app.listen(PORT, async () => {
        console.log(`Server running. Use our API on port: ${PORT}`);
    });
}).catch((error) => {
    console.log(`Error: ${error.message}`);
});