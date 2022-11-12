const { getPetition, getPetitions, addPetition, addUser, checkToken, checkEmail, updatePetition, signPetition, deletPetition } = require("../models/home_model");
const Joi = require('joi');
const randtoken = require('rand-token');

module.exports.home = async (app, req, res) => {
    console.log("[Controller Home]");
    try {
        const petitions = await getPetitions();
        if(!petitions || petitions.length === 0)
            return res.status(200).json(`There is no petition registered`);
        else
            return res.status(200).json(petitions);
    }  catch (error) {
        return res.status(500).json(`[Controller Home ERROR] - ${error}`);
    }
}

//Add User
module.exports.addPetition = async (app, req, res) => {
    console.log('[Controller Add Petition]');
    let petition = req.body;
    let token = req.headers['authorization'];

    if(!token) return res.status(401).json('No token provided');

    const response_token = await validateToken(res, token);

    if(response_token) {
        const { error } = schemaPetition.validate(petition);
        if(error) return res.status(500).json({error: error.details, msg: "Erro, petição não incluído!"});
            
        console.log(`Add Petition: ${petition}`);
    
        try {
            const id =  await addPetition(petition, response_token.email);
            return res.status(200).json(`Petição adicionada ID: ${id}`);
        } catch (error) {
            return res.status(500).json(`[Controller Add Petition ERROR] - ${error}`);
        }
    } 
}

//Sign Petition
module.exports.signPetition = async (app, req, res) => {
    console.log('[Controller Sign Petition]');
    
    const id  = req.params.id;
    let token = req.headers['authorization'];

    if(!token) return res.status(401).json('No token provided');

    const response_token = await validateToken(res, token);

    if(response_token) {
        try {
            const petition = await getPetition(id);
            if(!petition) return res.status(404).json(`Não existe petição cadastrada com o id ${id}.`);

            if(!petition.signaturesEmails.includes(response_token.email)) {
                const signatures = petition.signatures + 1;
                const signaturesEmails = petition.signaturesEmails; 
                signaturesEmails.push(response_token.email);
                const newSignature = {signatures, signaturesEmails};
                
                console.log("newSignature: ", newSignature);
                const result = await signPetition(id, newSignature);
                return res.status(200).json(`Petição ${id}, assinada!`);
            } else {
                return res.status(400).json(`Você já assinou a petição ${id} de ${petition.title}!`);
            }
        } catch (error) {
            return res.status(404).json(`[Controller Get Petition ${id} ERROR] - ${error}`)
        }
    }
}


//Create User
module.exports.createUser = async (app, req, res) => {
    console.log('[Controller Add User]');
    
    let user = req.body;

    const { error } = schemaUser.validate(user);
    if(error) return res.status(500).json({error: error.details, msg: "Erro, usuário não incluído!"});

    try {
        const email_registered =  await checkEmail(user.email);
        if(!email_registered) {
            user.token = randtoken.generate(16);
            const addedUser =  await addUser(user);
            console.log("Added User: ", addedUser);
            return res.status(200).json({db:addedUser, token: user.token});
        } else {
            return res.status(400).json(`Email ${user.email} já está em uso!`);
        }
    } catch (error) {
        return res.status(500).json(`[Controller Add User ERROR] - ${error}`);
    }
}

//Login
module.exports.loginUser = async (app, req, res) => {
    const email  = req.body.email;
    const password  = req.body.password;
    console.log(`[Controller Login: ${email}]`);
    try {
        const user = await checkEmail(email);
        if(!user) {
            return res.status(404).json(`Não existe usuário cadastrado com o email: ${email}`);
        }
        else if(user.password === password) {
            return res.status(200).json(`Token: ${user.token}`);
        } else {
            return res.status(401).json(`Senha incorreta`);
        }
    } catch (error) {
        return res.status(404).json(`[Controller View Petition ${id} ERROR] - ${error}`);
    }
}

//View
module.exports.viewPetition = async (app, req, res) => {
    const id  = req.params.id;
    console.log(`[Controller View Petition: ${id}]`);
    try {
        const petition = await getPetition(id);
        if(!petition) 
            return res.status(404).json(`Não existe petição cadastrada com o id ${id}.`);
        else 
            return res.status(200).json(petition);
    } catch (error) {
        return res.status(404).json(`[Controller View Petition ${id} ERROR] - ${error}`);
    }
}

//Edit
module.exports.updatePetition = async (app, req, res) => {
    const id  = req.params.id;
    const data = req.body;
    const token = req.headers['authorization'];

    console.log(`[Controller Edit Post Petition: ${id}]`);

    if(!token) return res.status(401).json('No token provided');

    const response_token = await validateToken(res, token);
    const response_validade_petition = await validateTokenPetition(res, response_token.email, id);

    if(response_token && response_validade_petition) {
        try {
            const { error } = schemaPetition.validate(data);
            if(error) return res.status(500).json({error: error.details, msg: "Erro no formato, petição não foi atualizada!"});
    
            try {
                const petition = await updatePetition(id, data);
                if(petition) return res.status(200).json(`Você editou a petição ${id} de ${data.title}`);
            } catch (error) {
                console.log(`[Controller Edit Petition id: ${id}] Error: ${error}`);
                return res.status(500).json({error: error})
            }
    
        } catch (error) {
            return res.status(404).json(`[Controller Edit Post Petition ${id} ERROR] - ${error}`);
        }
    }
}

//Delet
module.exports.deletPetition = async (app, req, res) => {
    const id  = req.params.id;
    const token = req.headers['authorization'];

    console.log(`[Controller Delet Petition: ${id}]`);

    if(!token) return res.status(401).json('No token provided');

    const response_token = await validateToken(res, token);
    const response_validade_petition = await validateTokenPetition(res, response_token.email, id);

    if(response_token && response_validade_petition) {
        try {
            const petition = await deletPetition(id);
            if(!petition) 
                return res.status(404).json(`Petition ${id} doesn't exist`);
            else
                return res.status(200).json({code: 200, message: `Petição ${id} deletada`});
        } catch (error) {
            res.status(500).json(`[Controller Delet Petition ${id} ERROR] - ${error}`);
            return false; 
        }
    }
}

async function validateToken(res, token) {
    try {
        const result = await checkToken(token);
        if(!result) {
            res.status(401).json(`Token ${token} doesn't exist`);
            return false;
        }
        else
            return result;
    } catch (error) {
        res.status(401).json(`[Controller Check Token ${token} ERROR] - ${error}`);
        return false; 
    }
}

async function validateTokenPetition(res, email, id) {
    try {
        const petition = await getPetition(id);
        if(!petition) {
            res.status(401).json(`Petition ID ${id} doesn't exist`);
            return false;
        } else if (petition.creator != email) {
            res.status(401).json(`${email} Unauthorized`);
            return false;
        }
        else if(petition.creator == email) {
            return true;
        }
    } catch (error) {
        res.status(401).json(`[Controller Check Petition: ${id} ERROR] - ${error}`);
        return false; 
    }
}

const schemaPetition = Joi.object().keys({
    title: Joi.string().required().min(1).max(50),
    description: Joi.string().required().min(1).max(500),
    goal: Joi.number().required().integer()
});

const schemaUser = Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().min(5).max(20),
});