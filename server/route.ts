import { Router } from "express";

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

export default apiRouter