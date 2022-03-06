import { Donations, allowedСurrencies } from '../models/donations.model.js'

/**
 * Создать запись.
 */
const donationCreate = function (req, res, next) {
  if (
    !req.body.amount ||
    !Number.isInteger(+req.body.amount) ||
    req.body.amount <= 0
  ) {
    const err = 'Сумма должна быть целой и больше нуля'
    return res.status(400).json({ ok: false, error: err })
  }

  if (!req.body.currency || !allowedСurrencies.includes(req.body.currency)) {
    const err = `Валюты нет в списке разрешенных, разрешенный список валют: ${allowedСurrencies.join(
      ', '
    )}  `
    return res.status(400).json({ ok: false, error: err })
  }

  Donations.create(
    {
      amount: req.body.amount,
      currency: req.body.currency,
    },
    function (err) {
      if (err) return next(err)
      res.json({ ok: true })
    }
  )
}

export default { donationCreate }
