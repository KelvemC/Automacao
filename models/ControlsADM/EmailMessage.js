async function get_html_message(nome, nomeDestinatario, login, senha){
    try{
        return `<!DOCTYPE html>
        <html>
        <head>
          <title>Agradecimento pela utilização da plataforma</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              font-size: 24px;
              color: #333;
              margin-bottom: 20px;
            }
            p {
              margin-bottom: 10px;
            }
            strong {
              font-weight: bold;
            }
            .credentials {
              margin-top: 30px;
              padding: 20px;
              background-color: #f5f5f5;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Prezado(a) ${nomeDestinatario},</h1>
        
            <p>Espero que esta mensagem o(a) encontre bem. Meu nome é ${nome}, e sou representante da equipe da SIMEnergy. Escrevo para expressar minha gratidão pelo fato de você ter escolhido nossa plataforma e confiado em nossos serviços.</p>
        
            <p>Gostaríamos de agradecer sinceramente por nos permitir fazer parte de sua jornada e fornecer as soluções necessárias para atender às suas necessidades. Na <strong>SIMEnergy</strong>, trabalhamos incessantemente para oferecer a melhor experiência possível aos nossos usuários, e é por isso que valorizamos imensamente a sua presença em nossa comunidade.</p>
        
            <div class="credentials">
              <p>Com o intuito de aprimorar ainda mais sua experiência, gostaríamos de fornecer as suas credenciais de acesso à plataforma:</p>
        
              <p><strong>Login:</strong> ${login}</p>
              <p><strong>Senha:</strong> ${senha}</p>
        
              <p>Pedimos que você faça o login em nossa plataforma utilizando essas informações e explore todas as funcionalidades que disponibilizamos. Caso encontre qualquer dificuldade ou tenha alguma dúvida, nossa equipe de suporte estará pronta para auxiliá-lo(a). Basta entrar em contato através do endereço de e-mail <strong>simenergy.automacao@gmail.com</strong>.</p>
            </div>
        
            <p>Agradecemos novamente por escolher a <strong>SIMEnergy</strong> e por nos permitir fazer parte do seu sucesso. Estamos comprometidos em fornecer um serviço de excelência e em atender a todas as suas necessidades. Esperamos que nossa plataforma continue a atender às suas expectativas e a proporcionar um ambiente propício para a realização de suas atividades.</p>
        
            <p>Caso tenha alguma sugestão, comentário ou feedback, não hesite em compartilhá-lo conosco. Valorizamos profundamente sua opinião e estamos sempre em busca de maneiras de melhorar.</p>
        
            <p>Atenciosamente,</p>
            <p><strong>${nome}</strong></p>
            <p><strong>Adm de sistema</strong></p>
            <p><strong>SIMEnergy</strong></p>
            <p>Em breve</p>
            <p>E-mail de Contato: <a href="mailto:simenergy.automacao@gmail.com">simenergy.automacao@gmail.com</a></p>
            <p>Número de Telefone: <a href="tel:Em breve">Em breve</a></p>
          </div>
        </body>
        </html>`;
    }catch(error){
        console.log("Página não retornada:", error);
    };
};

module.exports = {
    get_html_message
}