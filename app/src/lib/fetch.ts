import { production } from "./client/production";
import { preview } from "./client/preview";

const isProduction = process.env.VERCEL_ENV === "production";
const isPreview = process.env.VERCEL_URL === "preview.pinea-periodical.com";
const isLocal = !process.env.VERCEL_ENV;

export const getSanityClient = () => {
  if (isProduction) return production;
  if (isPreview || isLocal) return preview;

  return preview;
};

const client = getSanityClient();

console.log("client:", client.config());

const hasText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const hasSlug = (item: any) => hasText(item?.slug?.current);

const isValidContributor = (item: any) => hasText(item?.name);

const isValidEvent = (item: any) => {
  if (!item || !hasText(item?._id) || !hasText(item?.title)) return false;
  return Boolean(item?.startDate || item?.endDate || item?.opening);
};

const isValidVisit = (item: any) => hasText(item?.title) && hasSlug(item);
const isValidReview = (item: any) => hasText(item?.title) && hasSlug(item);
const isValidSpotOn = (item: any) => hasText(item?.title) && hasSlug(item);
const isValidPortfolio = (item: any) => hasText(item?.name) && hasSlug(item);
const isValidPersonStory = (item: any) => hasText(item?.name) && hasSlug(item);

const sanitizeContributor = (contributor: any) => {
  if (!isValidContributor(contributor)) return null;

  const articles = Array.isArray(contributor?.articles) ? contributor.articles : [];

  return {
    ...contributor,
    articles: articles.filter((article) => {
      const type = article?._type;

      if (type === "portfolio") return hasText(article?.name) && hasSlug(article);
      return hasText(article?.title) && hasSlug(article);
    }),
  };
};

const sanitizeArray = (items: unknown, predicate: (item: any) => boolean) => {
  if (!Array.isArray(items)) return [];
  return items.filter(predicate);
};

import {
  aboutPageQuery,
  announcementQuery,
  eventQuery,
  homePageQuery,
  visitsQuery,
  openCallQuery,
  periodicalsQuery,
  pictureBrushQuery,
  portfoliosQuery,
  recommendationsQuery,
  siteQuery,
  peopleQuery,
  reviewsQuery,
  membershipsQuery,
  membersPageQuery,
  newsQuery,
  spotOnQuery,
  contributorsQuery,
  pictureBrushToolQuery,
  calendarPageQuery,
  newsletterQuery,
  periodicalPageQuery,
  searchableData,
  printQuery,
  imprintQuery,
} from "./queries";

export async function getSiteData() {
  return client.fetch(siteQuery);
}

export async function getImprint() {
  return client.fetch(imprintQuery);
}

export async function getHomePage() {
  return client.fetch(homePageQuery);
}

export async function getSearchableData() {
  return client.fetch(searchableData);
}

export async function getCalendarPage() {
  return client.fetch(calendarPageQuery);
}

export async function getAboutPage() {
  return client.fetch(aboutPageQuery);
}

export async function getPeriodicalPage() {
  return client.fetch(periodicalPageQuery);
}

export async function getPictureBrush() {
  return client.fetch(pictureBrushQuery);
}

export async function getPictureBrushTool() {
  return client.fetch(pictureBrushToolQuery);
}

export async function getPortfolios() {
  const data = await client.fetch(portfoliosQuery);
  return sanitizeArray(data, isValidPortfolio);
}

export async function getReviews() {
  const data = await client.fetch(reviewsQuery);
  return sanitizeArray(data, isValidReview);
}

export async function getSpotOns() {
  const data = await client.fetch(spotOnQuery);
  return sanitizeArray(data, isValidSpotOn);
}

export async function getPrintArticles() {
  return client.fetch(printQuery);
}

export async function getNewsletters() {
  return client.fetch(newsletterQuery);
}

export async function getPeriodicals() {
  return client.fetch(periodicalsQuery);
}

export async function getAnnouncements() {
  return client.fetch(announcementQuery);
}
export async function getContributors() {
  const data = await client.fetch(contributorsQuery);
  const sanitized = Array.isArray(data) ? data.map(sanitizeContributor) : [];
  return sanitizeArray(sanitized, Boolean);
}

export async function getMemberships() {
  return client.fetch(membershipsQuery);
}
export async function getMembersPage() {
  return client.fetch(membersPageQuery);
}

export async function getOpenCalls() {
  return client.fetch(openCallQuery);
}

export async function getNews() {
  return client.fetch(newsQuery);
}

export async function getEvents() {
  const data = await client.fetch(eventQuery);
  return sanitizeArray(data, isValidEvent);
}

export async function getPeople() {
  try {
    const data = await client.fetch(peopleQuery);
    return sanitizeArray(data, isValidPersonStory);
  } catch (e) {
    console.error("getPeople failed", e);
    throw e;
  }
}

export async function getVisits() {
  const data = await client.fetch(visitsQuery);
  return sanitizeArray(data, isValidVisit);
}

export async function getRecommendations() {
  return client.fetch(recommendationsQuery);
}
