const express = require('express')
const app = express()
const port = 3000
const Sequelize = require('sequelize');

const bodyParser = require('body-parser');
const Op = Sequelize.Op;
const Model = Sequelize.Model;

app.use(bodyParser.json());

const sequelize = new Sequelize('spaceshooterdb', 'root', null, {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // SQLite only
  storage: './spaceshooterdb',
});

const Shape = sequelize.define('shapes', {
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

const ShapeConfig = sequelize.define('shape_configs', {
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

Shape.hasMany(ShapeConfig, { foreignKey: 'shape_id', sourceKey: 'id' });

app.get('/get-shape', (req, res, next) => {
  const { name } = req.query;
  console.log(name);
  Shape.findAll({
    where: {
      name,
    },
    include: [{
      model: ShapeConfig
    }]
  })
  .then(shape => {
    const shapeJSON = JSON.stringify(shape, null, 2);
    console.log(shapeJSON)
    res.send(shapeJSON);
  });
});

app.get('/get-all-shapes', (req, res, next) => {
  Shape.findAll({
    include: [{
      model: ShapeConfig
    }]
  })
  .then(shapes => {
    console.log('here are the shapes', shapes)
    res.send(shapes);
  });
});

app.post('/save-shape', (req, res, next) => {
  const {
    name,
    config,
  } = req.body;

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
