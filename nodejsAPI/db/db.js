const sqlDb = require('mssql');
const settings = require('./settings')


exports.executeSql = function (sql, callback, params = null) {

    var conn = new sqlDb.ConnectionPool(settings.dbConfig);
    
        conn.connect()
            .then(function () {
                
                const req = new sqlDb.Request(conn);

                //add input parameters if any were passed
                if(params) {               
                    for(let i = 0; i < params.length; i++) {
                        const type = getSqlType(params[i].type);
                        req.input(params[i].name, type, params[i].value);
                    }
                } 
                    
                req.query(sql)
                    .then(function (recordset) {
                        callback(recordset);
                    })
                    .catch(function (err) {
                        console.log(err);
                        callback(null, err);
                    });                
            })
            .catch(function (err) {
                console.log(err);
                callback(null, err);
            });

            
    };

    function getSqlType(type) {
        switch(type) {
            case "Int": return sqlDb.Int;
            case "NVarChar": return sqlDb.NVarChar;
            case "Bit": return sqlDb.Bit;
            case "Date": return sqlDb.DateTime;
            case "Buffer": return sqlDb.VarBinary;
            case "Table": return sqlDb.TVP;
            default: return sqlDb.NVarChar; 
        }

    }


    

   