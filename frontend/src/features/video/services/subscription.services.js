export const SubscriptionService = {
   async toggleSubscription(channelId) {
      const response = await fetch(`/api/v1/subscriptions/c/${channelId}`, {
         credentials: "include",
         method: "POST",
         headers: { "Content-Type": "application/json" },
      });
   
      if (response.status !== 200 && response.status !== 201 && response.status !== 204) {
         throw new Error(`Failed to toggle subscription: ${response.statusText}`);
      }
   
      // 204 means unsubscribed, no content to parse
      if (response.status === 204) {
         return { status: "Unsubscribed" };
      }

      const data = await response.json();
      return data?.data;
   },

   async getChannelSubscribers(channelId) {
      const response = await fetch(`/api/v1/subscriptions/c/${channelId}`, {
         credentials: "include",
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
   
      if (response.status !== 200) {
         throw new Error(`Failed to fetch subscribers: ${response.statusText}`);
      }
   
      const data = await response.json();
      return data?.data;
   },

   async getSubscribedChannels(subscriberId) {
      const response = await fetch(`/api/v1/subscriptions/u/${subscriberId}`, {
         credentials: "include",
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
   
      if (response.status !== 200) {
         throw new Error(`Failed to fetch subscribed channels: ${response.statusText}`);
      }
   
      const data = await response.json();
      return data?.data;
   },
};
