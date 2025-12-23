/**
 * @swagger
 * /api/prices/{symbol}:
 *   get:
 *     summary: Get price for a specific cryptocurrency symbol
 *     description: Returns the current price for a specific cryptocurrency symbol
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *           example: BTC
 *         description: Cryptocurrency symbol (e.g., BTC, ETH, SOL)
 *     responses:
 *       200:
 *         description: Price retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 symbol:
 *                   type: string
 *                   example: BTC
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 45000.50
 *                 quoteCurrency:
 *                   type: string
 *                   example: USDT
 *       404:
 *         description: Price not found for the given symbol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Price not available for BTC/USDT. Price service may not be initialized yet."
 */

