import {type SchemaTypeDefinition} from 'sanity'
import {pictureBrush} from './pictureBrush'
import {thumbnail} from './types/thumbnail'
import {customImage} from './types/customImage'
import {customVideo} from './types/customVideo'
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

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    pictureBrush,
    voice,
    recommendation,
    feature,
    portfolio,
    thumbnail,
    customImage,
    customVideo,
    periodical,
    announcement,
    openCall,
    event,
    site,
    eventType,
  ],
}
