const express = require('express')
const app = express()
const port = 3000
const Sequelize = require('sequelize');

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const sequelize = new Sequelize('spaceshooterdb', 'root', null, {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: './spaceshooterdb',

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

app.get('/get-shape', (req, res, next) => {
  const {
    name,
  } = req.body;

  console.log(name)

  sequelize.sync()
    .then(() => Shape.findOne({
      where: {
        id: 1,
      }
    }))
    .then(shape => {
      res.send(shape);
    })
});


app.post('/save-shape', (req, res, next) => {
  const {
    name,
    config,
  } = req.body;

  const Shape = sequelize.define('shape', {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });

  const ShapeConfig = sequelize.define('shape_config', {
    shape_id: { 
      type: Sequelize.INTEGER, 
      references: {
        model: Shape,
        key: 'id',
      }
    },
    color: Sequelize.STRING,
    row: Sequelize.INTEGER,
    column: Sequelize.INTEGER 
  });

  sequelize.sync()
    .then(() => Shape.create({
      name,
    }))
    .then(shape => {
      config.forEach((config) => {
        ShapeConfig.create({
          shape_id: shape.id,
          color: config.color,
          row: config.row,
          column: config.column,
        })
      });  
    });

    res.send('Hey');
});

app.use('/', express.static('.'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
