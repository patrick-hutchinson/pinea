import { client } from "./client";
import {
  announcementQuery,
  featuresQuery,
  openCallQuery,
  periodicalQuery,
  pictureBrushQuery,
  portfolioQuery,
} from "./queries";

export async function getPictureBrush() {
  return client.fetch(pictureBrushQuery);
}

export async function getPortfolios() {
  return client.fetch(portfolioQuery);
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
