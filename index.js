// Creates an ApolloServer instance with the specified GraphQL schema,
// resolvers, and data sources. Configures the server to have no timeout,
// listen on port 9000, and log the URL when ready.
// Import Apollo Server and schema 
const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import"); 

// Import data source 
const EtherDataSource = require("./datasource/ethDatasource");

// Import schema
const typeDefs = importSchema("./schema.graphql");

// Load environment variables
require("dotenv").config();

// Define resolvers
const resolvers = {
  Query: {
    // Get ether balance for address
    balanceByAddress: (root, args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Get total supply of ether    
    totalSupply: (root, args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Get latest Ethereum price
    price: (root, args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Get block confirmation time
    transactionTime: (root, args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  }
}

// Create ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }),
});

// Set no timeout
server.timeout = 0;
// Start server on port 9000
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
