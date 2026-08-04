# @pipeworx/met-no

Norwegian Meteorological Institute (api.met.no, the data behind yr.no) MCP — global forecast, nowcast, sunrise/sunset, air-quality, ocean forecast. Keyless but requires a descriptive User-Agent (set by the gateway).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `forecast(lat, lon, altitude?)` — compact 10-day forecast (temperature, precip, wind, cloud)
- `nowcast(lat, lon)` — 90-min precipitation nowcast (Nordics only)
- `sunrise(lat, lon, date?)` — solar / lunar events for a given date
- `airquality(lat, lon, areaclass?)` — air-quality forecast (Nordics)
- `oceanforecast(lat, lon)` — ocean current, wave height, sea temperature

## Data source

`https://api.met.no/weatherapi/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "met-no": {
      "url": "https://gateway.pipeworx.io/met-no/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Met No data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
