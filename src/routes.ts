import { Router } from "express";
import crawlerController from "./crawler/crawler.controller.js";

const router = Router();

router.get('/crawler', crawlerController.crawl);

export default router;