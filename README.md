# Projeto SIMEnergy

#### O projeto tem como objetivo criar um sistema de automação que consiga ser de fácil acesso e também trazer um diferencial.

##### Tarefas que foram concluídas:white_check_mark::

- Código para recebimento de mensagens MQTT do ESP8266.
- Tela para controlar dispositivos publicando mensagens em tópicos específicos.
- Tela para cadastrar novos dispositivos.
- Filtrar Dispositivos.
- Editar credenciais de WiFi do ESP8266 através de uma interface.
- As funcionalidades do CRUD agora estão implementadas na tela.
- Novas melhorias na tela foram feitas.
- Código para o ESP8266 detectar que houve uma mudança e irá precisar fazer uma requisição e usar os dados do wifi salvo no banco para adicionar ao dispositivo.
- Sistema de login foi adicionado, qualquer ação disponibilizada através da interface requer que o usuário esteja logado, o login só será feito caso a empresa disponibilize o login para o determiando usuário.
- Login do usuário, aqui será feito toda a parte da segurança do sistema para cada usuário(a tela de cadastro não será feita, pois quem vai mandar o login é a empresa, ela ficará responsável por isso).
- Foi feito código que me permiti agendar um horário para o funcionamento do dispositivo, onde ele inicia e desliga.
- Implementação das boas práticas de programação js
- Criação de variáveis de ambientes 
- Criptografia ponta a ponta para que as informações dos dispositivos não seja rastreada.
- autenticação, por mais que o sistema de login tenha sido feito com o express-session, ele por si só não é o suficiente para garantir a segurança do sistema. É preciso ter uma autenticação.
- código para cadastrar adm e logar
- telas adm

##### Fazendo:
    Novo método para melhorar o agendamento de ligamento dos dispositivos, a forma que fiz utiliza a lib node-cron, que usa execução contínua para agendar tarefas no sistema, o problema dela é que se a aplicação for reiniciada, todos os agendamentos serão perdidos.

##### Problemas:
    A antiga lib chamada node-schedule não funciona bem em ambiente de deploy, fiz testes e programei tudo direitinho seguindo a documentação oficial no npm e não funcionou nada, somente a node-cron funcionou. O ruim de usar o node-cron é que além da possibilidade de perder os agendamentos, não tem como cancelar a execução da tarefa agendada.

##### Soluções:
    No momento estou usando uma API do google cloud para usar o calendário do google para fazer os agendamentos e apartir deles, podemos usar as informações para executar a ação de ligar ou desligar um dispositivo cadastrado no sistema.
    

