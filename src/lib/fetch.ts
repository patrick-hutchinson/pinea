import { client } from "./client";
import { featuresQuery, pictureBrushQuery, portfolioQuery } from "./queries";

export async function getPictureBrush() {
  return client.fetch(pictureBrushQuery);
}

export async function getPortfolios() {
  return client.fetch(portfolioQuery);
}

export async function getFeatures() {
  return client.fetch(featuresQuery);
}
