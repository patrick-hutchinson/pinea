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
import {artist} from './artist'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    pictureBrush,
    voice,
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
    site,
    eventType,
    artist,
  ],
}
