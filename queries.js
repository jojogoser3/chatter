const pg = require('pg');
const process_db = require('dotenv').config();
const db_url = process.env.DATABASE_URL || process_db.parsed.DB_URL;
const client = new pg.Client({
    connectionString: db_url,
    ssl: { rejectUnauthorized: false }
});
const Str = require('@supercharge/strings')
client.connect();

const insertChats = (request) => {


    const data = request;
    client.query('INSERT INTO chats (user_name, room, chat_text, date_time) VALUES ($1, $2, $3, NOW());',
        [data.user, data.room, data.msg], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(`Chat added to room: ${data.room}`);
        })
}

const getChats = (request) => {
    const room = request;
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM chats WHERE room = '" + room + "' ORDER BY date_time ASC;")
            .then(results => {
                console.log(results.rows);
                resolve(results.rows);
            })
            .catch(e => console.error(e.stack));
    })
}

const getUsers = () => {
    return new Promise((resolve, reject) => {
        client.query('SELECT user_name, status FROM users')
            .then(results => {
                console.log(results);
                resolve(results.rows);
            })
            .catch(e => console.error(e.stack));
    })

}

const checkToken = (request) => {
    return new Promise((resolve, reject) => {
        const token = request;
        client.query('SELECT (token) FROM users')
            .then(results => {
                const result = results.rows;
                var result_str = result.map((item) => {
                    return JSON.stringify(item.token);
                })
                if (result_str.includes(JSON.stringify(token.currentToken))) {
                    resolve(true);
                }
                else if (token == '') {
                    resolve(false);
                }
                else {
                    resolve(false);
                }
            })

    }).catch(e => console.error(e.stack))

}

const getCurrentUser = (user) => {

    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM users WHERE token = '" + user + "';")
            .then(result => {
                resolve(result.rows)
            })
            .catch(e => console.error(e.stack))
    });
}

const checkUser = (request) => {
    return new Promise((resolve, reject) => {
        const data = request;

        client.query('SELECT (user_name) FROM users')
            .then(results => {
                const result = results.rows;
                if (result.some(user => user.user_name === data) || data == '') {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
    }).catch(e => console.error(e.stack))

}

const insertUser = (user) => {
    return new Promise((resolve, reject) => {
        user = user.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const data = user;
        const salt = Str.random();

        client.query('INSERT INTO users (user_name, token, status) VALUES ($1, $2, $3)',
            [data, salt, 'online'], (error, results) => {
                if (error) {
                    throw error;
                } else {
                    resolve(salt);
                }
            })

    })
}

const deleteUser = (token) => {
    console.log(token);
    return new Promise((resolve, reject) => {
        client.query("DELETE FROM users WHERE token = '" + token + "';",
            (error, results) => {
                if (error) {
                    resolve(false);
                    throw error;
                } else {
                    resolve(true);
                }
            })
    })
}

const userAway = (token) => {
    return new Promise((resolve, reject) => {
        client.query("UPDATE users SET status = 'away' WHERE token = '" + token + "';",
            (error, results) => {
                if (error) {
                    resolve(false);
                    throw error;
                } else {
                    resolve(true);
                }
            })
    })
}

const userOnline = (token) => {
    return new Promise((resolve, reject) => {
        client.query("UPDATE users SET status = 'online' WHERE token = '" + token + "';",
            (error, results) => {
                if (error) {
                    resolve(false);
                    throw error;
                } else {
                    resolve(true);
                }
            })
    })
}


const userOffline = (token) => {
    return new Promise((resolve, reject) => {
        client.query("UPDATE users SET status = 'offline' WHERE token = '" + token + "';",
            (error, results) => {
                if (error) {
                    resolve(false);
                    throw error;
                } else {
                    resolve(true);
                }
            })
    })
}













module.exports = {
    insertUser,
    checkUser,
    checkToken,
    getUsers,
    getChats,
    getCurrentUser,
    insertChats,
    deleteUser,
    userOnline,
    userAway,
    userOffline


}