export const secureFetch = async (url, options = {}, accessToken) => {
   const headers = { ...options.headers };
   if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
   
   const response = await fetch(url, { ...options, headers });
   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
   
   return response.json();
}
