import countries from "world-countries";
import { client } from "./client";
import {
  announcementQuery,
  eventQuery,
  featuresQuery,
  openCallQuery,
  periodicalQuery,
  pictureBrushQuery,
  portfolioQuery,
  recommendationsQuery,
  siteQuery,
  voicesQuery,
} from "./queries";

export async function getSiteData() {
  return client.fetch(siteQuery);
}

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

const countryMap = Object.fromEntries(countries.map((c) => [c.cca2, c.name.common]));
export async function getEvents() {
  // map ISO -> full country name
  type EventRaw = {
    country?: string;
    [key: string]: any; // keep other fields flexible
  };

  const events: EventRaw[] = await client.fetch(eventQuery);

  return events.map((event: EventRaw) => ({
    ...event,
    country: {
      cca2: event.country || "Unknown",
      name: countryMap[event.country || ""] || "Unknown",
    },
  }));
}

export async function getVoices() {
  // map ISO -> full country name
  type VoiceRaw = {
    nationality?: string;
    [key: string]: any; // keep other fields flexible
  };

  const voices: VoiceRaw[] = await client.fetch(voicesQuery);

  return voices.map((voice: VoiceRaw) => ({
    ...voice,
    nationality: {
      cca2: voice.nationality || "Unknown",
      name: countryMap[voice.nationality || ""] || "Unknown",
    },
  }));
}

export async function getRecommendations() {
  return client.fetch(recommendationsQuery);
}
