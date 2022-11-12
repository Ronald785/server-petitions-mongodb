const client = require("../../config/dbConnection");
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    getPetitions: async () => {
        console.log(`[Model - Get All Petitions]`);
        const petitions = await client.db("dsw").collection("petitions").find({}).toArray();
        return petitions;
    },
    getPetition: async (id) => {
        console.log(`[Model - Get Petition: ${id}]`);
        const petition = await client.db("dsw").collection("petitions").findOne({
            _id: new ObjectId(id)
        });
        return petition;
    },
    checkToken: async (token) => {
        console.log(`[Model - Check Token: ${token}]`);
        try {
            const result = await client.db("dsw").collection("user_petitions").findOne({token});
            return result;
        } catch (error) {
            console.log(`[Model - Check Token ${token}] ERROR: ${error}`);
        }
    },
    checkEmail: async (email) => {
        console.log(`[Model - Check Email: ${email}]`);
        const result = await client.db("dsw").collection("user_petitions").findOne({email});
        return result;
    },
    addPetition: async (data, email) => {
        console.log(`[Model - Add Petition]`);
        try {
            const newPetition = {
                title: data.title, 
                description: data.description, 
                creator: email,
                goal: data.goal,
                signatures: 0,
                signaturesEmails: [],
                date: new Date()
            }
            const addedPetition = await client.db("dsw").collection("petitions").insertOne(newPetition);
            return addedPetition.insertedId;
        } catch (error) {
            console.log(`[Petition Service] Error: ${error}`);
        }
    },
    addUser: async (data) => {
        console.log(`[Model - Add user]`);
        try {
            const newUser = {
                email: data.email, 
                password: data.password, 
                token: data.token,
            }
            const addedUser = await client.db("dsw").collection("user_petitions").insertOne(newUser);
            return addedUser;
        } catch (error) {
            console.log(`[User Service] Error: ${error}`);
        }
    },
    updatePetition: async (id, data) => {
        console.log(`[Model - Update Petition: ${id}]`);
        const petition = await client.db("dsw").collection("petitions").updateOne(
            { _id: new ObjectId(id) },
            {$set: 
                {
                    title: data.title, 
                    description: data.description, 
                    goal: data.goal,
                    date: new Date()
                }
            }
        );
        return petition;
    },
    signPetition: async (id, data) => {
        console.log(`[Model - Sign Petition: ${id}]`);
        const petition = await client.db("dsw").collection("petitions").updateOne(
            { _id: new ObjectId(id) },
            {$set: 
                {
                    signatures: data.signatures, 
                    signaturesEmails: data.signaturesEmails, 
                }
            }
        );
        return petition;
    },
    deletPetition: async (id) => {
        console.log(`[Model - Delet Petition: ${id}]`);
        const petition = await client.db("dsw").collection("petitions").deleteOne({
            _id: new ObjectId(id) 
        });
        return petition;
    }
}