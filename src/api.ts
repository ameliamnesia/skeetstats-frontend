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

export async function getStats(handle, page?: number) {
  let resdid = await handleOrDid(handle);
  let url = `${baseApiUrl}/api/stats/${resdid}`;
  if (page) {
    url += `?page=${page}`;
  }
  const response = await fetch(url);
  const respData = await response.json();
  respData.forEach(async (array, index) => {
    const uglyDate = new Date(array.date);
    const prettyDate = uglyDate.toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
    array.date = prettyDate;
  });
  const stats = await respData.map(({ did, idstats, postsDifference, ...rest }) => rest);
  return stats;
}

export async function getCharts(handle) {
  let resdid = await handleOrDid(handle);
  const response = await fetch(`${baseApiUrl}/api/charts/${resdid}`);
  const respData = await response.json();
  respData.forEach(async (array, index) => {
    const uglyDate = new Date(array.date);
    const prettyDate = uglyDate.toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
    array.date = prettyDate;
  });
  const chartsData = await respData.map(({ did, idstats, postsDifference, ...rest }) => rest);
  const monthResponse = await fetch(`${baseApiUrl}/api/monthly/${resdid}`);
  const monthData = await monthResponse.json();
  monthData.forEach(async (array, index) => {
    const [month, year] = array.date.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    const uglyDate = new Date(parseInt(year), monthIndex);
    const prettyDate = uglyDate.toLocaleDateString('en-US', { month: 'short' });
    array.date = prettyDate;
  });
  return { charts: chartsData, monthData };
}

export async function getMax(handle: string): Promise<any> {
  let resdid = await handleOrDid(handle)
  const response = await fetch(`${baseApiUrl}/api/mostincreased/${resdid}`)
  const data = await response.json();
  return data
}

export async function profileInfo(handle: string): Promise<any> {
  let resdid = await handleOrDid(handle)
  const response = await fetch(`${baseApiUrl}/api/profile/${resdid}`);
  const respData = await response.json();
  const plcdir = `https://plc.directory/${resdid}/log/audit`;
  try {
    const audit = await fetch(plcdir);
    const plcData = await audit.json();
    if (Array.isArray(plcData) && plcData.length > 0) {
      const created = new Date(plcData[0].createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      respData.created = created
    } else {
      console.log('No data returned or data is not in expected format.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
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

const handleCache: { [key: string]: Promise<string> } = {};
export async function handleOrDid(handle: string) {
  if (handleCache[handle]) {
    return handleCache[handle];
  }
  let resdid: string;
  let strippedHandle = handle.replace(/[@'"]/g, '');
  if (regex.test(handle)) {
    const resultString: string = handle.replace(regex, (match) => match.replace(/[@'"\,]/g, ''));
    resdid = resultString;
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
  handleCache[handle] = Promise.resolve(resdid);
  return resdid;
}