DROP SCHEMA IF EXISTS iron_bank_api;

CREATE SCHEMA iron_bank_api;

USE iron_bank_api;

CREATE TABLE user (
  id_user INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(250),
  cpf VARCHAR(14) NOT NULL,
  admin TINYINT DEFAULT 0,
  blocked TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,
  blocked_at DATETIME,
  UNIQUE (cpf),
  PRIMARY KEY (id_user)
) ENGINE = InnoDB;

CREATE TABLE transaction (
  id_transaction INT NOT NULL AUTO_INCREMENT,
  from_user INT,
  to_user INT,
  value DECIMAL(11,2) NOT NULL,
  fraud_flag TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,
  flagged_at DATETIME,
  PRIMARY KEY (id_transaction),
  FOREIGN KEY (from_user) REFERENCES user(id_user) ON DELETE SET NULL,
  FOREIGN KEY (to_user) REFERENCES user(id_user) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE exchange_fee (
  id_exchange_fee INT NOT NULL AUTO_INCREMENT,
  usd_value DECIMAL(11,2) NOT NULL,
  exchange_price DECIMAL(11,2) NOT NULL,
  exchange_fee_brl DECIMAL(11,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_exchange_fee)
) ENGINE = InnoDB;

CREATE TABLE deposit (
  id_deposit INT NOT NULL AUTO_INCREMENT,
  to_user INT,
  value DECIMAL(11,2) NOT NULL,
  id_exchange_fee INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_deposit),
  FOREIGN KEY (to_user) REFERENCES user(id_user) ON DELETE SET NULL,
  FOREIGN KEY (id_exchange_fee) REFERENCES exchange_fee(id_exchange_fee)
) ENGINE = InnoDB;

CREATE TABLE payment (
  id_payment INT NOT NULL AUTO_INCREMENT,
  from_user INT,
  value DECIMAL(11,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_payment),
  FOREIGN KEY (from_user) REFERENCES user(id_user) ON DELETE SET NULL
) ENGINE = InnoDB;

INSERT INTO
	user (name, password, cpf, admin)
VALUES
	('Tiago Ornelas', '$2b$10$cLuoa5AR7FfHdALCDiGoyeHtMlw4nW/q.h/egakWrwFxrZBzURbRC', '09859973628', 1),
  ('Admin Braavos', '$2b$10$cLuoa5AR7FfHdALCDiGoyeHtMlw4nW/q.h/egakWrwFxrZBzURbRC', '12345678901', 1),
  ('Usuário Teste', '$2b$10$cLuoa5AR7FfHdALCDiGoyeHtMlw4nW/q.h/egakWrwFxrZBzURbRC', '11111111111', 0),
  ('Pai do Usuário Teste', '$2b$10$cLuoa5AR7FfHdALCDiGoyeHtMlw4nW/q.h/egakWrwFxrZBzURbRC', '22222222222', 0);

INSERT INTO
	transaction (from_user, to_user, value)
VALUES
    (2, 1, 10000),
    (1, 3, 500),
    (4, 3, 1000);

INSERT INTO
	exchange_fee (usd_value, exchange_price, exchange_fee_brl)
VALUES
    (5000, 5, 2500),
    (50, 5, 25),
    (100, 5, 50);

INSERT INTO
	deposit (to_user, value, id_exchange_fee)
VALUES
    (2, 22500, 1),
    (1, 225, 2),
    (4, 450, 3);

INSERT INTO
	payment (from_user, value)
VALUES
    (1, 450),
    (2, 370);

DELIMITER $$
CREATE TRIGGER onUpdateUser BEFORE UPDATE
ON user FOR EACH ROW
BEGIN
  SET 
    NEW.updated_at = now();
END
$$

CREATE TRIGGER onUpdateTransaction BEFORE UPDATE
ON transaction FOR EACH ROW
BEGIN
  SET 
    NEW.updated_at = now();
END
$$

DELIMITER ;