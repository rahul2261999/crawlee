import { CheerioCrawlingContext, createCheerioRouter, Dataset, RouterHandler } from 'crawlee';
import { ICrawlUserData } from './cheerio.interface.js';

class CheerioRouter {
  private static instance: CheerioRouter;
  private crawlerRouter: RouterHandler<CheerioCrawlingContext>;

  private constructor() {
    this.crawlerRouter = createCheerioRouter();
    this.initRoutes();
  }

  public static getInstance(): CheerioRouter {
    if (!CheerioRouter.instance) {
      CheerioRouter.instance = new CheerioRouter();
    }
    return CheerioRouter.instance;
  }

  private initRoutes() {
    this.crawlerRouter.addDefaultHandler(async ({ enqueueLinks, log, $, request }) => {
      log.info("executing default handler");
      log.info(`enqueueing new URLs`);

      const userData: ICrawlUserData = request.userData;

      const customDataSet = await Dataset.open(userData.bucketName);

      const title = $('title').text();
      const textContent = $('body')
        .find('*')
        .not('script, style, noscript, iframe, audio, video, canvas, embed, object, img')
        .contents()
        .filter(function () {
          return this.type === 'text';
        })
        .map(function () {
          return $(this).text().trim();
        })
        .get()
        .join(' ')
        .trim()
        .replace(/\s+/g, ' ');

      await customDataSet.pushData({
        title,
        textContent,
        url: request.loadedUrl,
      })

      await enqueueLinks({
        strategy: 'same-domain',
        userData
      });
    });
  }

  public getRoutes() {
    return this.crawlerRouter;
  }
}

export default CheerioRouter.getInstance();