import { getDashboardService, getAnalyticsService } from '../services/dashboardService.js'
import { handleError } from '../utils/errorHandler.js'

export const getDashboard = async (req, res) => {
    try {
        const metrics = await getDashboardService()
        res.status(200).json(metrics)
    } catch (error) {
        handleError(error, res)
    }
}

export const getAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query
        const analytics = await getAnalyticsService(startDate, endDate)
        res.status(200).json(analytics)
    } catch (error) {
        handleError(error, res)
    }
}
