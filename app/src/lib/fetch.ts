import countries from "world-countries";
import { client } from "./client";
import { draftClient } from "./draftClient";
import {
  aboutPageQuery,
  announcementQuery,
  eventQuery,
  featuresQuery,
  homePageQuery,
  interviewQuery,
  openCallQuery,
  periodicalQuery,
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
  spotOnDraftQuery,
  newsletterSettings,
  newsletterQuery,
} from "./queries";

export async function getSiteData() {
  return client.fetch(siteQuery);
}

export async function getHomePage() {
  return client.fetch(homePageQuery);
}

export async function getCalendarPage() {
  return client.fetch(calendarPageQuery);
}

export async function getAboutPage() {
  return client.fetch(aboutPageQuery);
}

export async function getPictureBrush() {
  return client.fetch(pictureBrushQuery);
}

export async function getPictureBrushTool() {
  return client.fetch(pictureBrushToolQuery);
}

export async function getPortfolios() {
  return client.fetch(portfoliosQuery);
}

export async function getFeatures() {
  return client.fetch(featuresQuery);
}

export async function getReviews() {
  return client.fetch(reviewsQuery);
}

export async function getSpotOns() {
  return client.fetch(spotOnQuery);
}

export async function getSpotOnDrafts() {
  return draftClient.fetch(spotOnDraftQuery);
}

export async function getNewsletterSettings() {
  return draftClient.fetch(newsletterSettings);
}

export async function getNewsletters() {
  return draftClient.fetch(newsletterQuery);
}

export async function getPeriodical() {
  return client.fetch(periodicalQuery);
}

export async function getAnnouncements() {
  return client.fetch(announcementQuery);
}
export async function getContributors() {
  return client.fetch(contributorsQuery);
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
  return client.fetch(eventQuery);
}

export async function getPeople() {
  return client.fetch(peopleQuery);
}

export async function getInterviews() {
  return client.fetch(interviewQuery);
}

export async function getRecommendations() {
  return client.fetch(recommendationsQuery);
}
