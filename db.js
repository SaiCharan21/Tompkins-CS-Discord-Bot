const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tompkinscs'
})

const checkForMember =  (id, cb) => {
    connection.query(
        "SELECT * FROM members WHERE student_id = ?",
        [id.toUpperCase()],
        async (err, res, field) => {
            if (err) throw err;
            exists = (res[0] && res[0].student_id)
            cb(exists, res[0].name)
        }
    );
};

const checkByName = (nickname, cb) => {
    connection.query(
        "SELECT * FROM members WHERE name = ?",
        [nickname],
        async (err, res, field) => {
            if (err) throw err;
            exists = (res[0] && res[0].name)
            if(exists)
                cb(exists, res[0].name || "")
            else
                cb(exists)
        }
    );
}

module.exports = { checkForMember, checkByName }