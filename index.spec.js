const request = require('supertest');
const app ='https://simenergy-production.up.railway.app';

describe('Testes de integração da aplicação', () => {
    let sessionCookie; // Declara a variável sessionCookie fora das funções de teste para que ela possa ser acessada em todos os testes

    it('Deve retornar a página de login', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    it('Deve realizar login e retornar uma sessão válida', async () => {
        const response = await request(app)
            .post('/')
            .send({
                // Envie os dados necessários para o login
                email: 'kelvemcif@gmail.com',
                senha: '02kentokelvem21',
            });

        sessionCookie = response.headers['set-cookie']; // Armazena o cookie de sessão na variável sessionCookie
        expect(response.statusCode).toBe(200);
    });
    /*
    it('Deve retornar status 200 ao criar um dispositivo', async () => {
        const response = await request(app)
            .post('/dispositivo')
            .send({
                // Envie os dados necessários para a criação do dispositivo
                nome: 'Biblioteca',
                on_off: false,
                used: false,
                wifi: 'LABMAKER',
                senha_wifi: 'labnote123',
                usuario: 'kelvemcif@gmail.com',
            })
            .set('Cookie', sessionCookie); // Use o cookie da sessão aqui
        expect(response.statusCode).toBe(302);
    });
    */
   /*
    it('Deve retornar status 200 ao editar um dispositivo', async () => {
        const response = await request(app)
          .put('/editar/dispositivo/6499ce8d7b47e2479b66e5d6')
          .send({
            // Envie os dados que você deseja editar
            wifi: "biblioteca",
            senha_wifi: "IFbiblioteca"
          })
          .set('Cookie', sessionCookie); // Use o cookie da sessão aqui
        expect(response.statusCode).toBe(200);
      });
    */
      
      it('Deve retornar status 200 ao excluir um dispositivo', async () => {
        const response = await request(app)
          .delete('/deletar/dispositivo/6499ce8d7b47e2479b66e5d6')
          .set('Cookie', sessionCookie); // Use o cookie da sessão aqui
        expect(response.statusCode).toBe(200);
      });
});