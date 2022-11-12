const supertest = require('supertest');
const app = require('../index.js');

describe('petition', () => {
    describe("Get petitions route", () => {
        describe('Get all petitions', () => {
            it("Should return status 200", async () => {
                await supertest(app)
                .get(`/petitions`)
                .expect(200);
            })
        });

        describe('Get the petition does not exist', () => {
            it("Should return status 404", async () => {
                await supertest(app)
                .get(`/petition/636bf1aaea5d770a83af40a2`)
                .expect(404);
            })
        });

        describe('Post Petition', () => {
            it("Should return status 200", async () => {
                const data = {
                    title: 'Título da petição TESTE', 
                    description: 'Descrição da petição TESTE', 
                    goal: 10
                };
                await supertest(app)
                .post(`/petitions`)
                .set('Authorization', 'wR6TPA7gM53BIB0g')
                .set('Content-Type', 'application/json')
                .send(data)
                .expect(200);
            })
        });

        describe('Post Petition ERROR', () => {
            it("Should return status 401", async () => {
                const data = {
                    title: 'Título da petição TESTE', 
                    description: 'Descrição da petição TESTE', 
                    goal: 10
                };
                await supertest(app)
                    .post(`/petitions`)
                    .set('Authorization', '')
                    .set('Content-Type', 'application/json')
                    .send(data)
                    .expect(401);
            })
        });

        // describe('Put Petition', () => {
        //     it("Should return status 200 updated", async () => {
        //         const data = {
        //             title: 'Título da petição TESTE PUT', 
        //             description: 'Descrição da petição TESTE PUT', 
        //             goal: 100
        //         };
        //         await supertest(app)
        //             .put(api + "/636bea3dddf3fe33f7e86957")
        //             .set('Authorization', 'wR6TPA7gM53BIB0g')
        //             .set('Content-Type', 'application/json')
        //             .send(data)
        //             .expect(200);
        //     })
        // });

        describe('Put Petition ERROR', () => {
            it("Should return status 401 ERROR UPDATE", async () => {
                const data = {
                    title: 'Título da petição TESTE PUT', 
                    description: 'Descrição da petição TESTE PUT', 
                    goal: 100
                };
                await supertest(app)
                    .put(`/petition` + "/636bf1aaea5d770a83af40ab")
                    .set('Authorization', 'wOw2IImY11oDWdwG')
                    .set('Content-Type', 'application/json')
                    .send(data)
                    .expect(401);
            })
        });

        // describe('Delet Petition', () => {
        //     it("Should return status 200 Deleted", async () => {
        //         await supertest(app)
        //         .delete(`/petition` + "/636bf1aaea5d770a83af40ab")
        //         .set('Authorization', 'wR6TPA7gM53BIB0g')
        //         .expect(200);
        //     })
        // });

        describe('Delet Petition ERROR', () => {
            it("Should return status 401 ERROR Delete", async () => {
                await supertest(app)
                .delete(`/petition` + "/636f018d9fa3ddc27caf40e1")
                .set('Authorization', '')
                .expect(401);
            })
        });

        describe('Get Login', () => {
            it("Should return status 200", async () => {
                const data = {
                    email: "teste@gmail.com",
                    password: "123456"
                }
                await supertest(app)
                .get(`/login`)
                .send(data)
                .expect(200);
            })
        });

        describe('Get Login does not exist email', () => {
            it("Should return status 404", async () => {
                const data = {
                    email: "testeEmailNaoExiste@gmail.com",
                    password: "123456"
                }
                await supertest(app)
                .get(`/login`)
                .send(data)
                .expect(404);
            })
        });

        describe('Post Create User', () => {
            it("Should return status 200", async () => {
                const data = {
                    email: 'supertest@gmail.com', 
                    password: '123456'
                };
                await supertest(app)
                .post(`/user`)
                .set('Content-Type', 'application/json')
                .send(data)
                .expect(200);
            })
        });

        describe('Post Create User ERROR', () => {
            it("Should return status 400", async () => {
                const data = {
                    email: 'teste@gmail.com', 
                    password: '123456'
                };
                await supertest(app)
                    .post(`/user`)
                    .set('Content-Type', 'application/json')
                    .send(data)
                    .expect(400);
            })
        });

        describe('Sign Petition', () => {
            it("Should return status 200", async () => {
                await supertest(app)
                .post(`/sign/petition/636bf1aaea5d770a83af40ab`)
                .set('Authorization', 'h6OiwwYXQhI5ZTx0')
                .expect(200);
            })
        });

        describe('Sign Petition ERROR', () => {
            it("Should return status 400", async () => {
                await supertest(app)
                    .post(`/sign/petition/636bf1aaea5d770a83af40ab`)
                    .set('Authorization', 'h6OiwwYXQhI5ZTx0')
                    .expect(400);
            })
        });
    })
});