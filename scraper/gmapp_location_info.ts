import type { Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { mapData } from "./utils";


puppeteer.use(StealthPlugin());
const BASE_URL = "https://www.google.com";


const extractLink = async (page: Page, link: string): Promise<any> => {
  /**
   * This function will extract the data from the page
   * 
   * @param page: Page - The page object
   * @param link: string - If the link is not found from the page then use this link
   * @returns Promise<any> - The extracted link
   */

  let first_result_data = await page.evaluate(() => {

    // get the first result data
    const el: any = document.querySelector(".Nv2PK");
    if (!el) return null; // if no element found return null

    // extract the data from the element
    const link = el.querySelector("a.hfpxzc")?.getAttribute("href");
    return link;

  });

  if (!first_result_data) {
    first_result_data = link;
  }

  return first_result_data;
}


const extractData = async (page: Page, link: string): Promise<any> => {
  /**
   * This function will extract the data from the link
   * 
   * @param page: Page - The page object
   * @param link: string - The link to extract data from
   * @returns Promise<any> - The extracted data
   */

  await page.goto(link);
  // await page.waitForNavigation();

  let data = await page.evaluate(() => {

    const elements: any = document.getElementsByClassName("kR99db"); // Select elements
    const textContents = []; // Array to store text contents

    for (const element of elements) {
      textContents.push(element.textContent); // Extract and store text content
    }

    // // extract the data from the page
    const name = document.querySelector(".DUwDvf")?.textContent;

    return {
      name,
      textContents
    };
  });

  return data;
}


const getLocationInfo = async (query: string, latitude: number, longitude: number, zoom: string = "11z"): Promise<any> => {
  /**
   * This function will return the location info of the given query.
   * 
   * @param query: string - The query to search for
   * @param latitute: number - The latitute of the location
   * @param longitute: number - The longitute of the location
   * @param zoom: string - The zoom level of the map
   * @returns Promise<any> - The location info
   */

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const MAP_URL = `${BASE_URL}/maps/search/${query}/@${latitude},${longitude},${zoom}?hl=en`;

  page.setDefaultNavigationTimeout(30000);
  await page.goto(MAP_URL);

  // await page.waitForNavigation();
  const link = await extractLink(page, MAP_URL);

  if (!link) {
    await browser.close();
    return null;
  }

  const data = await extractData(page, link); // Extract data from the link

  await browser.close();

  const mappedData = await mapData(data.textContents); // Map the data like address, website, phone number

  const response = {
    name: data.name,
    latitude: latitude,
    longitude: longitude,
    ...mappedData
  }

  return response;
}


async function runPlaceQueriesInParallel(queries: Array<any>): Promise<any> {
  /**
   * This function will run the queries in parallel
   * 
   * @param queries: Array<any> - The queries to run
   * @returns Promise<any> - The results
   */

  const results = await Promise.all(queries.map(({ query, latitude, longitude }) =>
    getLocationInfo(query, latitude, longitude)
  ));
  return results;
}



export { runPlaceQueriesInParallel };


