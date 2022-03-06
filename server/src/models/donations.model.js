const mongoose = require('mongoose')
const allowedСurrencies = ['USD', 'EUR', 'GBP', 'RUB']

const DonationsSchema = new mongoose.Schema({
  amount: { type: Number, min: 0, reuired: true },
  currency: { type: String, reuired: true, enum: allowedСurrencies },
})

const Donations = mongoose.model('Donations', DonationsSchema)

export { Donations, allowedСurrencies }
