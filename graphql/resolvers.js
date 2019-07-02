var gql = require('graphql');
var sql = require('mssql');

var generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

var getConfig = (connection) => {
  if (connection) {
    return {
      user: connection.user,
      password: connection.password,
      server: connection.server,
      options: {
        encrypt:true,
        // instance: connection.instance,
        database: connection.database
      }
    }
  }

  // return {
  //   user: "sa",
  //   password: "Hangten#16",
  //   server: "18.208.153.181",
  //   options: {
  //     instance: "SQLExpress",
  //     database: "calmed"
  //   }
  // };
}

const resolvers = {
  Query: {
    allDoctors: (_, {
      connection
    }) => {
      return new Promise(async (resolve, reject) => {
        try {
          var config = getConfig(connection)
          console.log('allDoctors', config)
          await sql.close();
          var conn=`Server=${config.server},1433;Database=${config.options.database};User Id=${config.user};Password=${config.password};Encrypt=true`
          await sql.connect(conn);
          let result = await sql.query('select DctId, DctName from xerex_dowood.dbo.xrxDct')
          await sql.close();
          resolve(result.recordset)
        } catch (err) {
          await sql.close();
          reject(err)
        } finally {
          await sql.close();
        }
      })
    },
    allFacilities: (_, {
      connection
    }) => {
      return new Promise(async (resolve, reject) => {
        try {
          var config = getConfig(connection)
          console.log('allFacilities', config)
          await sql.close();
          var conn=`Server=${config.server},1433;Database=${config.options.database};User Id=${config.user};Password=${config.password};Encrypt=true`
          await sql.connect(conn);
          let result = await sql.query('select FclId, FclDesc from xerex_dowood.dbo.xrxFcl')
          await sql.close();
          resolve(result.recordset)
        } catch (err) {
          await sql.close();
          reject(err)
        } finally {
          await sql.close();
        }
      })
    },
    allAppointmentTypes: (_, {
      connection
    }) => {
      return new Promise(async (resolve, reject) => {
        try {
          var config = getConfig(connection)
          console.log('allAppointmentTypes', config)
          await sql.close();
          var conn=`Server=${config.server},1433;Database=${config.options.database};User Id=${config.user};Password=${config.password};Encrypt=true`
          await sql.connect(conn);
          let result = await sql.query('select RecNo, [Type] from xerex_dowood.dbo.xrxAppType')
          await sql.close();
          resolve(result.recordset)
        } catch (err) {
          await sql.close();
          reject(err)
        } finally {
          await sql.close();
        }
      })
    },
    patientAppointmentsList: (_, {
      connection,
      PatId
    }) => {
      return new Promise(async (resolve, reject) => {
        try {
          var config = getConfig(connection)
          console.log('patientAppointmentsList', config, PatId)
          await sql.close();
          var conn=`Server=${config.server},1433;Database=${config.options.database};User Id=${config.user};Password=${config.password};Encrypt=true`
          await sql.connect(conn);
          let result = await sql.query(`SELECT RecNo,PatId,DctId,FclId,DctName,FclDesc,Duration,AppType,AppDate,AppTime,EntryDateTime FROM xerex_dowood.dbo.xrxAppSch`)
          await sql.close();
          resolve(result.recordset)
        } catch (err) {
          await sql.close();
          reject(err)
        } finally {
          await sql.close();
        }
      })
    }
  },
  Mutation: {
    createAppointment: (_, {
      connection,
      appointment
    }) => {
      console.log('create called', appointment)
      return new Promise(async (resolve, reject) => {
        try {
          var config = getConfig(connection)
          console.log('createAppointment', config, appointment)
          await sql.close();
          var conn=`Server=${config.server},1433;Database=${config.options.database};User Id=${config.user};Password=${config.password};Encrypt=true`
          await sql.connect(conn);
          var recNo = generateUUID();
          await sql.query(`INSERT INTO xerex_dowood.dbo.xrxAppSch(RecNo,PatId,PatName,DctId,DctName,FclDesc,FclId,AppType,Duration,AppDate,AppTime) VALUES('${recNo}','${appointment.PatId}','${appointment.PatName}','${appointment.DctId}','${appointment.DctName}','${appointment.FclDesc}','${appointment.FclId}','${appointment.AppType}','${appointment.Duration}','${appointment.AppDate}','${appointment.AppTime}')`)
          let result = await sql.query(`SELECT * FROM xerex_dowood.dbo.xrxAppSch WHERE RecNo='${recNo}'`)
          console.log(JSON.stringify(result.recordset))
          await sql.close();
          resolve(result.recordset[0])
        } catch (err) {
          await sql.close();
          reject(err)
        } finally {
          await sql.close();
        }
      })
    }
  }

};

module.exports = resolvers;