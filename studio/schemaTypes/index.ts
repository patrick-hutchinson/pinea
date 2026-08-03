import {type SchemaTypeDefinition} from 'sanity'
import {pictureBrush} from './pictureBrush'
import {thumbnail} from './types/thumbnail'
import {imageWithMetadata} from './types/imageWithMetadata'
import {videoWithMetadata} from './types/videoWithMetadata'
import {location} from './location'
import {portfolio} from './portfolio'
import {announcement} from './announcement'
import {openCall} from './openCall'
import {event} from './event'
import {site} from './site'
import {eventType} from './definitions/eventTypes'
import {person} from './person'
import {recommendation} from './recommendation'
import {artist} from './artist'
import {country} from './definitions/countries'
import {aboutPage} from './aboutPage'
import {mediaPair} from './blocks/mediaPair'
import {media} from './blocks/media'
import {slideshow} from './blocks/slideshow'
import {medium} from './types/medium'
import {textEdit} from './types/textEdit'
import {speaker} from './types/speaker'
import {interviewText} from './types/interviewText'
import {homePage} from './homePage'
import {advertisementBanner} from './AdvertisementBanner'
import {review} from './review'
import {membersPage} from './membersPage'
import {editionsPage} from './editionsPage'
import {memberships} from './memberships'
import {news} from './news'
import {spotOn} from './spotOn'
import {singleLineRichText} from './types/singleLineRichText'
import {newsletterPortableText} from './types/newsletterPortableText'
import {contributor} from './contributor'
import {institution} from './institution'

import {calendarPage} from './calendarPage'
import {adBanner} from './adBanner'
import {pictureBrushTool} from './tools/pictureBrushTool'
import {blurPlaceholders} from './tools/blurPlaceholders'

import {print} from './print'
import {visit} from './visit'

import {newsletter} from './newsletter/newsletter'
import {newsletterAdBanner} from './newsletter/blocks/newsletterAdBanner'
import {newsletterAnnouncements} from './newsletter/blocks/newsletterAnnouncements'
import {newsletterBulletins} from './newsletter/blocks/newsletterBulletins'
import {newsletterDoubleFeature} from './newsletter/blocks/newsletterDoubleFeature'
import {newsletterRunningText} from './newsletter/blocks/newsletterRunningText'
import {newsletterShowcase} from './newsletter/blocks/newsletterShowcase'
import {newsletterAnnouncement} from './newsletter/blocks/newsletterAnnouncement'

import {periodicalPage} from './periodicalPage'
import {shopPage} from './shopPage'

import {periodical} from './periodical'

import {page} from './page'
import {imprint} from './imprint'
import {menu} from './menu'
import {portableText} from './types/portableText'
import {edition} from './edition'
import {link} from './types/link'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    pictureBrush,
    person,
    page,
    link,
    edition,
    recommendation,
    location,
    portfolio,
    print,
    thumbnail,
    imageWithMetadata,
    videoWithMetadata,
    announcement,
    periodicalPage,
    shopPage,
    openCall,
    event,
    calendarPage,
    site,
    eventType,
    mediaPair,
    media,
    slideshow,
    artist,
    country,
    aboutPage,

    periodical,
    medium,
    textEdit,
    visit,

    portableText,

    speaker,
    interviewText,
    singleLineRichText,
    newsletterPortableText,
    homePage,
    advertisementBanner,
    review,
    memberships,
    membersPage,
    editionsPage,
    news,
    spotOn,
    contributor,
    institution,
    menu,

    adBanner,
    pictureBrushTool,
    blurPlaceholders,

    // Newsletter
    newsletter,
    newsletterAdBanner,
    newsletterAnnouncements,
    newsletterBulletins,
    newsletterDoubleFeature,
    newsletterRunningText,
    newsletterShowcase,
    newsletterAnnouncement,

    imprint,
  ],
}
