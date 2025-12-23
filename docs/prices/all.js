/**
 * @swagger
 * /api/prices/all:
 *   get:
 *     summary: Get all cryptocurrency prices
 *     description: Returns all available cryptocurrency prices with last update timestamp
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Prices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prices:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   description: Object with symbol as key and price as value
 *                   example:
 *                     BTC: 45000.50
 *                     ETH: 2500.75
 *                     SOL: 100.25
 *                 lastUpdate:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-22T10:30:00.000Z"
 *                 count:
 *                   type: integer
 *                   description: Number of available prices
 *                   example: 20
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

