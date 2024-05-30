var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { buildSchema } = require('graphql');
const { defaultPlants } = require('./plants');
const fs = require('fs');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`  
  type Query {   
    plants: [Plant!]!
    beds: [Bed!]!
  }

  input PlantInput {
    name: String
    width: Int
    height: Int
  }

  input BedInput {
    name: String
    width: Int
    height: Int
  }

  input PlantBedInput {
    bedId: String
    plant: String
    x: Int
    y: Int
  }

  type Mutation {  
    addPlant(input: PlantInput): Plant
    addBed(input: BedInput): Bed
    addPlantToBed(input: PlantBedInput): Bed
  }

  type Plant {
    id: ID!
    name: String
    width: Int
    height: Int
  }

  type PlantBed {
    plant: String
    x: Int
    y: Int
  }

  type Bed {
    id: ID!
    name: String
    width: Int
    height: Int
    plants: [PlantBed!]!
  }
`);

// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

let beds = [];

let plants = [
  {
    id: '1',
    name: 'tomato',
    width: 2,
    height: 2
  },
  {
    id: '2',
    name: 'okra',
    width: 1,
    height: 1
  },
  {
    id: '3',
    name: 'pepper-hot',
    width: 1,
    height: 1
  },
  {
    id: '4',
    name: 'eggplant',
    width: 1,
    height: 1
  },
  {
    id: '5',
    name: 'lettuce',
    width: 1,
    height: 1
  }
];

function saveData() {
    const data = { plants, beds };
    fs.writeFile('output.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log('There was an error writing the file', err);            
        } else {
            console.log('Successfully wrote to output.json');            
        }
    });
}

function initializeData() {    
    fs.readFile('output.json', 'utf8', (err, data) => {
        if (err) {
            console.log('There was an error reading the file', err);
            res.status(500).send('There was an error loading the data');
        } else {
            console.log('Successfully read from output.json');
            const parsed = JSON.parse(data);            
            plants = parsed.plants;
            beds = parsed.beds;
        }
    });
}

// The root provides a resolver function for each API endpoint
var root = {  
  plants: () => plants,
  beds: () => beds,
  addPlant: ({ input }) => {
    var id = require('crypto').randomBytes(8).toString('hex');
    const newItem = {
      id,
      ...input
    };
    plants.push(newItem);
    saveData();
    return newItem;
  },
  addBed: ({ input }) => {
    var id = require('crypto').randomBytes(8).toString('hex');
    const newItem = {
      id,
      plants: [],
      ...input
    };
    beds.push(newItem);
    saveData();
    return newItem;
  },
  addPlantToBed: ({ input }) => {
    const itemIndex = beds.findIndex((item) => item.id === input.bedId);
    if (itemIndex > -1) {
      const plantsCopy = [...beds[itemIndex].plants];
      plantsCopy.push({ plant: input.plant, x: input.x, y: input.y });
      beds[itemIndex].plants = plantsCopy;
      saveData();
      return beds[itemIndex];
    } else {
      throw new Error('Item not found');
    }
  },  
};

var app = express();

initializeData();

// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root
  })
);

// Start the server at port
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
