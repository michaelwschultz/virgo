const express = require('express')
const app = express()
const port = 3001
const Sequelize = require('sequelize');
const { spawn } = require('child_process')
const fs = require('fs')
const _ = require('lodash');

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

app.use('/', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD',
    'Access-Control-Allow-Headers': 'content-type'
  })
  next()
})

app.get('/get-shape', (req, res, next) => {
  const { name } = req.query;
  Shape.findOne({
    where: {
      name,
    },
    include: [{
      model: ShapeConfig
    }]
  })
  .then(shape => {
    const shapeJSON = JSON.stringify(shape, null, 2);
    res.send(shapeJSON);
  });
});

app.get('/get-all-shapes', (req, res, next) => {
  console.log('trying to get all shapes');
  Shape.findAll({
    include: [{
      model: ShapeConfig
    }]
  })
  .then(shapes => {
    const shapesJSON = [];
    shapes.map(shape => {
      shapesJSON.push(JSON.stringify(shape, null, 2));
    })

    res.send(shapesJSON);
  });
});

app.post('/save-shape', (req, res, next) => {
  const {
    name,
    config,
  } = req.body;

  const sanitizedName = name.replace(/-/g, " ").split(/[\s]/).map((word, idx) => {
    if (idx > 0) {
      return _.startCase(_.toLower(word.trim()));
    }
    return word
  }).join('');

  // TODO: Add file overwrite logic
  const shapeFile = `${__dirname}/shapes/${sanitizedName}.js`;
  const data = `export const ${sanitizedName} = ${JSON.stringify(config, null, 2)};`;
  const shapeExists = fs.existsSync(shapeFile);
  return fs.promises.writeFile(shapeFile, data)
    .then(() => {
      if (!shapeExists) {
        const indexData = `\nexport { ${sanitizedName} } from './${sanitizedName}.js';`
        return fs.promises.appendFile(`${__dirname}/shapes/index.js`, indexData);
      }
    })
    .catch(err => {
      return res.sendStatus(500, `error saving ${sanitizedName}: ${err}`)
    });
});

app.use('/', express.static('.'));

app.listen(port, () => {
  const opts = {
    env: process.env,
    cwd: process.cwd(),
    stdio: ['inherit', process.stdout, process.stdout]
  }
  // Run parcel
  spawn('parcel', ['./index.html', '-p', 3000], opts)
  console.log(`Virgo API listening on port ${port}!`)
})
