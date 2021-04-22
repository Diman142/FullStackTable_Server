const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const PORT = process.env.PORT || 3001;

const db = mysql.createPool({
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'b0e6e1e2011322',
  password: 'cdeace8d',
  database: 'heroku_67d187db369a4a4',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.end('<h1>Hello Server</h1>');
});

app.get('/api/get', (req, res) => {
  const sqlSelect = 'SELECT * FROM users_reg';
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/api/calc', (req, res) => {
  const sqlSelect =
    'SELECT COUNT(UserID) FROM users_reg WHERE DATEDIFF(Last_Activity, Data_Registration) > 6 UNION ALL SELECT COUNT(UserID) FROM users_reg WHERE TO_DAYS(NOW()) - TO_DAYS(Data_Registration) < 6;'
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/api/delete', (req, res) => {
  let sqlDelete = 'TRUNCATE TABLE users_reg';

  db.query(sqlDelete, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/api/insert', (req, res) => {
  let sqlInsert = 'INSERT INTO users_reg (UserID, Data_Registration, Last_Activity) VALUES';

  req.body.newInfo.forEach((params, index) => {
    let str = '';

    if (index == req.body.newInfo.length - 1) {
      str = `("${params.UserID}", "${params.Data_Registration}", "${params.Last_Activity}");`;
    } else {
      str = `("${params.UserID}", "${params.Data_Registration}", "${params.Last_Activity}"),`;
    }

    sqlInsert = `${sqlInsert} ${str}`;
  });

  db.query(sqlInsert, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(PORT, () => {
  console.log('Port is running 3001');
});
