import { CheerioCrawler, Dataset, RequestQueue } from "crawlee";
import BadRequest from "../../utils/error/bad_request.js";
import InternalServer from "../../utils/error/internal_server.error.js";
import CheerioValidation from "./cheerio-valdation.provider.js";
import { ICrawl } from "./cheerio.interface.js";
import cheerio_router from "./cheerio_router.js";
import { v4 } from "uuid";

class CrawlerService {
  private static instance: CrawlerService;

  private constructor() { }

  public static getInstance(): CrawlerService {
    if (!CrawlerService.instance) {
      CrawlerService.instance = new CrawlerService();
    }
    return CrawlerService.instance;
  }

  public async crawl(params: ICrawl): Promise<void> {
    try {
      const validation = CheerioValidation.CrawlWebsite.safeParse(params);

      if (!validation.success) {
        throw new BadRequest(validation.error.message, { error: validation.error.issues })
      }

      const bucketName: string = v4();

      const requestQueue = await RequestQueue.open(bucketName);
      await requestQueue.addRequest({
        url: params.url,
        userData: { bucketName }
      })

      const crawler = new CheerioCrawler({
        requestQueue,
        requestHandler: cheerio_router.getRoutes(),
        ...(params.depth ? { maxRequestsPerCrawl: params.depth } : {}),
      })

      await crawler.run();

      await requestQueue.drop()
      const data = await Dataset.open(bucketName)
      data.drop();
    } catch (error) {
      throw InternalServer.fromError(error);
    }
  }
}

export default CrawlerService.getInstance();