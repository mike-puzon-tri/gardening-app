var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`  
  type Query {
    hello: String
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    getMessage(id: ID!): Message
    getMessages: [Message]
    plants: [Plant!]!
    beds: [Bed!]!
  }

  input MessageInput {
    content: String
    author: String
  }

  input PlantInput {
    name: String
    width: Int
    height: Int
  }

  input BedInput {
    width: Int
    height: Int
  }

  input PlantBedInput {
    bedId: String
    plant: String
    x: Int
    y: Int
  }

  type Message {
    id: ID!
    content: String
    author: String
  }
 
  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
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

// Maps username to content
var fakeDatabase = {};

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
  }
];

let beds = [];

// The root provides a resolver function for each API endpoint
var root = {
  hello() {
    return 'Hello world!';
  },
  quoteOfTheDay() {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random() {
    return Math.random();
  },
  rollThreeDice() {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6));
  },
  getMessage({ id }) {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  getMessages() {
    const messages = [];
    const entries = Object.entries(fakeDatabase);

    for (let index = 0; index < entries.length; index++) {
      const id = entries[index][0];
      const value = entries[index][1];
      messages.push({ ...value, id });
    }

    return messages;
  },
  createMessage({ input }) {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    console.log(fakeDatabase);
    return new Message(id, input);
  },
  updateMessage({ id, input }) {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  plants: () => plants,
  beds: () => beds,
  addPlant: ({ input }) => {
    var id = require('crypto').randomBytes(8).toString('hex');
    const newItem = {
      id,
      ...input
    };
    plants.push(newItem);
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
    return newItem;
  },
  addPlantToBed: ({ input }) => {
    const itemIndex = beds.findIndex((item) => item.id === input.bedId);
    if (itemIndex > -1) {
      const plantsCopy = [...beds[itemIndex].plants];
      plantsCopy.push({ plant: input.plant, x: input.x, y: input.y });
      beds[itemIndex].plants = plantsCopy;
      return beds[itemIndex];
    } else {
      throw new Error('Item not found');
    }
  },
  modifyItem: (_, { id, name }) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      items[itemIndex].name = name;
      return items[itemIndex];
    } else {
      throw new Error('Item not found');
    }
  }
};

var app = express();

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
