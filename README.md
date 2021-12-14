# Seja bem-vindo ao Iron Bank!
![braavos](https://i.ibb.co/pW1V0Gg/32fe0a36240b2cb063fa3d5508c0f514.jpg)

Esse foi o resultado de **15 horas** de projeto para desenvolvimento de uma API REST com funções relacionadas ao gerenciamento de contas bancárias. O trabalho foi desenvolvido nos dias 09/12/2021 das 15hrs as 20rs e 13/12/2021 das 14hrs até meia noite com auxílio de bastante café. O projeto foi realizado via **TDD** e utilizando a branch *'tdd-creation'* que, após testada, foi mergeada.

[LinkedIn](https://www.linkedin.com/in/tiagoornelasadv/)<br />
advtiagoornelas@gmail.com

---
## Sumário
- [Requisitos](#requisitos)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Testes](#testes)
- [Endpoints](#endpoints)
    - [Login](#login)
    - [User](#user)
    - [Balance](#balance)
    - [Transaction](#transaction)
    - [Deposit](#deposit)
    - [Payment](#payment)
    - [Profit](#profit)
- [Issues](#issues)

---
## Requisitos

Requisitos obrigatórios:
- Para abrir uma conta é necessário apenas o nome completo e CPF da pessoa, mas só é permitido uma conta por pessoa;
- Com essa conta é possível realizar transferências para outras contas e depositar;
- Não aceitamos valores negativos nas contas;
- Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000;
- As transferências entre contas são gratuitas e ilimitadas;

Requisitos extras desenvolvidas no projeto:
- Uso de login para autenticação de usuários;
- As senhas no banco de dados estão cifradas;
- Definição de usuários administradores e comuns, permitindo ações *super user*;
- O administrador pode acessar todas as movimentações e saldo das contas, o usuário comum apenas da sua;
- Possibilidade do administrador marcar transação como fraudulenta e bloquear usuário recebedor;
- Possibilidade de "pagamento" de boletos reais, com verificação de vencimento e existência de saldo na conta;
- Depósito pode ser feito em real ou em dólar, com conversão baseada em cotação atual e com cobrança de taxa de câmbio;
- O administrador pode acompanhar os lucros do banco obtidos através desta cobrança de taxas;

---
## Tecnologias

No Iron Bank foi utilizado:
- **NodeJS**
- **Express**
- **MySQL**
- Json Web Token
- BCrypt
- Cross Fetch
- Dotenv
- HTTP Status Codes
- Mocha / Chai / Chai-HTTP
- EsLint

## Instalação

1. Clone o repositório
2. Instale as dependências
      - `npm install` para instalar tanto as dependências de produção quanto ambiente em desenvolvedor;
3. Você pode optar por criar variáveis de ambiente criando um arquivo `.env` ou, alternativamente, utilizar as variáveis alternativas no código:
      - PORT = 3000
      - DB_HOST = localhost
      - DB_PORT = 3306
      - DB_USER = root
      - DB_PW = admin
      - API_SECRET: braavos
4. Utilize o arquivo `seed.sql` na pasta *root* do projeto para rodar a *query* SQL que irá criar o banco de dados no seu servidor MySQL.
      - Atenção: o arquivo contém criação de *triggers* fazendo uso da sintaxe `DELIMITER` que pode não funcionar em alguns SGBDs;
      - O impacto da não criação dos *triggers* é a não marcação de data de atualização de algumas tabelas no banco e não é condição obrigatória para o funcionamento da API. Se        preferir, apague as linhas 104 a 124 do arquivo `seed.js`;
5. Após a criação do banco de dados, basta iniciar o projeto com um `npm start`.

---
## Testes

![tests-screenshot](https://i.ibb.co/smq6Xm7/tests-iron-Bank.jpg)

O projeto foi realizado via TDD com testes de integração (API), não houve tempo hábil para a criação de testes unitários mas essa melhoria pode ser implementada mais a frente.
Os testes foram feitos para rodarem em ambiente de homologação e, portanto, em um banco de dados de teste.

1. Certifiquje-se de que o servidor **não** está iniciado pelo `npm start`, os testes rodarão de maneira autônoma;
2. Inicie os testes com `npm test` e aguarde os 68 testes rodarem, esse processo deve levar cerca de 4 segundos;
3. Após a realização dos testes, caso queira, utilize o arquivo `seed.js` para resetar o banco (a automação deste processo de reset do banco de testes pode também ser objeto de melhoria futura em caso de mais tempo para realização do projeto).

---
# Endpoints

*Aconselha-se, para todos os endpoints manter o header `{ 'Content-Type', 'application/json' }`, sem prejuízo dos demais que serão elencados abaixo.*

## LOGIN
- `POST /login` requer o body `{ cpf: 'string de 11 dígitos', password: 'string livre' }` e retorna um token, que será utilizado no header das demais operações quando é passado cpf e senha de um usuário cadastrado no sistema. Para começar, sinta-se a vontade para utilizar o usuário administrador `{ cpf: '09859973628', password: 'braavos' }` (sim, sou eu!);
    - A API retornará `{ message: 'Invalid login or password.' }` se o body não for enviado, se o tamanho do CPF for diferente de 11 ou se os dados do usuário estiverem                errados;
    - Atenção: **o token expira** depois de 4hrs!


![api-screenshot](https://i.ibb.co/wY9YfRR/Captura-de-tela-2021-12-14-011809.png)

## USER
- `GET /user` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, um array com todos os usuários cadastrados no banco;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado ou não for                          administrador;

- `GET /user/:cpf` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, qualquer usuário cadastrado no banco, caso o usuário autenticado seja comum, ele conseguirá retornar apenas o seu próprio usuário;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado, não for                          administrador ou estiver tentando acessar um usuário que não é ele próprio;

![api-screenshot](https://i.ibb.co/jfdxf0m/Captura-de-tela-2021-12-14-011809.png)

- `POST /user` não requer token, já que qualquer deve poder criar seu usuário no banco, porém requer o body: { cpf: 'string de 11 dígitos', password: 'string livre', name: `string com pelo menos duas palavras` }, e criará um usuário no banco para livre utilização na API e todas as movimentações bancárias;
    - A API não aceitará requisições faltando parâmetros do body ou em formato indesejado;
    - A API não aceitará a criação de usuário já existente (baseado no CPF);
    - A API não aceitará a criação de usuário com CPF inválido, por isso utilize o [Gerador de CPF](https://www.4devs.com.br/gerador_de_cpf) para testá-la.

![api-screenshot](https://i.ibb.co/7WJdpKB/Captura-de-tela-2021-12-14-011809.png)

## BALANCE
- `GET /balance` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, um array com todos os saldos dos usuários cadastrados no banco por ordem decrescente de valor;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado ou não for                          administrador;

- `GET /balance/:cpf` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, o saldo qualquer usuário cadastrado no banco, caso o usuário autenticado seja comum, ele conseguirá retornar apenas o seu próprio saldo;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado, não for                          administrador ou estiver tentando acessar um saldo que não é dele próprio;

![api-screenshot](https://i.ibb.co/bRCZtWq/Captura-de-tela-2021-12-14-011809.png)

## TRANSACTION
- `GET /transaction` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, um array com todas as transações de todos os usuários cadastrados no banco;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado ou não for                          administrador;

- `GET /transaction/:cpf` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, todas as transações de um usuário específico no banco ou, caso o usuário autenticado seja comum, todas as transações envolvendo apenas o próprio usuário, tanto como remetente quanto como destinatário;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado, não for                          administrador ou estiver tentando acessar as transações de um usuário que não é ele próprio;

![api-screenshot](https://i.ibb.co/F3H0SH9/Captura-de-tela-2021-12-14-011809.png)

- `POST /transaction` requer token através do header: `{ token: 'jwt obtido através de login' }` e também requer o body: `{ receiver: 'cpf de usuário do banco', value: 'número inteiro ou de até duas casas decimais' }, e fará a transferência entre o a conta do usuário logado e a conta destino, no montante indicado no body;
    - A API não aceitará requisições faltando parâmetros do body ou em formato indesejado;
    - A API não aceitará transferências de valores superiores ao que o usuário tem de saldo;
    - A API não aceitará a transferência para usuário não existente ou bloqueado (baseado no CPF);
    - A API não aceitará que o usuário bloqueado faça transferências de sua conta;

![api-screenshot](https://i.ibb.co/6tSs1PH/Captura-de-tela-2021-12-14-011809.png)

- `PUT /transaction/fraud/:id_transaction` requer token através do header: `{ token: 'jwt obtido através de login' }` mas não requer body. Esta requisição servirá para indicar transações como fraudulentas e somente o administrador poderá realizá-la. Para descobrir o ID da transação suspeita, basta que o administrador acompanhe todas as transferências através do endpoint adequado já citado acima;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado, não for                          administrador ou estiver tentando acessar as transações de um usuário que não é ele próprio;
    - O usuário bloqueado não poderá receber dinheiro, transferir ou pagar;

![api-screenshot](https://i.ibb.co/cDn0S4g/Captura-de-tela-2021-12-14-011809.png)

## DEPOSIT
- `GET /deposit` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, um array com todos os depósitos de todos os usuários cadastrados no banco;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado ou não for                          administrador;

- `GET /deposit/:cpf` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, todos os depósitos de um usuário específico no banco ou, caso o usuário autenticado seja comum, todas depósitos para a sua própria conta;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado, não for                          administrador ou estiver tentando acessar os depósitos de um usuário que não é ele próprio;

![api-screenshot](https://i.ibb.co/xjWPMGS/Captura-de-tela-2021-12-14-011809.png)

- `POST /deposit` não requer token, partindo da premissa de que qualquer pessoa pode depositar em uma conta, porém requer o body também requer o body: `{ receiver: 'cpf de usuário do banco', currency: 'BRL ou USD', value: 'número inteiro ou de até duas casas decimais' }, e fará o depósito do valor indicado na conta destino. Em caso de depósito em dólar, o Iron Bank irá fazer a conversão em tempo real da cotação do dólar, irá depositar o valor em real, descontando a taxa de câmbio de 10%, que será destinado ao lucro do banco;
    - A API não aceitará requisições faltando parâmetros do body ou em formato indesejado;
    - A API não aceitará depósitos superiores a BRL 2.000,00 (tanto em real quanto em dólar, já convertendo nessa verificação);
    - A API não aceitará depósito para usuário não existente ou bloqueado (baseado no CPF);
    - A API não aceitará depósito em outras moedas senão dólar e real;

![api-screenshot](https://i.ibb.co/2yLT29C/Captura-de-tela-2021-12-14-011809.png)

## PAYMENT
- `GET /payment` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, um array com todos os pagamentos de boletos de todos os usuários cadastrados no banco;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado ou não for                          administrador;

- `GET /payment/:cpf` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, todos os pagamentos de boletos de um usuário específico no banco ou, caso o usuário autenticado seja comum, todas pagamentos da sua própria conta;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado, não for                          administrador ou estiver tentando acessar os depósitos de um usuário que não é ele próprio;

![api-screenshot](https://i.ibb.co/PC74b73/Captura-de-tela-2021-12-14-011809.png)

- `POST /payment` requer token através do header: `{ token: 'jwt obtido através de login' }` e também requer o body: `{ barcode: 'linha digitável de boleto com 47 dígitos (não elegível para contas de água, telefone e luz' }`, e fará o pagamento fictício do boleto, descontando o valor da conta autenticada;
    - A API não aceitará requisições faltando parâmetros do body ou em formato indesejado;
    - Você pode usar seus próprios boletos para testar, o banco não manterá registro dos códigos de barras;
    - Para efeitos de teste, use este boleto que vai demorar bastante para vencer: `{ barcode: '26090391918011797497451500000008798400000029856' }`;
    - A API não aceitará pagamentos de boletos vencidos;
    - A API não aceitará pagamentos se o valor do boleto for maior do que o saldo do usuário;

![api-screenshot](https://i.ibb.co/1Q0jfB1/Captura-de-tela-2021-12-14-011809.png)

## PROFIT
- `GET /payment` não requer body porém requer o header: { token: 'jwt obtido através de login' }, e retornará, se o usuário autenticado for administrador, o valor de lucro atual do Iron Bank, levando em conta as taxas de câmbio cobradas nos depósitos em dólar;
    - A API retornará `{ message: 'You are not logged in or you do not have permission to access this function.' }` se o usuário não estiver logado ou não for                          administrador;

![api-screenshot](https://i.ibb.co/TKrM9S6/Captura-de-tela-2021-12-14-011809.png)

---
## Issues
- Tickets informando erros, bugs, melhorias ou code-review são muito bem-vindos, sintam-se a vontade para [colaborar por aqui](https://github.com/tiagoornelas/iron-bank-api/issues)
