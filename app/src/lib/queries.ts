export const siteQuery = `*[_type=="site"][0]{
  title,
  description,
  about,
  socials[]{
    platform,
    link
  },
  supporters
}`;

export const pictureBrushQuery = `*[_type=="pictureBrush"][0]{
  images[]{
    "type": select(defined(image) => "image", defined(video) => "video"),
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
}`;

export const portfolioQuery = `*[_type=="portfolio"][0]{
  images[]{
    "type": select(_type == "image" => "image", _type == "video" => "video"),
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
}`;

export const featuresQuery = `*[_type=="feature"]{
  title,
  author,
  nationality,
  thumbnail{
    "type": select(defined(image) => "image", defined(video) => "video"),
    "_id": select(
      defined(image.asset) => image.asset->_id,
      defined(video.asset) => video.asset->_id,
      true => null
    ),
    "url": select(defined(image.asset) => image.asset->url, true => null),
    "lqip": select(defined(image.asset) => image.asset->metadata.lqip, true => null),
    "width": select(defined(image.asset) => image.asset->metadata.dimensions.width, true => null),
    "height": select(defined(image.asset) => image.asset->metadata.dimensions.height, true => null),
    "status": select(defined(video.asset) => video.asset->status, true => null),
    "assetId": select(defined(video.asset) => video.asset->assetId, true => null),
    "playbackId": select(defined(video.asset) => video.asset->playbackId, true => null),
    "aspect_ratio": select(
      defined(video.asset) => video.asset->data.aspect_ratio,
      defined(image) => null
    )
  },
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
  thumbnail{
    "type": select(defined(image) => "image", defined(video) => "video"),
    "_id": select(
      defined(image.asset) => image.asset->_id,
      defined(video.asset) => video.asset->_id,
      true => null
    ),
    "url": select(defined(image.asset) => image.asset->url, true => null),
    "lqip": select(defined(image.asset) => image.asset->metadata.lqip, true => null),
    "width": select(defined(image.asset) => image.asset->metadata.dimensions.width, true => null),
    "height": select(defined(image.asset) => image.asset->metadata.dimensions.height, true => null),
    "status": select(defined(video.asset) => video.asset->status, true => null),
    "assetId": select(defined(video.asset) => video.asset->assetId, true => null),
    "playbackId": select(defined(video.asset) => video.asset->playbackId, true => null),
    "aspect_ratio": select(
      defined(video.asset) => video.asset->data.aspect_ratio,
      defined(image) => null
    )
  },
}`;

export const openCallQuery = `*[_type=="openCall"]{
  title,
  description,
  date,
  thumbnail{
    "type": select(defined(image) => "image", defined(video) => "video"),
    "_id": select(
      defined(image.asset) => image.asset->_id,
      defined(video.asset) => video.asset->_id,
      true => null
    ),
    "url": select(defined(image.asset) => image.asset->url, true => null),
    "lqip": select(defined(image.asset) => image.asset->metadata.lqip, true => null),
    "width": select(defined(image.asset) => image.asset->metadata.dimensions.width, true => null),
    "height": select(defined(image.asset) => image.asset->metadata.dimensions.height, true => null),
    "status": select(defined(video.asset) => video.asset->status, true => null),
    "assetId": select(defined(video.asset) => video.asset->assetId, true => null),
    "playbackId": select(defined(video.asset) => video.asset->playbackId, true => null),
    "aspect_ratio": select(
      defined(video.asset) => video.asset->data.aspect_ratio,
      defined(image) => null
    )
  },
}`;

export const eventQuery = `*[_type=="event"]{
  title,
  artist,
  startDate,
  endDate,
  city,
  country,
  museum,
  thumbnail{
    "type": select(defined(image) => "image", defined(video) => "video"),
    "_id": select(
      defined(image.asset) => image.asset->_id,
      defined(video.asset) => video.asset->_id,
      true => null
    ),
    "url": select(defined(image.asset) => image.asset->url, true => null),
    "lqip": select(defined(image.asset) => image.asset->metadata.lqip, true => null),
    "width": select(defined(image.asset) => image.asset->metadata.dimensions.width, true => null),
    "height": select(defined(image.asset) => image.asset->metadata.dimensions.height, true => null),
    "status": select(defined(video.asset) => video.asset->status, true => null),
    "assetId": select(defined(video.asset) => video.asset->assetId, true => null),
    "playbackId": select(defined(video.asset) => video.asset->playbackId, true => null),
    "aspect_ratio": select(
      defined(video.asset) => video.asset->data.aspect_ratio,
      defined(image) => null
    )
  },
}`;
