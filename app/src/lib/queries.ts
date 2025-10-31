import { articleImageFragment, coverFragment, doubleFeatureFragment } from "./fragments";
import { thumbnailFragment } from "./fragments";
import { galleryFragment } from "./fragments";

export const siteQuery = `*[_type=="site"][0]{
  title,
  description,
  address,
  email,
  about,
  socials[]{
    platform,
    link
  },
  supporters
}`;

export const homePageQuery = `*[_type=="homePage"][0]{
  feature->{
    description,
    title,
    author,
    nationality,
    ${thumbnailFragment}
  },
  portfolios[]->{
    name,
    label->{
      title
    },
    satelliteImage,
    slug,
  },
  periodical->{
    title,
    images[]{
      "type": select(_type == "image" => "image", _type == "video" => "video"),
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    description,
  },
}`;

export const aboutPageQuery = `*[_type=="aboutPage"][0]{
  about,
  contact,
  ${thumbnailFragment},
}`;

export const pictureBrushQuery = `*[_type=="pictureBrush"][0]{
  images[]{
    "type": select(_type == "image" => "image", _type == "video" => "video"),
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
}`;

export const portfoliosQuery = `*[_type == "portfolio"]{
  name,
  bio,
  label->{
    title
  },
  textColor,
  ${coverFragment},
  teaser,
  article, 
  ${articleImageFragment},
  ${galleryFragment},
  ${doubleFeatureFragment},
  mediaPair{
    "left": left[0]{ 
      _type,
      _type == "media" => {
        thumbnail{
          asset->{url}
        }
      },
      _type == "slideshow" => {
        gallery[]{
          image{
            asset->{url}
          }
        }
      }
    },
    "right": right[0]{
      _type,
      _type == "media" => {
        thumbnail{
          asset->{url}
        }
      },
      _type == "slideshow" => {
        gallery[]{
          image{
            asset->{url}
          }
        }
      }
    }
  },
  slug
}`;

export const featuresQuery = `*[_type=="feature"]{
  title,
  author,
  nationality,
  ${thumbnailFragment},
  description
}`;

export const periodicalQuery = `*[_type=="periodical"][0]{
  title,
  images[]{
    "type": select(_type == "image" => "image", _type == "video" => "video"),
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  },
  description,
  cover{
    "type": select(_type == "image" => "image", _type == "video" => "video"),
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
}`;

export const announcementQuery = `*[_type=="announcement"]{
  type,  
  title,
  subtitle,
  category,
  ${thumbnailFragment}
}`;

export const openCallQuery = `*[_type=="openCall"]{
  title,
  description,
  date,
  ${thumbnailFragment}
}`;

export const interviewQuery = `*[_type=="interview"]{
  title,
  releaseDate,
  cover,
  speakers[]{
    name,
    initials,
    number,
  },
  interview,
  ${galleryFragment},
  slug
}`;

export const eventQuery = `*[_type=="event"]{
  _id,
  title,
  artist[]->{
    name
  },
  type->{
    title
  },
  highlight,
  hostedText,
  "opening": opening.date,
  "startDate": duration.startDate,
  "endDate": duration.endDate,
  location->{
    city,
    country->{
      name,
      cca2
    },
    museum,
    url
  },
  ${thumbnailFragment},
  ${galleryFragment},
  "recommendation": *[_type == "recommendation" && references(^._id)][0]{
    _id,
    teaser,
    comment,
    "voice": voice->{
      _id,
      name,
      slug
    },
    ${thumbnailFragment}
  }
}`;

export const voicesQuery = `*[_type=="voice"]{
  _id,
  name,
  bio,
  role,
  socials,
  nationality,
  ${thumbnailFragment},
  "recommendations": *[_type == "recommendation" && references(^._id)]{
    _id,
    teaser,
    comment,
    "event": event->{
      _id,
      title,
      "startDate": duration.startDate,
      "endDate": duration.endDate,
      location->{
        city,
        country->{
          name,
          cca2
        },
        museum,
        url
        },
      },
    ${thumbnailFragment},
  },
  slug
}`;

export const recommendationsQuery = `*[_type=="recommendation"]{
  _id,
  teaser,
  comment,
  ${thumbnailFragment},
  "voice": voice->{
    _id,
    name,
    bio,
    role,
    slug
  },
  "event": event->{
    _id,
    title
  }
}`;
