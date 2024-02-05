const baseApiUrl = 'https://skeetstats.xyz:8443'
const regex: RegExp = /^did:plc:[^@'"\,]+/;
interface StatsData {
  did: string;
  date: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
}

export interface ProcessedStatsRow extends StatsData {
  postsCountDiff?: number; // additional column
}

export async function getStats(handle: string): Promise<StatsData[]> {
  let resdid = await handleOrDid(handle)
  const response = await fetch(`${baseApiUrl}/api/stats/${resdid}`)
  const respData = await response.json();
  respData.forEach(async (array, index) => {
    const uglyDate = new Date(array.date);
    const month = ('0' + (uglyDate.getMonth() + 1)).slice(-2); // Adding leading zero if needed
    const day = ('0' + uglyDate.getDate()).slice(-2); // Adding leading zero if needed
    const year = uglyDate.getFullYear().toString().slice(-2); // Getting last two digits of the year
    const prettyDate = `${month}/${day}/${year}`;
    array.date = prettyDate;
  });
  const stats = await respData.map(({ did, idstats, postsDifference, ...rest }) => rest);
  return stats
}

export async function getCharts(handle: string): Promise<StatsData[]> {
  let resdid = await handleOrDid(handle)
  const response = await fetch(`${baseApiUrl}/api/charts/${resdid}`)
  const respData = await response.json();
  respData.forEach(async (array, index) => {
    const uglyDate = new Date(array.date);
    const month = ('0' + (uglyDate.getMonth() + 1)).slice(-2); // Adding leading zero if needed
    const day = ('0' + uglyDate.getDate()).slice(-2); // Adding leading zero if needed
    const year = uglyDate.getFullYear().toString().slice(-2); // Getting last two digits of the year
    const prettyDate = `${month}/${day}/${year}`;
    array.date = prettyDate;
  });
  const stats = await respData.map(({ did, idstats, postsDifference, ...rest }) => rest);
  return stats
}

export async function profileInfo(handle: string): Promise<any> {
  let resdid = await handleOrDid(handle)
  const response = await fetch(`${baseApiUrl}/api/profile/${resdid}`);
  const respData = await response.json();
  return respData
}

export async function getSuggestions(handle: string): Promise<any> {
  let resdid = await handleOrDid(handle)
  const response = await fetch(`${baseApiUrl}/api/suggested/${resdid}`);
  const respData = await response.json();
  const suggests = await respData.map(({ banner, description, followersCount, followsCount, indexedAt, postsCount, ...rest }) => rest)
  return suggests
}

export async function getFollowers(handle: string, cursor?: string) {
  let resdid = await handleOrDid(handle)
  const response = await fetch(`${baseApiUrl}/api/followers/${resdid}/${cursor || ''}`)
  const respData = await response.json();
  const followers = await respData.map(({ description, indexedAt, ...rest }) => rest);
  return followers;
}

export async function handleOrDid(handle: string) {
  let resdid: string
  let strippedHandle = handle.replace(/[@'"]/g, '');
  if (regex.test(handle)) {
    const resultString: string = handle.replace(regex, (match) => match.replace(/[@'"\,]/g, ''));
    resdid = resultString
  } else {
    try {
      const response = await fetch(`${baseApiUrl}/api/resolve/${strippedHandle}`, { method: 'POST' });
      if (!response.ok) {
        console.log(`Failed to resolve ${strippedHandle}`);
      }
      resdid = await response.json();
    } catch (error) {
      console.log(`Error resolving handle: ${error.message}`);
    }
  }
  return resdid
}