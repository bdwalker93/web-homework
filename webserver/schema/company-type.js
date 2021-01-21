const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat
} = graphql

const Transactions = require('../query-resolvers/transaction-resolvers.js');

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    credit_line: { type: GraphQLFloat },
    available_credit: { 
      type: GraphQLFloat,
      async resolve(parentValue, args) {
        const trans = await Transactions.find({company_id: parentValue.name});
        const totalSpent =  trans.map(item => item.amount).reduce((prev, curr) => prev + curr, 0);
        return (parentValue.credit_line - totalSpent);

      }
    },
  })
})

module.exports = CompanyType
