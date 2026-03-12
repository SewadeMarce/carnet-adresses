import { Router } from "express";

const apiRouter = Router();

apiRouter.get('/ahealth', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

export default apiRouter