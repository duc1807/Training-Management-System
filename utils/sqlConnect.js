var mysql = require('mysql')



const getSqlConnection = () => {

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'learningmanagement'
      })

    connection.connect(function(err){
        if(!!err) console.log("Error")
        else console.log('Connected')
      })
      return connection
}

module.export = getSqlConnection
