import {type SchemaTypeDefinition} from 'sanity'
import {pictureBrush} from './pictureBrush'
import {thumbnail} from './types/thumbnail'
import {imageWithMetadata} from './types/imageWithMetadata'
import {videoWithMetadata} from './types/videoWithMetadata'
import {location} from './location'
import {feature} from './feature'
import {portfolio} from './portfolio'
import {periodical} from './periodical'
import {announcement} from './announcement'
import {openCall} from './openCall'
import {event} from './event'
import {site} from './site'
import {eventType} from './definitions/eventTypes'
import {voice} from './voice'
import {recommendation} from './recommendation'
import {artist} from './artist'
import {country} from './definitions/countries'
import {aboutPage} from './aboutPage'
import {artistLabel} from './definitions/artistLabel'
import {mediaPair} from './blocks/mediaPair'
import {media} from './blocks/media'
import {slideshow} from './blocks/slideshow'
import {medium} from './types/medium'
import {textEdit} from './types/textEdit'
import {interview} from './interview'
import {speaker} from './types/speaker'
import {interviewText} from './types/interviewText'
import {homePage} from './homePage'
import {advertisementBanner} from './AdvertisementBanner'
import {review} from './review'
import {membersPage} from './membersPage'
import {memberships} from './memberships'
import {news} from './news'
import {spotOn} from './spotOn'
import {singleLineRichText} from './types/singleLineRichText'
import {contributor} from './contributor'
import {institution} from './institution'
import {personHomePage} from './personHomePage'
import {calendarPage} from './calendarPage'
import {adBanner} from './adBanner'
import {pictureBrushTool} from './tools/pictureBrushTool'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    pictureBrush,
    voice,
    recommendation,
    location,
    feature,
    portfolio,
    thumbnail,
    imageWithMetadata,
    videoWithMetadata,
    periodical,
    announcement,
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
    artistLabel,
    medium,
    textEdit,
    interview,
    speaker,
    interviewText,
    singleLineRichText,
    homePage,
    advertisementBanner,
    review,
    memberships,
    membersPage,
    news,
    spotOn,
    contributor,
    institution,
    personHomePage,
    adBanner,
    pictureBrushTool,
  ],
}
