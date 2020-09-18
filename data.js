const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tompkinscs'
})

export const isMember = (id) => {
    connection.query('SELECT * FROM members WHERE student_id = ?', [id.toUpperCase()], (err, res, field) => {
        if(err)
            throw err;
        else
            return (res[0] && res[0].student_id)
    })
}   