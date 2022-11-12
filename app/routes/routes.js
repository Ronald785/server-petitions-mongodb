const { home, addPetition, signPetition, viewPetition, updatePetition, deletPetition, createUser, loginUser } = require("../controllers/home_controller");

module.exports = {
    home: (app) => {
        app.get('/', (req, res) => {
            console.log("[Route Main]");
            home(app, req, res);
        });
        app.get('/petitions', (req, res) => {
            console.log("[Route Main]");
            home(app, req, res);
        });
    },
    insertPetition: (app) => {
        app.post('/petitions', (req, res) => {
            console.log("[Route Save Petition]");
            addPetition(app, req, res);
        });
    },
    signPetition: (app) => {
        app.post('/sign/petition/:id', (req, res) => {
            console.log("[Route Sign Petition]");
            signPetition(app, req, res);
        });
    },
    searchPetition: (app) => {
        app.get('/petition/:id', (req, res) => {
            console.log("[Route View Petition]");
            viewPetition(app, req, res);
        });
    },
    editPetition: (app) => {
        app.put('/petition/:id', (req, res) => {
            console.log("[Route Put Petition]");
            updatePetition(app, req, res);
        });
    },
    deletPetition: (app) => {
        app.delete('/petition/:id', (req, res) => {
            console.log("[Route Del Petition]");
            deletPetition(app, req, res);
        });
    },
    createUser: (app) => {
        app.post('/user', (req, res) => {
            console.log("[Route Create User]");
            createUser(app, req, res);
        });
    },
    loginUser: (app) => {
        app.get('/login', (req, res) => {
            console.log("[Route Login User]");
            loginUser(app, req, res);
        });
    }
}

