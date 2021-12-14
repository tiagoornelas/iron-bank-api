# Seja bem-vindo ao Iron Bank!

Esse foi o resultado de **15 horas** de projeto para desenvolvimento de uma API REST com funções relacionadas ao gerenciamento de contas bancárias. O trabalho foi desenvolvido nos dias 09/12/2021 das 15hrs as 20rs e 13/12/2021 das 14hrs até meia noite com auxílio de bastante café. O projeto foi realizado via **TDD** e utilizando a branch *'tdd-creation'* que, após testada foi mergeada.

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
    - [Transaction](#transaction)
    - [Deposit](#deposit)
    - [Payment](#payment)
    - [Balance](#balance)
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

No Iron Bank foi utilizado **NodeJS, Express, MySQL, Json Web Token, BCrypt, Cross Fetch, .env, HTTP Status Codes**; para testes de integração foi utilizado **Mocha, Chai, Chai-HTTP** e, por fim, para padrões de formatação utilizou-se o **EsLint**.

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

O projeto foi realizado via TDD com testes de integração (API), não houve tempo hábil para a criação de testes unitários mas essa melhoria pode ser implementada mais a frente.
Os testes foram feitos para rodarem em ambiente de homologação e, portanto, em um banco de dados de teste.

1. Certifiquje-se de que o servidor **não** está iniciado pelo `npm start`, os testes rodarão de maneira autônoma;
2. Inicie os testes com `npm tests` e aguarde os 68 testes rodarem, esse processo deve levar cerca de 4 segundos;
3. Após a realização dos testes, caso queira, utilize o arquivo `seed.js` para resetar o banco (a automação deste processo de reset do banco de testes pode também ser objeto de melhoria futura em caso de mais tempo para realização do projeto).

---
# Endpoints

# LOGIN 
