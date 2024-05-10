const Media = require('../models/mediaModel');

const getMediaWithUrls = (req, media , next) => {
    const baseUrl = `http://${req.header('Host')}`;
  try {
    if (Array.isArray(media)) {
        const checkMediaInstance = media.every(ele=>ele instanceof Media)
        const mediaWithUrls = media.map((mediaItem) => {
            if(checkMediaInstance) mediaItem = mediaItem.toObject()
          const pathsWithUrls = mediaItem.paths.map((item) => {
            const url = `${baseUrl}/${item.path.split('/').slice(1).join('/')}`;
            return { ...item, url };
          });

          return { ...mediaItem, paths: pathsWithUrls };
        });

        return mediaWithUrls
    } else {
        if(media instanceof Media) media = media.toObject()
        const mediaWithUrls = media.paths.map((mediaItem)=>{
            const url = `${baseUrl}/${mediaItem.path.split('/').slice(1).join('/')}`;
            return {...mediaItem,url}
        })
        return {...media,paths:mediaWithUrls}
    }
  } catch (error) {
    next(error);
  }
};

module.exports = getMediaWithUrls;
