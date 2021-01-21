const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat } = graphql
const { TransactionModel } = require('../data-models/Transaction')
const { CompanyModel } = require('../data-models/Company')
const TransactionType = require('./transaction-type')
const CompanyType = require('./company-type')

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTransaction: {
      type: TransactionType,
      args: {
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat }
      },
      /* eslint-disable-next-line camelcase */
      resolve (parentValue, { user_id, description, merchant_id, debit, credit, amount }) {
        return (new TransactionModel({ user_id, description, merchant_id, debit, credit, amount })).save()
      }
    },
    addCompany: {
      type: CompanyType,
      args: {
        name: { type: GraphQLString },
        credit_line: { type: GraphQLFloat }
      },
      resolve(parentValue, {name, credit_line}){
        return (new CompanyModel({name, credit_line})).save()
      }
    }
  }
})

module.exports = mutation
