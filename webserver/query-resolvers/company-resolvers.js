const { CompanyModel } = require('../data-models/Company')
const { packageModel } = require('./utils.js')
const Transactions = require('./transaction-resolvers')
const Users = require('./user-resolvers')



async function find (parentValue, criteria) {
  const query = Object.keys(criteria).length
    ? CompanyModel.find(criteria)
    : CompanyModel.find()

  const companies = await query.exec()

  return packageModel(companies)
}

module.exports = {
  find,
}
