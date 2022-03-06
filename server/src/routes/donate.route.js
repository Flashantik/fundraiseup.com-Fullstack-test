import express from 'express'
import donationsController from '../controllers/donations.controller'
const router = express.Router()

router.post('/', donationsController.donationCreate)

export default router
