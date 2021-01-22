const { CompanyModel } = require('../data-models/Company')
const { packageModel } = require('./utils.js')
const Transactions = require('./transaction-resolvers')
const Users = require('./user-resolvers')

async function find (parentValue, criteria) {

  var specialCase = {};

  if(criteria.hasOwnProperty("available_credit")){
    specialCase.available_credit = criteria.available_credit;
    delete criteria.available_credit;
  }

  const query = Object.keys(criteria).length
    ? CompanyModel.find(criteria)
    : CompanyModel.find()

  var companies = await query.exec()

    companies = packageModel(companies)


    if(Object.keys(specialCase).length > 0)
    {
        const transactions = await Promise.all(
          companies.map(comp => Transactions.find({company_id: comp.name}))
        );

        companies = companies.filter((comp) => {
        const totalSpent =  transactions[0].map(item => item.amount).reduce((prev, curr) => prev + curr, 0);
        return ((comp.credit_line - totalSpent) === specialCase.available_credit);
      });
    }

    return companies;
  }

module.exports = {
  find,
}
