import { User  }from "../components/user/user.model.js"
import { Video  }from "../components/video/video.model.js";
import { Comment  }from "../components/comment/comments.model.js";
import { Like  }from "../components/like/like.model.js";
import { Playlist  }from "../components/playlist/playlist.model.js";
import { Subscription  }from "../components/subscription/subscription.model.js";
import { Tweet  }from "../components/tweet/tweet.model.js";
import { logger } from "../utils/logger/index.js";

const models = [
   User,
   Video,
   Comment,
   Like,
   Playlist,
   Subscription,
   Tweet
]

export const initCollections = async () => {
   // for (const model of models) {
   //    try {
   //       await model.createCollection();
   //       logger.info(`Initialized collection: ${model.collection.name}`);
   //    } catch (error) {
   //       logger.info(`Error initializing collection ${model.collection.name}:`, error);
   //    }
   // }
   try {
      await Video.createCollection();
      logger.info(`Initialized collection: User`);
   } catch (error) {
      logger.error(`Error initializing collection User:`, error);
      
   }
}
