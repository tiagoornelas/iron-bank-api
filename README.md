# Welcome to the Iron Bank!
![Created](https://img.shields.io/badge/created-December%202021-lightgrey)

![braavos](https://i.ibb.co/pW1V0Gg/32fe0a36240b2cb063fa3d5508c0f514.jpg)

> ℹ️ **Note:** This project was developed strictly for study and educational purposes.

This project was created for study purposes, resulting from **15 hours** of work to develop a REST API with bank account management features. The work was carried out on 12/09/2021 from 3:00 PM to 8:00 PM and on 12/13/2021 from 2:00 PM until midnight, fueled by plenty of coffee. The project was built using **TDD** on the *'tdd-creation'* branch, which was merged after testing.

[LinkedIn](https://www.linkedin.com/in/tiagoornelasadv/)<br />
advtiagoornelas@gmail.com

---
## Table of Contents
- [Requirements](#requirements)
- [Technologies](#technologies)
- [Installation](#installation)
- [Tests](#tests)
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
## Requirements

Mandatory requirements:
- To open an account, only the person's full name and CPF are required, but only one account per person is allowed;
- With this account, it is possible to transfer to other accounts and make deposits;
- Negative balances are not allowed;
- For security reasons, each deposit transaction cannot exceed R$ 2,000;
- Transfers between accounts are free and unlimited;

Extra requirements developed in the project:
- Login for user authentication;
- Passwords are encrypted in the database;
- Distinction between administrator and regular users, allowing *super user* actions;
- The administrator can access all transactions and account balances, while regular users can only access their own;
- Ability for administrators to flag transactions as fraudulent and block the recipient user;
- Ability to "pay" real bank slips (*boletos*), with due date verification and account balance checks;
- Deposits can be made in BRL or USD, with conversion based on real-time quotes and currency exchange fee deduction;
- The administrator can track bank profits generated from these exchange fees;

---
## Technologies

Iron Bank uses:
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

## Installation

1. Clone the repository
2. Install dependencies
      - `npm install` to install both production and development dependencies;
3. You can set up environment variables by creating a `.env` file or, alternatively, use the fallback variables in the code:
      - PORT = 3000
      - DB_HOST = localhost
      - DB_PORT = 3306
      - DB_USER = root
      - DB_PW = admin
      - API_SECRET: braavos
4. Use the `seed.sql` file in the project *root* folder to run the SQL query that will create the database on your MySQL server.
      - Attention: the file contains trigger creation using the `DELIMITER` syntax, which may not work in some DBMSs;
      - The impact of not creating the triggers is that update timestamps won't be set for some tables in the database, which is not a mandatory condition for the API to function. If you prefer, delete lines 104 to 124 in `seed.js`;
5. After creating the database, simply start the project with `npm start`.

---
## Tests

![tests-screenshot](https://i.ibb.co/smq6Xm7/tests-iron-Bank.jpg)

The project was built via TDD with integration tests (API); there was not enough time to create unit tests, but [this improvement](https://github.com/tiagoornelas/iron-bank-api/issues/2) can be implemented in the future.
The tests were designed to run in a staging environment and, therefore, on a test database.

1. Make sure the server is **not** running via `npm start`; the tests will run autonomously;
2. Run the tests with `npm test` and wait for the 68 tests to run; this process should take about 4 seconds;
3. After running tests, if desired, use the `seed.js` file to reset the database (automating this test database reset process can also be a [future improvement](https://github.com/tiagoornelas/iron-bank-api/issues/3) given more development time).

---
# Endpoints

*For all endpoints, it is advised to maintain the header `{ 'Content-Type': 'application/json' }`, along with any others listed below.*

## LOGIN
- `POST /login` requires the body `{ cpf: '11-digit string', password: 'free string' }` and returns a token, which will be used in the header for subsequent operations when the CPF and password of a registered user are provided. To get started, feel free to use the administrator user `{ cpf: '09859973628', password: 'braavos' }` (yes, that's me!);
    - The API will return `{ message: 'Invalid login or password.' }` if the body is not sent, if the CPF length is different from 11, or if the user credentials are incorrect;
    - Attention: **the token expires** after 4 hours!


![api-screenshot](https://i.ibb.co/wY9YfRR/Captura-de-tela-2021-12-14-011809.png)

## USER
- `GET /user` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, an array with all users registered in the database;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in or is not an administrator;

- `GET /user/:cpf` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, any user registered in the database; if the authenticated user is a regular user, it will return only their own user;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in, is not an administrator, or is trying to access a user other than themselves;

![api-screenshot](https://i.ibb.co/jfdxf0m/Captura-de-tela-2021-12-14-011809.png)

- `POST /user` does not require a token, since anyone should be able to register in the bank, but requires the body: `{ cpf: '11-digit string', password: 'free string', name: 'string with at least two words' }`, and will create a user in the database for free use in the API and all banking transactions;
    - The API will not accept requests with missing body parameters or in an undesired format;
    - The API will not accept creating an already existing user (based on CPF);
    - The API will not accept creating a user with an invalid CPF, so use the [CPF Generator](https://www.4devs.com.br/gerador_de_cpf) to test it.

![api-screenshot](https://i.ibb.co/7WJdpKB/Captura-de-tela-2021-12-14-011809.png)

## BALANCE
- `GET /balance` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, an array with all balances of users registered in the database in descending order of value;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in or is not an administrator;

- `GET /balance/:cpf` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, the balance of any user registered in the database; if the authenticated user is a regular user, they will only be able to retrieve their own balance;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in, is not an administrator, or is trying to access a balance that is not their own;

![api-screenshot](https://i.ibb.co/bRCZtWq/Captura-de-tela-2021-12-14-011809.png)

## TRANSACTION
- `GET /transaction` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, an array with all transactions of all users registered in the database;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in or is not an administrator;

- `GET /transaction/:cpf` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, all transactions of a specific user in the database or, if the authenticated user is a regular user, all transactions involving only the user themselves, both as sender and as recipient;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in, is not an administrator, or is trying to access transactions of a user other than themselves;

![api-screenshot](https://i.ibb.co/F3H0SH9/Captura-de-tela-2021-12-14-011809.png)

- `POST /transaction` requires a token via header: `{ token: 'jwt obtained via login' }` and also requires the body: `{ receiver: 'bank user cpf', value: 'integer or number with up to two decimal places' }`, and will perform the transfer between the logged-in user's account and the destination account, for the amount indicated in the body;
    - The API will not accept requests with missing body parameters or in an undesired format;
    - The API will not accept transfers for amounts greater than the user's available balance;
    - The API will not accept transfers to a non-existent or blocked user (based on CPF);
    - The API will not allow a blocked user to make transfers from their account;

![api-screenshot](https://i.ibb.co/6tSs1PH/Captura-de-tela-2021-12-14-011809.png)

- `PUT /transaction/fraud/:id_transaction` requires a token via header: `{ token: 'jwt obtained via login' }` but does not require a body. This request serves to flag transactions as fraudulent and only an administrator can perform it. To find the ID of the suspicious transaction, the administrator simply needs to monitor all transfers using the appropriate endpoint mentioned above;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in, is not an administrator, or is trying to access transactions of a user other than themselves;
    - A blocked user will not be able to receive money, transfer, or pay;

![api-screenshot](https://i.ibb.co/cDn0S4g/Captura-de-tela-2021-12-14-011809.png)

## DEPOSIT
- `GET /deposit` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, an array with all deposits of all users registered in the database;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in or is not an administrator;

- `GET /deposit/:cpf` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, all deposits of a specific user in the database or, if the authenticated user is a regular user, all deposits to their own account;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in, is not an administrator, or is trying to access deposits of a user other than themselves;

![api-screenshot](https://i.ibb.co/xjWPMGS/Captura-de-tela-2021-12-14-011809.png)

- `POST /deposit` does not require a token, based on the premise that anyone can deposit into an account, but requires the body: `{ receiver: 'bank user cpf', currency: 'BRL or USD', value: 'integer or number with up to two decimal places' }`, and will deposit the specified value into the destination account. In case of a USD deposit, Iron Bank will convert the real-time USD exchange rate and deposit the amount in BRL, deducting a 10% exchange fee, which will be credited to the bank's profit;
    - The API will not accept requests with missing body parameters or in an undesired format;
    - The API will not accept deposits exceeding BRL 2,000.00 (both in BRL and USD, already converted in this verification);
    - The API will not accept deposits for a non-existent or blocked user (based on CPF);
    - The API will not accept deposits in currencies other than USD and BRL;

![api-screenshot](https://i.ibb.co/2yLT29C/Captura-de-tela-2021-12-14-011809.png)

## PAYMENT
- `GET /payment` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, an array with all bank slip payments of all users registered in the database;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in or is not an administrator;

- `GET /payment/:cpf` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, all bank slip payments of a specific user in the database or, if the authenticated user is a regular user, all payments from their own account;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in, is not an administrator, or is trying to access payments of a user other than themselves;

![api-screenshot](https://i.ibb.co/PC74b73/Captura-de-tela-2021-12-14-011809.png)

- `POST /payment` requires a token via header: `{ token: 'jwt obtained via login' }` and also requires the body: `{ barcode: '47-digit bank slip barcode line (not eligible for utility bills such as water, phone, and electricity)' }`, and will make a mock payment for the bank slip, deducting the amount from the authenticated account;
    - The API will not accept requests with missing body parameters or in an undesired format;
    - You can use your own bank slips for testing; the bank will not store barcode records;
    - For testing purposes, use this bank slip which has a far-off expiration date: `{ barcode: '26090391918011797497451500000008798400000029856' }`;
    - The API will not accept payments for expired bank slips;
    - The API will not accept payments if the bank slip amount is greater than the user's balance;

![api-screenshot](https://i.ibb.co/1Q0jfB1/Captura-de-tela-2021-12-14-011809.png)

## PROFIT
- `GET /profit` does not require a body but requires the header: `{ token: 'jwt obtained via login' }`, and will return, if the authenticated user is an administrator, the current profit amount of Iron Bank, taking into account the exchange fees charged on dollar deposits;
    - The API will return `{ message: 'You are not logged in or you do not have permission to access this function.' }` if the user is not logged in or is not an administrator;

![api-screenshot](https://i.ibb.co/TKrM9S6/Captura-de-tela-2021-12-14-011809.png)

---
## Issues
- Issues reporting errors, bugs, improvements, or code reviews are very welcome; feel free to [collaborate here](https://github.com/tiagoornelas/iron-bank-api/issues)
