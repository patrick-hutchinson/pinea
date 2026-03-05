import { imageOrSlideshowFragment, mediumFragment, mediumQuery } from "./fragments";
import { thumbnailFragment } from "./fragments";

export const siteQuery = `*[_type=="site"][0]{
  title,
  description,
  google_description,
  address,
  email,
  gallery[] ${mediumQuery},
  about,
  menu_teaser,
  description,
  socials[]{
    platform,
    link
  },
  supporters,
  menu_teaser,
}`;

export const imprintQuery = `*[_type=="imprint"][0]{
  footerLogosGerman[]{
    asset->{
      _id,
      url,
    }
  },
  footerLogosEnglish[]{
    asset->{
      _id,
      url,
    }
  },
  supporterLogosGerman[]{
    asset->{
      _id,
      url,
    }
  },
  supporterLogosEnglish[]{
    asset->{
      _id,
      url,
    }
  },
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
  featuredArticle{
    cover[0] ${mediumQuery},
    reference->{
      "slug": slug.current,
      "title": title,
    }
  },
  portfolios[]->{
    name,
    label->{
      title
    },
    satelliteImage[0] ${mediumQuery},
    slug,
  },
  announcements[]->{
    type,  
    title,
    orderRank,
    subtitle,
    linkType,
    "link": select(
      linkType == "external" => externalLink,
      linkType == "internal" => internalLink->slug.current,
      linkType == "email" => email,
      null
    ),
    email,
    category,
    media[0] ${mediumQuery}
  },
  visit[0]{
    gallery[] ${mediumQuery},
    description,
   reference->{
      "slug": slug.current,
      "title": title,
    },
  },
  person[0]{
    reference->{
      "_ref": reference._ref,
      slug,
      name,
      role,
      "portrait": portrait[0] ${mediumQuery}
    },
    text,
  },
  membership[0]{
    title,
    description,
    reference->{
      slug
    }
  },
  homepagePeriodical[0]{
    reference->{
      title,
      isbn,
      info,
      cover[0] ${mediumQuery}
    },
    gallery[] ${mediumQuery},
    announcements
  },
  frame[0] ${mediumQuery},
  edition[0]{
    title,
    description,
    ${mediumFragment}
  },
}`;

export const searchableData = `*[_type in ["news", "openCall", "visit", "review", "spotOn", "portfolio", "contributor", "event"]
  &&
  (
    (_type == "event" && duration.endDate >= now()) ||           // only future events
    (_type in ["news", "openCall", "visit", "review", "spotOn", "portfolio", "contributor"]) // keep all others
  )
]{
  _id,
  _type,
  title,
  teaser,
  name,
  "museum": location->museum,
  "contributorNames": select(
    _type in ["visit", "review", "spotOn", "portfolio"] => releaseInfo.contributor[]->name,
    _type == "contributor" => [name],
    []
  ),
  "legacyAuthorNames": select(
    _type in ["visit", "review", "spotOn"] => author[]->name,
    _type == "portfolio" => [author],
    []
  ),
  author,
  slug
}`;

export const aboutPageQuery = `*[_type=="aboutPage"][0]{
  about,
  contact,
  portrait[0] ${mediumQuery},
}`;

export const periodicalPageQuery = `*[_type=="periodicalPage"][0]{
  gallery[] ${mediumQuery},
  announcements[]->{
    type,  
    title,
    orderRank,
    size,
    backgroundColor,
    subtitle,
    linkType,
    "link": select(
    linkType == "external" => externalLink,
    linkType == "internal" => internalLink->slug.current,
    linkType == "email" => email,
    null
  ),
  email,
  category,
  media[0] ${mediumQuery}
  },
  email,
}`;

export const calendarPageQuery = `*[_type=="calendarPage"][0]{
adBanner[]->{
  mediumDesktop[0] ${mediumQuery},
  mediumMobile[0] ${mediumQuery},
link}
}`;

export const newsletterQuery = `
*[_type == "newsletter"]{
  _id,
  title,
  language,
  release,
  subject,
  slug,

  pageBuilder[]{
    _type,
    _type == "newsletterAnnouncements" => {
      layout,
      sectionHeader,
      items[]{
        _key,
        title,
        link,
        "image": {
          "url": image.asset->url,
          "dimensions": image.asset->metadata.dimensions
        }
      }
    },
    _type == "newsletterDoubleFeature" => {
      story[]{
        featureTitle,
        link,
        isSmall,
        copyright,
        "image": {
          "url": image.asset->url,
          "dimensions": image.asset->metadata.dimensions
        }
      }
    },
    _type == "newsletterShowcase" => {
      text,
      "image": {
        "url": image.asset->url,
        "dimensions": image.asset->metadata.dimensions
      }
    },
    _type == "newsletterBulletins" => {
      sectionHeader,
      bulletin[]->{
        title,
        teaser,
        link,
        deadline
      }
    },
    _type == "newsletterRunningText" => {
      runningText
    },
    _type == "newsletterAdBanner" => {
      "adBanner": adBanner->{
        mediumDesktop[0] ${mediumQuery},
        link
      }
    }
  }
}
`;

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

export const pictureBrushToolQuery = `*[_type=="pictureBrushTool"][0]{
imageSets[]{
  title,
  images[]{
    "type": select(
      _type == "image" => "image",
      _type == "file" => "video"
    ),
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
}
}`;

export const portfoliosQuery = `*[_type == "portfolio"]{
_type,
  name,
  releaseInfo{
    contributor[0]->{
    name
  },
  releaseDate,
  },

  "type": "portfolio",
  "category": "portfolios",
  "route": "stories",
  showcase[0]->{
    name,
    bio,
    socials[]{
      platform,
      link
    },
  },

  textColor,

  label->{
    title
  },
  darkmode,
  cover[0] ${mediumQuery},
  teaser,
  article, 
  satelliteImage[0] ${mediumQuery},
  articleImage[0] ${mediumQuery},
  gallery[] ${mediumQuery},
  doubleFeature {
    "left": left[0] ${imageOrSlideshowFragment},
    "right": right[0] ${imageOrSlideshowFragment}
  },
  slug
}`;

export const contributorsQuery = `*[_type=="contributor"]{
  name,
  role,
  bio,
  portrait[0] ${mediumQuery},
  socials[]{
    platform,
    link
  },
  articles[]->{
    _type,
    title, 
    name,
    teaser,
    slug,
    "category": select(
    _type == "portfolio" => "portfolios",
      _type == "spotOn" => "spot-on",     
      _type == "visit" => "visits",         
      _type == "review" => "reviews",      
      _type                                     
    ),
    releaseDate,
  }

}`;

export const periodicalsQuery = `*[_type=="periodical"]{
  title,
  isbn,
  info,
  teaser,
  description,
  cover[0] ${mediumQuery},
}`;

export const announcementQuery = `*[_type=="announcement"] | order(orderRank){
  type,  
  title,
  orderRank,
  subtitle,
 linkType,
  "link": select(
    linkType == "external" => externalLink,
    linkType == "internal" => internalLink->slug.current,
    linkType == "email" => email,
    null
  ),
  email,
  category,
  media[0] ${mediumQuery}
}`;

export const openCallQuery = `*[_type=="openCall"]{
  title,
  teaser,
  text,
  link,
  deadline,
  slug
}`;

export const newsQuery = `*[_type=="news"]{
  title,
  teaser,
  text,
  link,
  deadline,
  slug
}`;

export const membersPageQuery = `*[_type=="membersPage"][0]{
  text,
}`;

export const membershipsQuery = `*[_type=="memberships"]{
  name,
  description,
  cover[0] ${mediumQuery},
  pricing,
  email
}`;

export const printQuery = `*[_type=="print"]{
  _id,
  _type,
  title,
  category,
  releaseDate,
  teaser,
  author[]->{
    name,
    initials,
  },
}`;

export const visitsQuery = `*[_type=="visit"]{
  title,
  "type": "visit",
  "category": "visits",
  layout,
  selector,
  cover[0] ${imageOrSlideshowFragment},
  speakers[]->{
    name,
    initials,
  },
  releaseInfo{
    releaseDate,
    contributor[]->{
      name,
      bio,
      socials[]{
        platform,
        link
      },
      role,
      portrait[0] ${mediumQuery},
    },
  },
  text[]{
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
  showcase[]->{
    name,
    bio,
    socials[]{
      platform,
      link
    },
    role,
    portrait[0] ${mediumQuery},
  },
  gallery[] ${mediumQuery},

  articleImage[0] ${mediumQuery},
  preview[0] ${mediumQuery},
  fullscreenMedia[0] ${imageOrSlideshowFragment},
  slug
}`;

export const reviewsQuery = `*[_type=="review"]{
  title,
  "type": "review",
  "category": "reviews",
  layout,
  selector,
  teaser,
  articleImageFirst[0] ${mediumQuery},
  articleImageSecond[0] ${mediumQuery},
  cover[0] ${imageOrSlideshowFragment},
  releaseInfo{
    releaseDate,
    contributor[]->{
      name,
    },
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
  preview[0] ${mediumQuery},
  showcase[]->{
    name,
    bio,
    socials[]{
      platform,
      link
    },
    role,
    portrait[0] ${mediumQuery},
  },
  gallery[] ${mediumQuery},
  doubleFeature {
    "left": left[0] ${imageOrSlideshowFragment},
    "right": right[0] ${imageOrSlideshowFragment}
  },
  slug
}`;

export const spotOnQuery = `*[_type=="spotOn"]{
  title,
  "type": "spot-on",
  "category": "spot-on",
  releaseInfo{
    releaseDate,
    contributor[]->{
      name,
      bio,
      socials[]{
        platform,
        link
      },
      role,
      portrait[0] ${mediumQuery},
    },
  },
  layout,
  teaser,
  cover[0] ${mediumQuery},
  cover[0] ${imageOrSlideshowFragment},
  ${mediumFragment},
  fullscreenMedia[0] ${imageOrSlideshowFragment},

  articleImage[0] ${mediumQuery},
  gallery[] ${mediumQuery},

  speakers[]->{
    name,
    initials,
  },
  showcase[]->{
    name,
    bio,
    socials[]{
      platform,
      link
    },
    role,
    portrait[0] ${mediumQuery},
  },
  text[]{
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
  preview[0] ${mediumQuery},
  doubleFeature {
    "left": left[0] ${imageOrSlideshowFragment},
    "right": right[0] ${imageOrSlideshowFragment}
  },
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
  hostedText_mobile,
  "opening": opening.date,
  "time": opening.time,
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
  gallery[] ${mediumQuery},
  "recommended": count(*[_type == "recommendation" && references(^._id)]) > 0,
  "recommendation": *[_type == "recommendation" && references(^._id)][0]{
    _id,
    teaser,
    comment,
    person->{
      _id,
      name,
      slug
    },
    ${thumbnailFragment}
  }
}`;

export const peopleQuery = `*[_type == "person"]{
  _id,
  name,
  releaseDate,
  "type": "person",
  "category": "recommended",
  archiveTitle,
  bio,
  role,
  socials,
  nationality,
  portrait[0] ${mediumQuery},
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
  person->{
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
