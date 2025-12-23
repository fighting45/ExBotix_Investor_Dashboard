/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password, returns access token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: User password
 *           examples:
 *             example1:
 *               summary: Login example
 *               value:
 *                 email: user@example.com
 *                 password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Login Successfully!"
 *                 data:
 *                   type: object
 *                   description: User data without password
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token for authenticated requests
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *             examples:
 *               success:
 *                 summary: Successful login
 *                 value:
 *                   statusCode: 200
 *                   message: "Login Successfully!"
 *                   data:
 *                     id: 1
 *                     name: "John Doe"
 *                     email: "user@example.com"
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials - password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials!"
 *             examples:
 *               invalidCredentials:
 *                 summary: Invalid password
 *                 value:
 *                   statusCode: 401
 *                   message: "Invalid credentials!"
 *       404:
 *         description: User not found - email does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   statusCode: 404
 *                   message: "User not found!"
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

