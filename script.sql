use webchat;

CREATE TABLE IF NOT EXISTS users (
    username varchar(50) PRIMARY KEY,
    pwd varchar(200),
    role varchar(25)
);

CREATE TABLE IF NOT EXISTS messages (
    fromUser varchar(50),
    toUser varchar(50),
    msg varchar(300),
    date datetime,
    PRIMARY KEY (fromUser, toUser),
    FOREIGN KEY (fromUser) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (toUser) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE
);
