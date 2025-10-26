import countries from "world-countries";
import { client } from "./client";
import {
  aboutPageQuery,
  announcementQuery,
  eventQuery,
  featuresQuery,
  openCallQuery,
  periodicalQuery,
  pictureBrushQuery,
  portfoliosQuery,
  recommendationsQuery,
  siteQuery,
  voicesQuery,
} from "./queries";

export async function getSiteData() {
  return client.fetch(siteQuery);
}

export async function getAboutPage() {
  return client.fetch(aboutPageQuery);
}

export async function getPictureBrush() {
  return client.fetch(pictureBrushQuery);
}

export async function getPortfolios() {
  return client.fetch(portfoliosQuery);
}

export async function getFeatures() {
  return client.fetch(featuresQuery);
}

export async function getPeriodical() {
  return client.fetch(periodicalQuery);
}

export async function getAnnouncements() {
  return client.fetch(announcementQuery);
}

export async function getOpenCalls() {
  return client.fetch(openCallQuery);
}

export async function getEvents() {
  return client.fetch(eventQuery);
}

export async function getVoices() {
  return client.fetch(voicesQuery);
}

export async function getRecommendations() {
  return client.fetch(recommendationsQuery);
}
