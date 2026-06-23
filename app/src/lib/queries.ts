import {
  imageOrSlideshowFragment,
  mediumFragment,
  mediumQuery,
  PDFDownloadFragment,
  singleMediaFragment,
} from "./fragments";
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

export const menuQuery = `*[_type=="menu"][0]{
  mediaAsset[0] ${singleMediaFragment}
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
      gallery[] ${mediumQuery},
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
    medium[0] ${mediumQuery},
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
    shopifyProductHandle,
    ${mediumFragment}
  },
}`;

export const searchableData = `*[_type in ["news", "openCall", "visit", "review", "spotOn", "portfolio", "contributor", "event", "person"]
  &&
  (
    (_type == "event" && duration.endDate >= now()) ||           // only future events
    (_type in ["news", "openCall", "visit", "review", "spotOn", "portfolio", "contributor", "person"]) // keep all others
  )
]{
  _id,
  _type,
  title,
  teaser,
  name,
  "museum": location->museum,
  "contributorNames": select(
    _type in ["visit", "review", "spotOn"] => array::compact(releaseInfo.contributor[]->name),
    _type == "portfolio" => array::compact([
      coalesce(releaseInfo.contributor->name, releaseInfo.contributor[0]->name)
    ]),
    _type == "contributor" => [name],
    _type == "person" => [name],
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
  showPineaIcon,
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
        title,
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
      label,
      displaySmallImage,
      imageLink,
      copyright,
      text,
      "image": {
        "url": image.asset->url,
        "dimensions": image.asset->metadata.dimensions
      }
    },
    _type == "newsletterBulletins" => {
      sectionHeader,
      bulletin[]->{
        _type,
        slug,
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
        mediumMobile[0] ${mediumQuery},
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

export const pictureBrushToolQuery = `*[_type=="pictureBrushTool"] | order(_updatedAt desc)[0]{
imageSets[count(images[defined(asset)]) > 1]{
  title,
  images[defined(asset)][]{
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
  PDFDownload ${PDFDownloadFragment},
  slug
}`;

export const contributorsQuery = `*[_type=="contributor"]{
  _id,
  name,
  role,
  bio,
  portrait[0] ${mediumQuery},
  socials[]{
    platform,
    link
  },
  "articles": array::compact(articles[]->{
    _id,
    _type,
    title, 
    name,
    teaser,
    slug,
    "category": select(
      _type == "portfolio" => "portfolios",
      _type == "spotOn" => "spot-on",     
      _type == "interview" => "visits",
      _type == "visit" => "visits",         
      _type == "review" => "reviews",      
      _type                                     
    ),
    "releaseDate": coalesce(releaseInfo.releaseDate, releaseDate),
  })

}`;

export const printContributorEntriesQuery = `*[_type=="periodical"]{
  _id,
  title,
  selector,
  "periodicalCover": cover[0] ${mediumQuery},
  printEntries[]{
    "_id": coalesce(legacyPrintId, _key),
    "_type": "print",
    title,
    category,
    releaseDate,
    teaser,
    "authorRefs": array::compact(author[]->_id),
    PDFDownload ${PDFDownloadFragment},
    author[]->{
      _id,
      name,
      initials,
    },
  }
}`;

export const periodicalsQuery = `*[_type=="periodical"] | order(_createdAt desc){
  _id,
  title,
  isbn,
  info,
  selector,
  gallery[] ${mediumQuery},
  teaser,
  description,
  cover[0] ${mediumQuery},
}`;

export const editionsQuery = `*[_type=="edition"] | order(_createdAt desc){
  _id,
  title,
  info,
  selector,
  gallery[] ${mediumQuery},
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
  membersOnlyContent,
  deadline,
  slug
}`;

export const membersOnlyOpenCallsCountQuery = `count(*[_type=="openCall" && membersOnlyContent == true])`;

export const downloadableArticlesCountQuery = `{
  "articleCount": count(*[_type in ["visit", "review", "portfolio", "spotOn"] && defined(PDFDownload.asset)]),
  "printArticleCount": count(*[_type=="periodical"].printEntries[defined(PDFDownload.asset)][])
}`;

export const newsQuery = `*[_type=="news"]{
  title,
  teaser,
  text,
  link,
  membersOnlyContent,
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

export const printQuery = `*[_type=="periodical"]{
  title,
  printEntries[]{
    "_id": coalesce(legacyPrintId, _key),
    "_type": "print",
    title,
    category,
    releaseDate,
    teaser,
    PDFDownload ${PDFDownloadFragment},
    author[]->{
      name,
      initials,
    },
    "periodicalTitle": ^.title,
    "periodicalCover": ^.cover[0] ${mediumQuery}
  }
}.printEntries[]`;

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
    "contributor": array::compact(contributor[]->{
      name,
      bio,
      socials[]{
        platform,
        link
      },
      role,
      portrait[0] ${mediumQuery},
    }),
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
  PDFDownload ${PDFDownloadFragment},
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
    "contributor": array::compact(contributor[]->{
      name,
    }),
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
  PDFDownload ${PDFDownloadFragment},
  slug
}`;

export const spotOnQuery = `*[_type=="spotOn"]{
  title,
  "type": "spot-on",
  "category": "spot-on",
  releaseInfo{
    releaseDate,
    "contributor": array::compact(contributor[]->{
      name,
      bio,
      socials[]{
        platform,
        link
      },
      role,
      portrait[0] ${mediumQuery},
    }),
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
  PDFDownload ${PDFDownloadFragment},
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
  hostedType,
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
    street,
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
        street,
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

export const countriesQuery = `*[_type=="country"] | order(coalesce(name[language=="en"][0].value, name[0].value) asc){
  _id,
  cca2,
  "label": coalesce(name[language=="en"][0].value, name[0].value)
}`;
