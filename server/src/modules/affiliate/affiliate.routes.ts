// server/src/routes/affiliate.routes.ts
import { Router } from 'express'
import authMiddleware from '../../middlewares/authMiddleware'
import * as AffiliateController from '../affiliate/affiliate.controller'

const router = Router()

// require auth for most endpoints
router.use(authMiddleware)

// GET stats summary
router.get('/stats', AffiliateController.getAffiliateStats)

// GET all links for affiliate
router.get('/links', AffiliateController.getAffiliateLinks)

// POST create a new link (custom slug/label)
router.post('/links', AffiliateController.createAffiliateLink)

// GET clicks list / top links (pagination)
router.get('/links/:linkId/clicks', AffiliateController.getLinkClicks)

// GET earnings / payout history
router.get('/earnings', AffiliateController.getEarnings)

// POST request payout
router.post('/withdraw/request', AffiliateController.requestPayout)

// GET reports (aggregated) - optional params via query ?from=&to=&groupBy=
router.get('/reports', AffiliateController.getReports)

export default router
