import express from 'express'
import donationsController from '../controllers/donations.controller'
const router = express.Router()

router.get('/', donationsController.donationCreate)

export default router
