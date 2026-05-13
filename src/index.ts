interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * MET Norway (api.met.no) MCP — global weather, Nordics specials.
 *
 * Auth: none. Strict UA policy: must identify caller. Docs:
 *   https://api.met.no/doc/TermsOfService
 */


const BASE = 'https://api.met.no/weatherapi';
const UA = 'pipeworx-mcp-met-no/1.0 (contact: ops@pipeworx.io; +https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'forecast',
    description: 'Compact 10-day forecast (temperature, precip, wind, cloud, humidity).',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'Latitude (decimal degrees).' },
        lon: { type: 'number', description: 'Longitude (decimal degrees).' },
        altitude: { type: 'number', description: 'Meters above sea level (optional, improves accuracy).' },
      },
      required: ['lat', 'lon'],
    },
  },
  {
    name: 'nowcast',
    description: '90-minute precipitation nowcast (Nordics only — outside region returns sparse data).',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
      },
      required: ['lat', 'lon'],
    },
  },
  {
    name: 'sunrise',
    description: 'Sunrise / sunset / moon events for a date.',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
        date: { type: 'string', description: 'YYYY-MM-DD (default today UTC).' },
        offset: { type: 'string', description: 'UTC offset, e.g. "+01:00" (default "+00:00").' },
      },
      required: ['lat', 'lon'],
    },
  },
  {
    name: 'airquality',
    description: 'Air-quality forecast (Norway).',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
        areaclass: { type: 'string', description: 'grunnkrets | delomraade | kommune | fylke | land (default grunnkrets)' },
      },
      required: ['lat', 'lon'],
    },
  },
  {
    name: 'oceanforecast',
    description: 'Ocean forecast — current, wave height, sea temperature.',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
      },
      required: ['lat', 'lon'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'forecast': {
      const params = ll(args);
      if (typeof args.altitude === 'number') params.set('altitude', String(args.altitude | 0));
      return metGet(`/locationforecast/2.0/compact?${params}`);
    }
    case 'nowcast':
      return metGet(`/nowcast/2.0/complete?${ll(args)}`);
    case 'sunrise': {
      const params = ll(args);
      const date = (args.date as string | undefined) ?? new Date().toISOString().slice(0, 10);
      const offset = (args.offset as string | undefined) ?? '+00:00';
      params.set('date', date);
      params.set('offset', offset);
      return metGet(`/sunrise/3.0/sun?${params}`);
    }
    case 'airquality': {
      const params = ll(args);
      if (args.areaclass) params.set('areaclass', String(args.areaclass));
      return metGet(`/airqualityforecast/0.1/?${params}`);
    }
    case 'oceanforecast':
      return metGet(`/oceanforecast/2.0/complete?${ll(args)}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function ll(args: Record<string, unknown>): URLSearchParams {
  const lat = args.lat as number;
  const lon = args.lon as number;
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Required: lat and lon (decimal numbers).');
  }
  return new URLSearchParams({ lat: lat.toFixed(4), lon: lon.toFixed(4) });
}

async function metGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 403) throw new Error('MET Norway: 403 — usually a UA-policy block. Set a descriptive UA.');
  if (res.status === 429) throw new Error('MET Norway: 429 rate-limit.');
  if (!res.ok) throw new Error(`MET Norway: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
