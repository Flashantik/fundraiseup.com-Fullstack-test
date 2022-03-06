const mongoose = require('mongoose')
const allowedСurrencies = ['USD', 'EUR', 'GBP', 'RUB']

const DonationsSchema = new mongoose.Schema({
  amount: { type: Number, min: 1, required: true },
  currency: { type: String, required: true, enum: allowedСurrencies },
})

const Donations = mongoose.model('Donations', DonationsSchema)

export { Donations, allowedСurrencies }
