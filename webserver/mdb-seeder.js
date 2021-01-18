const pino = require('pino')
const mongoose = require('mongoose')
const { TransactionModel } = require('./data-models/Transaction')
const { UserModel } = require('./data-models/User')

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

const SEED_LIST = [
  {
    user: {firstName: "firstName1", lastName: "lastName1", dob: "dob1"},
    transactions: [
      {user_id: "", amount: 1.0, credit: false, debit: true, description: "purchase1", merchant_id: "merchant1"},
      {user_id: "", amount: 2.0, credit: false, debit: true, description: "purchase2", merchant_id: "merchant2"},
    ]
  },
  {
    user: {firstName: "firstName2", lastName: "lastName2", dob: "dob2"},
    transactions: [
      {user_id: "", amount: 3.0, credit: false, debit: true, description: "purchase3", merchant_id: "merchant1"},
      {user_id: "", amount: 4.0, credit: true, debit: false, description: "purchase4", merchant_id: "merchant3"},
    ]
  },
]

const  displayTransactions = async =>{

  const query = TransactionModel.find();
  return query.exec();
}

const displayUsers = async => {

  const query = UserModel.find();
  return query.exec();
}

const clearDb = async => {
  return UserModel.deleteMany({}).then(function(){
    logger.info("USERS DELETED");
    return TransactionModel.deleteMany({}).then(function(){
    logger.info("TRANSACTIONS DELETED");
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

const seedDb = async () => {
    return Promise.all(SEED_LIST.map(item => addUser(item)))
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
}).then(() => db.close());

  





