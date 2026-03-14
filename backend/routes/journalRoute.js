import express from 'express'
import { analyzeJournal, createJournal, getAllJournal, getInsights } from '../controllers/journalController.js'

const router = express.Router()

router.post('/',createJournal)
router.post('/analyze' , analyzeJournal)
router.get('/insights/:userId' , getInsights)
router.get('/:userId' , getAllJournal)

export default router