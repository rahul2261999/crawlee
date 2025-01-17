import { Request, Response } from "express";
import crawlerService from "./crawler.service.js";
import SuccessResponse from "../../utils/response/response.util.js";
import InternalServer from "../../utils/error/internal_server.error.js";

class CrawlerController {
  private static instance: CrawlerController;

  private constructor() { }

  public static getInstance(): CrawlerController {
    if (!CrawlerController.instance) {
      CrawlerController.instance = new CrawlerController();
    }
    return CrawlerController.instance;
  }

  public async crawl(req: Request, res: Response) {
    try {
      const body = req.body;

      crawlerService.crawl(body);

      const data = new SuccessResponse('Crawling started successfully');
      res.status(data.statusCode).json(data);
    } catch (error) {
      const errorRes = InternalServer.fromError(error);

      res.status(errorRes.getStatusCode()).json(errorRes.toJson())
    }
  }
}

export default CrawlerController.getInstance();