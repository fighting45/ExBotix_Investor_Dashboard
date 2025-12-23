/**
 * @swagger
 * tags:
 *   name: Investor
 *   description: Investor dashboard endpoints
 */

/**
 * @swagger
 * /api/investor/overview:
 *   get:
 *     summary: Get investor overview
 *     description: Returns overview information for the investor dashboard
 *     tags: [Investor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Read-only access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

