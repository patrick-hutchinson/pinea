import {
  articleImageFragment,
  coverFragment,
  mediaPairFragment,
  satelliteImageFragment,
  fullscreenMediaFragment,
  imageOrSlideshowFragment,
  mediumFragment,
  portraitFragment,
  mediaQuery,
  articleImageFirstFragment,
  articleImageSecondFragment,
  previewFragment,
} from "./fragments";
import { thumbnailFragment } from "./fragments";
import { galleryFragment } from "./fragments";

export const siteQuery = `*[_type=="site"][0]{
  title,
  description,
  address,
  email,
  ${galleryFragment},
  about,
  menu_teaser,
  description,
  socials[]{
    platform,
    link
  },
  supporters,
  menu_teaser,
  media_kit_de{
    asset->{
      _id,
      url,
      originalFilename
    }
  },
  media_kit_en{
    asset->{
      _id,
      url,
      originalFilename
    }
  },
  imprint,
  privacy,
  copyright
}`;

export const homePageQuery = `*[_type=="homePage"][0]{
  feature->{
    description,
    title,
    author,
    nationality,
    ${coverFragment},
    ${galleryFragment},
    reference[0]->{
      "slug": slug.current
    }
  },
  portfolios[]->{
    name,
    caption,
    label->{
      title
    },
    ${satelliteImageFragment},
    slug,
  },
  periodical->{
    title,
    ${galleryFragment},
    description,
    reference->{
      slug
    },
  },
  person->{
    name,
    ${portraitFragment},
    reference->{
      slug
    },
    text,
  },
  member{
    title,
    description,
    ${mediumFragment}
  },

  frame{
      ...,
      asset->{
        url,
        metadata {
          dimensions {
            width,
            height
          },
          lqip
        }
      }
    },

  edition{
    title,
    description,
    ${mediumFragment}
  },
  // review->{
  //   title,
  //   teaser,
  //   ${coverFragment}
  // },
}`;

export const aboutPageQuery = `*[_type=="aboutPage"][0]{
  about,
  contact,
  ${portraitFragment},
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
  author,
  caption,
  "type": "portfolio",
  "category": "portfolios",
  bio,
  socials[]{
    platform,
    link
  },
  textColor,
  releaseDate,
  label->{
    title
  },
  darkmode,
  ${coverFragment},
  teaser,
  article, 
  ${satelliteImageFragment},
  ${articleImageFragment},
  ${galleryFragment},
  ${mediaPairFragment},
  slug
}`;

export const featuresQuery = `*[_type=="feature"]{
  "type": "feature",
  "category": "features",
  title,
  author,
  nationality,
  ${coverFragment},
  description
}`;

export const contributorsQuery = `*[_type=="contributor"]{
  name,
  role,
  bio,
  ${portraitFragment},
  socials[]{
    platform,
    link
  },

  // Find SpotOn pages where this contributor is referenced
"articles": [
  ...*[_type in ["spotOn", "interview", "review"] && references(^._id)]{
    "type": select(
      _type == "spotOn" => "spot-on",      // URL version
      _type == "interview" => "visit",     // custom type from your interviewQuery
      _type == "review" => "review",       // already URL-safe
      _type                                     // fallback
    ),
    "slug": slug.current,
    title,
    "category": select(
      _type == "spotOn" => "spot-on",      // URL version
      _type == "interview" => "visits",     // custom type from your interviewQuery
      _type == "review" => "reviews",       // already URL-safe
      _type                                     // fallback
    ),
    releaseDate,
    _updatedAt
  }
] | order(_updatedAt desc)
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
 linkType,
  "link": select(
    linkType == "external" => externalLink,
    linkType == "internal" => internalLink->slug.current,
    null
  ),
  category,
  ${mediaQuery}
}`;

export const openCallQuery = `*[_type=="openCall"]{
  title,
  teaser,
  text,
  link,
  deadline,
}`;

export const newsQuery = `*[_type=="news"]{
  title,
  teaser,
  text,
  link,
  deadline,
}`;

export const membersPageQuery = `*[_type=="membersPage"][0]{
  text,
}`;

export const membershipsQuery = `*[_type=="memberships"]{
  name,
  description,
  ${coverFragment},
  pricing,
}`;

export const interviewQuery = `*[_type=="interview"]{
  title,
  "type": "visit",
  "category": "visits",
  releaseDate,
  ${imageOrSlideshowFragment},
  speakers[]->{
    name,
    initials,
  },
  interviewers[]->{
    name,
    initials,
  },
  interview[]{
    _key,
    _type,
    value[]{
      ...,
      markDefs[]{
        ...,
        _type == "speaker" => {
          "speaker": ref->_id,
          "name": ref->name,
          "initials": ref->initials
        }
      }
    }
  },
  ${galleryFragment},
  ${articleImageFragment},
  ${previewFragment},
  ${fullscreenMediaFragment},
  slug
}`;

export const reviewsQuery = `*[_type=="review"]{
  title,
  "type": "review",
  "category": "reviews",
  releaseDate,
  teaser,
  ${coverFragment},
  ${articleImageFirstFragment},
  ${articleImageSecondFragment},
  ${imageOrSlideshowFragment},
  author[]->{
    name,
  },
  text[]{
    _key,
    _type,
    value[]{
      ...,
      markDefs[]{
        ...,
      }
    }
  },
  quote[]{
    _key,
    _type,
    value[]{
      ...,
      markDefs[]{
        ...,
      }
    }
  },
  ${previewFragment},
  ${galleryFragment},
  ${mediaPairFragment},
  slug
}`;

export const spotOnQuery = `*[_type=="spotOn"]{
  title,
  "type": "spot-on",
  "category": "spot-on",
  releaseDate,
  teaser,
  ${coverFragment},
  ${imageOrSlideshowFragment},
  ${mediumFragment},
  author[]->{
    name,
    bio,
    socials[]{
      platform,
      link
    },
    role,
    ${portraitFragment}
  },
  showcase[]->{
    name,
    bio,
    socials[]{
      platform,
      link
    },
    role,
    ${portraitFragment}
  },
  text[]{
    _key,
    _type,
    value[]{
      ...,
      markDefs[]{
        ...,
      }
    }
  },
  quote[]{
    _key,
    _type,
    value[]{
      ...,
      markDefs[]{
        ...,
      }
    }
  },
  selector,
  ${previewFragment},
  ${mediaPairFragment},
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
  "recommended": count(*[_type == "recommendation" && references(^._id)]) > 0,
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

export const peopleQuery = `*[_type=="voice"]{
  _id,
  name,
  "type": "person",
  "category": "people",
  bio,
  role,
  socials,
  nationality,
  ${portraitFragment},
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
