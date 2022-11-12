const { app } = require("./config/server");
const routes = require("./app/routes/routes");

routes.home(app);
routes.insertPetition(app);
routes.signPetition(app);
routes.searchPetition(app);
routes.editPetition(app);
routes.deletPetition(app);
routes.createUser(app);
routes.loginUser(app);

module.exports = app;