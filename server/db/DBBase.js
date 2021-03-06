var mysql = require('mysql')
var pool = null

function init() {
  pool = mysql.createPool({
    host: '106.15.206.180',
    user: 'test',
    password: 'Njnova211',
    port: '3306',
    database: 'Nova_game',
    charset: 'utf8mb4'
  })
}

init()

function query(sql, values, cb) {
  pool.getConnection((error, connection) => {
    if (error) {
      return typeof cb === 'function' && cb(error, null)
    }

    const args = [sql]
    if (cb) {
      args.push(values)
    } else {
      cb = values
    }

    console.log('SQL:', ...args)

    args.push((error, results, fields) => {
      connection.release()
      cb(error, results, fields)
    })

    connection.query.apply(connection, args)
  })
}

function insert(table, record) {
  return new Promise((resolve, reject) => {
    let sql = 'INSERT INTO `' + table + '` ('
    const keys = Object.keys(record)
    sql += keys.map(k => '`' + k + '`').join(', ')
    sql += ') VALUES ('
    sql += keys.map(k => '?').join(', ')
    sql += ')'

    const values = keys.map(k => record[k])

    query(sql, values, (error, results, fields) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          results,
          fields
        })
      }
    })
  })
}

function update(table, record, condition) {
  return new Promise((resolve, reject) => {
    let sql = 'UPDATE `' + table + '` SET '
    const keys = Object.keys(record)
    sql += keys
      .map(k => {
        return '`' + k + '`=?'
      })
      .join(',')
    sql += ' WHERE ' + condition

    const values = keys.map(k => record[k])

    query(sql, values, (error, results, fields) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          results,
          fields
        })
      }
    })
  })
}

function insertOrUpdate(table, record, condition) {
  return new Promise((resolve, reject) => {
    if (!condition) {
      reject(new Error('insert or update condition not exists'))
      return
    }
    let sql =
      'SELECT COUNT(*) as `count` FROM `' + table + '` WHERE ' + condition
    query(sql, (error, results, fields) => {
      const count = results[0].count
      if (count == 0) {
        insert(table, record)
          .then(resolve)
          .catch(reject)
      } else {
        update(table, record, condition)
          .then(resolve)
          .catch(reject)
      }
    })
  })
}

function select(table, condition, fields = []) {
  return new Promise((resolve, reject) => {
    if (!condition) {
      reject(new Error('select condition not exists'))
      return
    }
    let fieldSql = fields.length > 0 ? fields.join(',') : '*'
    let sql = 'SELECT ' + fieldSql + ' FROM `' + table + '` WHERE ' + condition
    query(sql, (error, results, fields) => {
      if (results.length > 0) {
        resolve(results[0])
      } else {
        resolve(null)
      }
    })
  })
}

function selectAll(table, condition, fields = []) {
    return new Promise((resolve, reject) => {
        if (!condition) {
            reject(new Error('select condition not exists'))
            return
        }
        let fieldSql = fields.length > 0 ? fields.join(',') : '*'
        let sql = 'SELECT ' + fieldSql + ' FROM `' + table + '` WHERE ' + condition
        query(sql, (error, results, fields) => {
            if (results.length > 0) {
                resolve(results)
            } else {
                resolve(null)
            }
        })
    })
}

function deleteWhere(table, condition) {
  return new Promise((resolve, reject) => {
    if (!condition) {
      reject(new Error('delete condition not exists'))
      return
    }
    let sql = 'DELETE  FROM `' + table + '` WHERE ' + condition
    query(sql, (error, results, fields) => {
      if (results.length > 0) {
        resolve(results[0])
      } else {
        resolve(null)
      }
    })
  })
}

// async function test() {
//   let ret = await select('nv_users', `account='13411111112'`)
//   console.log(ret)
// }

// test()

module.exports = {
  query,
  deleteWhere,
    selectAll,
  select,
  insert,
  update,
  insertOrUpdate
}
