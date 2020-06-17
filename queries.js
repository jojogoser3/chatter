const pg = require('pg');
const process_db = require('dotenv').config();
const db_url = process.env.DATABASE_URL || process_db.parsed.DB_URL;
const client = new pg.Client({
    connectionString: db_url,
    ssl: { rejectUnauthorized: false }
});
const Str = require('@supercharge/strings')
client.connect();


// const Cookies = require('js-cookie');
// const cookies = require('cookies');
// const tech = io.of('/tech');

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
    client.query("SELECT * FROM chats WHERE room = '"+room+"' ORDER BY date_time ASC;")
        .then(results => {
            console.log(room);
            resolve(results.rows);
        })
        .catch(e => console.error(e.stack));
})
}

const getUsers = () => {
    return new Promise((resolve, reject) => {
    client.query('SELECT (user_name) FROM users')
        .then(results => {
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
                else if (token == ''){
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
        client.query("SELECT * FROM users WHERE token = '"+user+"';")
        .then(result => {
            resolve(result.rows)
        })
        .catch(e => console.error(e.stack))
    });
}
// const checkUser = new Promise((resolve, reject) => {
//     client.query('SELECT (user_name) FROM users')
//             .then(results => {
//             const result = results.rows;
//             if (result.some(user => user.user_name === data.user_name) || data.user_name == '') {
//                 console.log('username-taken');
//                 resolve(false);
//             } else {
//                 console.log('working')
//                 resolve(data.user_name);
//             }
//             console.log('fe');
//         })
//     // .catch(e => console.error(e.stack));
// })


// const insertUser = (request) => {
//     return new Promise((resolve, reject) => {

//     })

// }

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
    const data = user;
    const salt = Str.random();

    client.query('INSERT INTO users (user_name, token) VALUES ($1, $2)',
        [data, salt], (error, results) => {
            if (error) {
                throw error;
            } else {
                console.log(data);
                resolve(salt);
            }
        })
        
    })
    }

        
//             // .catch(e => console.error(e.stack));
//     }).then(request => {
//         console.log(request);
//     })

// }
//         const checkUser = new Promise((resolve, reject) => {
//             client.query('SELECT (user_name) FROM users')
//                 .then(results => {
//                     const data = results;
//                     const salt = Str.random();

//                     client.query('INSERT INTO users (user_name, token) VALUES ($1, $2)',
//                         [data, salt], (error, results) => {
//                             if (error) {
//                                 throw error;
//                             } else {

//                             }
//                         })
//                     resolve(results.rows);
//                 })
//                 .catch(e => console.error(e.stack));
//         })
















// const insertUser = (request) => {
//     const data = request;
//     var resultvalue = '';
//     client.query('SELECT (user_name) FROM users')
//         .then(results => {

//             const result = results.rows;
//             if (result.some(user => user.user_name === data.user_name) || data.user_name == '') {
//                 resultvalue = 'test';
//                 console.log('poep');
//             } else {
//                 client.query('INSERT INTO users (user_name) VALUES ($1)',
//                     [data.user_name], (error, results) => {
//                         if (error) {
//                             throw error;
//                         }

//                     })
//             }
//             done(resultvalue);
//         })

// }



module.exports = {
            insertUser,
            checkUser,
            checkToken,
            getUsers,
            getChats,
            getCurrentUser,
            insertChats,
            
            
            
        }