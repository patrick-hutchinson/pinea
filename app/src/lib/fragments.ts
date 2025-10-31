export const thumbnailFragment = `
  thumbnail{
    "type": select(defined(image) => "image", defined(video) => "video"),

    // asset id (image.asset or video.video.asset)
    "_id": select(
      defined(image.image.asset) => image.image.asset->_id,
      defined(video.video.asset) => video.video.asset->_id,
      true => null
    ),

    // image-specific
    "url": select(defined(image.image.asset) => image.image.asset->url, true => null),
    "lqip": select(defined(image.image.asset) => image.image.asset->metadata.lqip, true => null),
    "width": select(defined(image.image.asset) => image.image.asset->metadata.dimensions.width, true => null),
    "height": select(defined(image.image.asset) => image.image.asset->metadata.dimensions.height, true => null),

    // video-specific
    "status": select(defined(video.video.asset) => video.video.asset->status, true => null),
    "assetId": select(defined(video.video.asset) => video.video.asset->assetId, true => null),
    "playbackId": select(defined(video.video.asset) => video.video.asset->playbackId, true => null),
    "aspect_ratio": select(
      defined(video.video.asset) => video.video.asset->data.aspect_ratio,
      true => null
    ),

    // common metadata
    "copyright": coalesce(image.copyright, video.copyright),
    "rightsEnd": coalesce(image.rightsEnd, video.rightsEnd)
  }
`;

export const satelliteImageFragment = `
  satelliteImage[0]{
    "medium": {
      "type": select(_type == "imageWithMetadata" => "image", _type == "videoWithMetadata" => "video"),

      // asset id
      "_id": select(
        _type == "imageWithMetadata" => imageWithMetadata.image.asset->_id,
        _type == "videoWithMetadata" => video.asset->assetId,
        true => null
      ),

      // image-specific
    "url": select(_type == "imageWithMetadata" => image.asset->url, true => null),
    "lqip": select(_type == "imageWithMetadata" => image.asset->metadata.lqip, true => null),
    "width": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.width, true => null),
    "height": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.height, true => null),

// video-specific
    "status": select(_type == "videoWithMetadata" => video.asset->status, true => null),
    "assetId": select(_type == "videoWithMetadata" => video.asset->assetId, true => null),
    "playbackId": select(_type == "videoWithMetadata" => video.asset->playbackId, true => null),
    "aspect_ratio": select(_type == "videoWithMetadata" => video.asset->data.aspect_ratio,
      true => null
    ),

      // common metadata
      "copyright": coalesce(imageWithMetadata.copyright, video.copyright),
      "rightsEnd": coalesce(imageWithMetadata.rightsEnd, video.rightsEnd)
    }
  }
`;

export const coverFragment = `
  cover[0]{
    "medium": {
      "type": select(_type == "imageWithMetadata" => "image", _type == "videoWithMetadata" => "video"),

      // asset id
      "_id": select(
        _type == "imageWithMetadata" => imageWithMetadata.image.asset->_id,
        _type == "videoWithMetadata" => video.asset->assetId,
        true => null
      ),

      // image-specific
    "url": select(_type == "imageWithMetadata" => image.asset->url, true => null),
    "lqip": select(_type == "imageWithMetadata" => image.asset->metadata.lqip, true => null),
    "width": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.width, true => null),
    "height": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.height, true => null),

// video-specific
    "status": select(_type == "videoWithMetadata" => video.asset->status, true => null),
    "assetId": select(_type == "videoWithMetadata" => video.asset->assetId, true => null),
    "playbackId": select(_type == "videoWithMetadata" => video.asset->playbackId, true => null),
    "aspect_ratio": select(_type == "videoWithMetadata" => video.asset->data.aspect_ratio,
      true => null
    ),

      // common metadata
      "copyright": coalesce(imageWithMetadata.copyright, video.copyright),
      "rightsEnd": coalesce(imageWithMetadata.rightsEnd, video.rightsEnd)
    }
  }
`;

export const articleImageFragment = `
  articleImage[0]{
    "medium": {
      "type": select(_type == "imageWithMetadata" => "image", _type == "videoWithMetadata" => "video"),

      // asset id
      "_id": select(
        _type == "imageWithMetadata" => imageWithMetadata.image.asset->_id,
        _type == "videoWithMetadata" => video.asset->assetId,
        true => null
      ),

      // image-specific
    "url": select(_type == "imageWithMetadata" => image.asset->url, true => null),
    "lqip": select(_type == "imageWithMetadata" => image.asset->metadata.lqip, true => null),
    "width": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.width, true => null),
    "height": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.height, true => null),

// video-specific
    "status": select(_type == "videoWithMetadata" => video.asset->status, true => null),
    "assetId": select(_type == "videoWithMetadata" => video.asset->assetId, true => null),
    "playbackId": select(_type == "videoWithMetadata" => video.asset->playbackId, true => null),
    "aspect_ratio": select(_type == "videoWithMetadata" => video.asset->data.aspect_ratio,
      true => null
    ),

      // common metadata
      "copyright": coalesce(imageWithMetadata.copyright, video.copyright),
      "rightsEnd": coalesce(imageWithMetadata.rightsEnd, video.rightsEnd)
    }
  }
`;

export const galleryFragment = `
  gallery[]{
    "medium": {
      "type": select(_type == "imageWithMetadata" => "image", _type == "videoWithMetadata" => "video"),

      // asset id
      "_id": select(
        _type == "imageWithMetadata" => imageWithMetadata.image.asset->_id,
        _type == "videoWithMetadata" => video.asset->assetId,
        true => null
      ),

      // image-specific
    "url": select(_type == "imageWithMetadata" => image.asset->url, true => null),
    "lqip": select(_type == "imageWithMetadata" => image.asset->metadata.lqip, true => null),
    "width": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.width, true => null),
    "height": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.height, true => null),

// video-specific
    "status": select(_type == "videoWithMetadata" => video.asset->status, true => null),
    "assetId": select(_type == "videoWithMetadata" => video.asset->assetId, true => null),
    "playbackId": select(_type == "videoWithMetadata" => video.asset->playbackId, true => null),
    "aspect_ratio": select(_type == "videoWithMetadata" => video.asset->data.aspect_ratio,
      true => null
    ),

      // common metadata
      "copyright": coalesce(imageWithMetadata.copyright, video.copyright),
      "rightsEnd": coalesce(imageWithMetadata.rightsEnd, video.rightsEnd)
    }
  }
`;

export const mediumFragment = `
  "medium": {
    "type": select(
      medium[0]._type == "imageWithMetadata" => "image",
      medium[0]._type == "videoWithMetadata" => "video"
    ),

    // asset id
    "_id": select(
      medium[0]._type == "imageWithMetadata" => medium[0].image.asset->_id,
      medium[0]._type == "videoWithMetadata" => medium[0].video.asset->assetId,
      true => null
    ),

    // image-specific
    "url": select(
      medium[0]._type == "imageWithMetadata" => medium[0].image.asset->url,
      true => null
    ),
    "lqip": select(
      medium[0]._type == "imageWithMetadata" => medium[0].image.asset->metadata.lqip,
      true => null
    ),
    "width": select(
      medium[0]._type == "imageWithMetadata" => medium[0].image.asset->metadata.dimensions.width,
      true => null
    ),
    "height": select(
      medium[0]._type == "imageWithMetadata" => medium[0].image.asset->metadata.dimensions.height,
      true => null
    ),

    // video-specific
    "status": select(
      medium[0]._type == "videoWithMetadata" => medium[0].video.asset->status,
      true => null
    ),
    "assetId": select(
      medium[0]._type == "videoWithMetadata" => medium[0].video.asset->assetId,
      true => null
    ),
    "playbackId": select(
      medium[0]._type == "videoWithMetadata" => medium[0].video.asset->playbackId,
      true => null
    ),
    "aspect_ratio": select(
      medium[0]._type == "videoWithMetadata" => medium[0].video.asset->data.aspect_ratio,
      true => null
    ),

    // common metadata
    "copyright": coalesce(
      medium[0].imageWithMetadata.copyright,
      medium[0].video.copyright
    ),
    "rightsEnd": coalesce(
      medium[0].imageWithMetadata.rightsEnd,
      medium[0].video.rightsEnd
    )
  }
`;

export const mediaPairFragment = `
  doubleFeature {
    "left": left[0]{
      // Detect whether this side is a "media" or "slideshow" block
      "type": _type,

      // If it's a single media:
      "medium": select(
        _type == "media" => medium[0]{
          "type": select(
            _type == "imageWithMetadata" => "image",
            _type == "videoWithMetadata" => "video"
          ),
          "_id": select(
            _type == "imageWithMetadata" => image.asset->_id,
            _type == "videoWithMetadata" => video.asset->assetId
          ),
          "url": select(_type == "imageWithMetadata" => image.asset->url),
          "lqip": select(_type == "imageWithMetadata" => image.asset->metadata.lqip),
          "width": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.width),
          "height": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.height),
          "status": select(_type == "videoWithMetadata" => video.asset->status),
          "assetId": select(_type == "videoWithMetadata" => video.asset->assetId),
          "playbackId": select(_type == "videoWithMetadata" => video.asset->playbackId),
          "aspect_ratio": select(_type == "videoWithMetadata" => video.asset->data.aspect_ratio),
          "copyright": coalesce(imageWithMetadata.copyright, video.copyright),
          "rightsEnd": coalesce(imageWithMetadata.rightsEnd, video.rightsEnd)
        },
        _type == "slideshow" => {
          "gallery": gallery[]{
            "type": select(
              _type == "imageWithMetadata" => "image",
              _type == "videoWithMetadata" => "video"
            ),
            "_id": select(
              _type == "imageWithMetadata" => image.asset->_id,
              _type == "videoWithMetadata" => video.asset->assetId
            ),
            "url": select(_type == "imageWithMetadata" => image.asset->url),
            "lqip": select(_type == "imageWithMetadata" => image.asset->metadata.lqip),
            "width": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.width),
            "height": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.height),
            "status": select(_type == "videoWithMetadata" => video.asset->status),
            "assetId": select(_type == "videoWithMetadata" => video.asset->assetId),
            "playbackId": select(_type == "videoWithMetadata" => video.asset->playbackId),
            "aspect_ratio": select(_type == "videoWithMetadata" => video.asset->data.aspect_ratio),
            "copyright": coalesce(imageWithMetadata.copyright, video.copyright),
            "rightsEnd": coalesce(imageWithMetadata.rightsEnd, video.rightsEnd)
          }
        }
      )
    },

    "right": right[0]{
      "type": _type,
      "medium": select(
        _type == "media" => medium[0]{
          "type": select(
            _type == "imageWithMetadata" => "image",
            _type == "videoWithMetadata" => "video"
          ),
          "_id": select(
            _type == "imageWithMetadata" => image.asset->_id,
            _type == "videoWithMetadata" => video.asset->assetId
          ),
          "url": select(_type == "imageWithMetadata" => image.asset->url),
          "lqip": select(_type == "imageWithMetadata" => image.asset->metadata.lqip),
          "width": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.width),
          "height": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.height),
          "status": select(_type == "videoWithMetadata" => video.asset->status),
          "assetId": select(_type == "videoWithMetadata" => video.asset->assetId),
          "playbackId": select(_type == "videoWithMetadata" => video.asset->playbackId),
          "aspect_ratio": select(_type == "videoWithMetadata" => video.asset->data.aspect_ratio),
          "copyright": coalesce(imageWithMetadata.copyright, video.copyright),
          "rightsEnd": coalesce(imageWithMetadata.rightsEnd, video.rightsEnd)
        },
        _type == "slideshow" => {
          "gallery": gallery[]{
            "type": select(
              _type == "imageWithMetadata" => "image",
              _type == "videoWithMetadata" => "video"
            ),
            "_id": select(
              _type == "imageWithMetadata" => image.asset->_id,
              _type == "videoWithMetadata" => video.asset->assetId
            ),
            "url": select(_type == "imageWithMetadata" => image.asset->url),
            "lqip": select(_type == "imageWithMetadata" => image.asset->metadata.lqip),
            "width": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.width),
            "height": select(_type == "imageWithMetadata" => image.asset->metadata.dimensions.height),
            "status": select(_type == "videoWithMetadata" => video.asset->status),
            "assetId": select(_type == "videoWithMetadata" => video.asset->assetId),
            "playbackId": select(_type == "videoWithMetadata" => video.asset->playbackId),
            "aspect_ratio": select(_type == "videoWithMetadata" => video.asset->data.aspect_ratio),
            "copyright": coalesce(imageWithMetadata.copyright, video.copyright),
            "rightsEnd": coalesce(imageWithMetadata.rightsEnd, video.rightsEnd)
          }
        }
      )
    }
  }
`;
