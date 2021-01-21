const { model, Schema, SchemaTypes } = require('mongoose')

const CompanySchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  name: { type: String, default: null },
  credit_line: { type: Number, default: null },
})

const CompanyModel = model('company', CompanySchema)

module.exports = {
  CompanyModel,
  CompanySchema,
  default: CompanySchema
}
