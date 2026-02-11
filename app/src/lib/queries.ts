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
  BMWKMS_logo_de{
    asset->{
      _id,
      url,
    }
  },
  BMWKMS_logo_en{
    asset->{
      _id,
      url,
    }
  },
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
    cover[0] ${mediumQuery},
    gallery[] ${mediumQuery},
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
  periodical->{
    title,
    gallery[] ${mediumQuery},
    description,
    reference->{
      slug
    },
  },
  person->{
    name,
    role,
    portrait[0] ${mediumQuery},
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
  frame[0] ${mediumQuery},
  edition{
    title,
    description,
    ${mediumFragment}
  },
}`;

export const searchableData = `*[_type in ["news", "openCall", "interview", "review", "spotOn", "portfolio", "contributor", "event"]
  &&
  (
    (_type == "event" && duration.endDate >= now()) ||           // only future events
    (_type in ["interview", "review", "spotOn", "portfolio", "contributor"]) // keep all others
  )
]{
  _id,
  _type,
  title,
  teaser,
  name,
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
  periodicalInfo,
  callout,
  isbn,
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

export const newsletterSettings = `*[_type=="newsletterSettings"][0]{
email
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
  name,
  author,
  caption,
  "type": "portfolio",
  "category": "portfolios",
  "route": "stories",
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

export const featuresQuery = `*[_type=="feature"]{
  "type": "feature",
  "category": "features",
  title,
  author,
  nationality,
  cover[0] ${mediumQuery},
  description
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
    title, 
    name,
    teaser,
    slug,
    "category": select(
    _type == "portfolio" => "portfolios",
      _type == "spotOn" => "spot-on",     
      _type == "interview" => "visits",     
      _type == "review" => "reviews",      
      _type                                     
    ),
    releaseDate,
  }

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

export const interviewQuery = `*[_type=="interview"]{
  title,
  "type": "visit",
  "category": "visits",
  layout,
  selector,
  releaseDate,
  cover[0] ${imageOrSlideshowFragment},
  speakers[]->{
    name,
    initials,
  },
  author[]->{
    name,
    initials,
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
  releaseDate,
  teaser,
  articleImageFirst[0] ${mediumQuery},
  articleImageSecond[0] ${mediumQuery},
  cover[0] ${imageOrSlideshowFragment},
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
  releaseDate,
  layout,
  teaser,
  cover[0] ${mediumQuery},
  cover[0] ${imageOrSlideshowFragment},
  ${mediumFragment},
  fullscreenMedia[0] ${imageOrSlideshowFragment},

  articleImage[0] ${mediumQuery},
  gallery[] ${mediumQuery},
  author[]->{
    name,
    bio,
    socials[]{
      platform,
      link
    },
    role,
    portrait[0] ${mediumQuery},
  },
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
  "category": "recommended",
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
