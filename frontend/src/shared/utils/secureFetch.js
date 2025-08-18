export const secureFetch = async (url, options = {}, accessToken) => {
   const headers = { ...options.headers };
   if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

   const response = await fetch(url, { ...options, headers });
   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

   return response.json();
};

export const deleteFetch = async (url, accessToken) => {
   const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
   };

   const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers,
   });

   if (response.status !== 204)
      throw new Error(`HTTP error! status: ${response.status}`);

   return response;
};
