/**
 * @swagger
 * tags:
 *   name: Prices
 *   description: Price service endpoints for cryptocurrency prices
 */

/**
 * @swagger
 * /api/prices/health:
 *   get:
 *     summary: Get price service health status
 *     description: Returns the health status of the price update service including last update time and available prices
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Health status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, unhealthy, error]
 *                   example: healthy
 *                 lastUpdate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-22T10:30:00.000Z"
 *                 availablePrices:
 *                   type: integer
 *                   example: 20
 *                 totalCoins:
 *                   type: integer
 *                   example: 20
 *                 coverage:
 *                   type: string
 *                   example: "100.0%"
 *                 error:
 *                   type: string
 *                   description: Error message (only present when status is error)
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

