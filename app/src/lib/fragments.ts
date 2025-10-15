export const thumbnailFragment = `
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
  }
`;

export const galleryFragment = `
  gallery[]{
    // wrap all asset-related fields in a media object
    "medium": {
      "type": select(_type == "customImage" => "image", _type == "customVideo" => "video"),
      // image fields
      "assetId": select(
        _type == "customImage" => customImage.asset->_id,
        _type == "customVideo" => video.asset->assetId
      ),
      "url": select(
        _type == "customImage" => customImage.asset->url,
        _type == "customVideo" => null
      ),
      "lqip": select(
        _type == "customImage" => customImage.asset->metadata.lqip,
        _type == "customVideo" => null
      ),
      "width": select(
        _type == "customImage" => customImage.asset->metadata.dimensions.width,
        _type == "customVideo" => null
      ),
      "height": select(
        _type == "customImage" => customImage.asset->metadata.dimensions.height,
        _type == "customVideo" => null
      ),

      // video fields
      "status": select(
        _type == "customVideo" => video.asset->status,
        _type == "customImage" => null
      ),
      "playbackId": select(
        _type == "customVideo" => video.asset->playbackId,
        _type == "customImage" => null
      ),
      "aspect_ratio": select(
        _type == "customVideo" => video.asset->data.aspect_ratio,
        _type == "customImage" => null
      )
    },

    // common fields
    "copyright": copyright,
    "rightsEnd": rightsEnd
  }
`;
