import { production } from "./client/production";
import { preview } from "./client/preview";

const isProduction = process.env.VERCEL_ENV === "production";
const isPreview = process.env.VERCEL_ENV === "preview";
const isLocal = !process.env.VERCEL_ENV;

export const getSanityClient = () => {
  if (isProduction) return production;
  if (isPreview || isLocal) return preview;

  return preview;
};

const client = getSanityClient();

const hasText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const hasValue = (value: unknown): boolean => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some(hasValue);
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).some(hasValue);
  return false;
};

const hasSlug = (item: any) => hasText(item?.slug?.current);

const isValidContributor = (item: any) => hasText(item?.name);

const isValidEvent = (item: any) =>
  Boolean(item) &&
  hasText(item?._id) &&
  (hasValue(item?.title) ||
    hasValue(item?.opening) ||
    hasValue(item?.startDate) ||
    hasValue(item?.endDate) ||
    hasValue(item?.location) ||
    hasValue(item?.thumbnail) ||
    hasValue(item?.highlight));

const isValidVisit = (item: any) => hasSlug(item);
const isValidReview = (item: any) => hasSlug(item);
const isValidSpotOn = (item: any) => hasSlug(item);
const isValidPortfolio = (item: any) => hasSlug(item);
const isValidPersonStory = (item: any) => hasSlug(item);

const sanitizeContributor = (contributor: any) => {
  if (!isValidContributor(contributor)) return null;

  const articles = Array.isArray(contributor?.articles) ? contributor.articles : [];

  return {
    ...contributor,
    articles: articles.filter((article) => {
      const type = article?._type;

      if (type === "portfolio") return hasSlug(article) && hasValue(article?.name);
      return hasSlug(article) && hasValue(article?.title);
    }),
  };
};

const sanitizeArray = (items: unknown, predicate: (item: any) => boolean) => {
  if (!Array.isArray(items)) return [];
  return items.filter(predicate);
};

const MEMBERS_ONLY_MESSAGE = {
  en: "This content is only viewable for Pinea Members. Consider subscribing to unlock all posts and additional perks!",
  de: "Dieser Inhalt ist nur für Pinea Mitglieder sichtbar. Schließe ein Abo ab, um alle Beiträge und zusätzliche Vorteile freizuschalten!",
};

const MEMBERS_ONLY_TEXT = [
  {_key: "en", value: MEMBERS_ONLY_MESSAGE.en},
  {_key: "de", value: MEMBERS_ONLY_MESSAGE.de},
];

const redactMembersOnlyBulletins = (items: unknown, canViewMembersOnlyContent = false) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const isMembersOnly = Boolean(item?.membersOnlyContent);
    const isMembersOnlyLocked = isMembersOnly && !canViewMembersOnlyContent;

    if (!isMembersOnlyLocked) {
      return {
        ...item,
        isMembersOnlyLocked: false,
      };
    }

    return {
      ...item,
      teaser: MEMBERS_ONLY_TEXT,
      text: MEMBERS_ONLY_TEXT,
      link: null,
      isMembersOnlyLocked: true,
    };
  });
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
  countriesQuery,
  menuQuery,
} from "./queries";

export async function getSiteData() {
  return client.fetch(siteQuery);
}

export async function getMenuData() {
  return client.fetch(menuQuery);
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
  const data = await client.fetch(openCallQuery);
  return redactMembersOnlyBulletins(data, false);
}

export async function getOpenCallsWithAccess(canViewMembersOnlyContent = false) {
  const data = await client.fetch(openCallQuery);
  return redactMembersOnlyBulletins(data, canViewMembersOnlyContent);
}

export async function getNews() {
  const data = await client.fetch(newsQuery);
  return redactMembersOnlyBulletins(data, false);
}

export async function getNewsWithAccess(canViewMembersOnlyContent = false) {
  const data = await client.fetch(newsQuery);
  return redactMembersOnlyBulletins(data, canViewMembersOnlyContent);
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

export async function getCountries() {
  return client.fetch(countriesQuery);
}
