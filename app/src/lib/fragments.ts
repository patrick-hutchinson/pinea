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
export const galleryFragment = `
  gallery[]{
    // wrap all asset-related fields in a media object
    "medium": {
      "type": select(_type == "imageWithMetadata" => "image", _type == "videoWithMetadata" => "video"),
      // image fields
      "assetId": select(
        _type == "imageWithMetadata" => imageWithMetadata.asset->_id,
        _type == "videoWithMetadata" => video.asset->assetId
      ),
      "url": select(
        _type == "imageWithMetadata" => imageWithMetadata.asset->url,
        _type == "videoWithMetadata" => null
      ),
      "lqip": select(
        _type == "imageWithMetadata" => imageWithMetadata.asset->metadata.lqip,
        _type == "videoWithMetadata" => null
      ),
      "width": select(
        _type == "imageWithMetadata" => imageWithMetadata.asset->metadata.dimensions.width,
        _type == "videoWithMetadata" => null
      ),
      "height": select(
        _type == "imageWithMetadata" => imageWithMetadata.asset->metadata.dimensions.height,
        _type == "videoWithMetadata" => null
      ),

      // video fields
      "status": select(
        _type == "videoWithMetadata" => video.asset->status,
        _type == "imageWithMetadata" => null
      ),
      "playbackId": select(
        _type == "videoWithMetadata" => video.asset->playbackId,
        _type == "imageWithMetadata" => null
      ),
      "aspect_ratio": select(
        _type == "videoWithMetadata" => video.asset->data.aspect_ratio,
        _type == "imageWithMetadata" => null
      )
    },

    // common fields
    "copyright": copyright,
    "rightsEnd": rightsEnd
  }
`;
