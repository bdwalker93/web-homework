const pino = require('pino')
const mongoose = require('mongoose')
const { TransactionModel } = require('./data-models/Transaction')
const { UserModel } = require('./data-models/User')
const { CompanyModel } = require('./data-models/Company')

const logger = pino({ prettyPrint: true })

const MONGO_URI = 'mongodb://localhost:27017/graphql'
 mongoose.Promise = global.Promise
 mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

var db = mongoose.connection;

db.on("error", function(err) {
  logger.error("Unable to connect: " + err)
});

db.once("open", function() {
    logger.info("Connection Successful!");
});

const USERS_TRANSACTIONS_SEED = [
  {
    user: {firstName: "firstName1", lastName: "lastName1", dob: "dob1", company_id: "company1"},
    transactions: [
      {user_id: "", amount: 1.0, credit: false, debit: true, description: "purchase1", merchant_id: "merchant1", company_id: "company1"},
      {user_id: "", amount: 2.0, credit: false, debit: true, description: "purchase2", merchant_id: "merchant2", company_id: "company1"},
    ]
  },
  {
    user: {firstName: "firstName2", lastName: "lastName2", dob: "dob2", company_id: "company2"},
    transactions: [
      {user_id: "", amount: 3.0, credit: false, debit: true, description: "purchase3", merchant_id: "merchant1", company_id: "company2"},
     {user_id: "", amount: 4.0, credit: true, debit: false, description: "purchase4", merchant_id: "merchant3", company_id: "company2"}
    ]
  },
]

const COMPANIES_SEED= [
  {name: "company1", credit_line: 1000, available_credit: 1000},
  {name: "company2", credit_line: 2000, available_credit: 2000},
]

const  displayTransactions = async =>{

  const query = TransactionModel.find();
  return query.exec();
}

const displayUsers = async => {

  const query = UserModel.find();
  return query.exec();

}
const displayCompanies = async => {
  const query = CompanyModel.find();
  return query.exec();
}

const clearDb = async => {
  return UserModel.deleteMany({}).then(() => {
    logger.info("USERS DELETED");
    return TransactionModel.deleteMany({}).then(() => {
      logger.info("TRANSACTIONS DELETED");
      return CompanyModel.deleteMany({}).then(() => {
        logger.info("DELETED");
      });
    });
  });
}

const addTransaction = async (user, trans) => {
    trans.user_id = user._id;
    const transactionModel = new TransactionModel(trans);
    return transactionModel.save();
}

const addUser = async item => {
  logger.info("seeding user")
  const userModel = new UserModel(item.user);
  return userModel.save().then((user) => {
    return Promise.all(item.transactions.map(trans => addTransaction(user, trans)))
  });
}

const addCompany = async company => {
  logger.info("seeding companies")
  const comapnyModel= new CompanyModel(company);
  return  comapnyModel.save();
}

const seedDb = async () => {
  return Promise.all(USERS_TRANSACTIONS_SEED.map(item => addUser(item))).then(() => {
    return Promise.all(COMPANIES_SEED.map(company => addCompany(company)));
  })
}

clearDb().then(() => seedDb()).then(() => {
  logger.info("Displaying Users");
  return displayUsers().then((users) => {
    logger.info(users);
  });
}).then(() => {
  logger.info("Displaying Transactions");
  return displayTransactions().then((trans) => {
    logger.info(trans);
  });
}).then(() => {
  logger.info("Displaying Companies");
  return displayCompanies().then((companies) => {
    logger.info(companies);
  });
}).then(() => db.close());

  





