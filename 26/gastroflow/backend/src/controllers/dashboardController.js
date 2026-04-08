import { getDashboardService } from '../services/dashboardService.js'
import { handleError } from '../utils/errorHandler.js'

export const getDashboard = async (req, res) => {
    try {
        const metrics = await getDashboardService()
        res.status(200).json(metrics)
    } catch (error) {
        handleError(error, res)
    }
}
