# mcp-met-no

MET Norway weather (api.met.no behind yr.no) — global forecast, sunrise, ocean

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `forecast` | Compact 10-day forecast (temperature, precip, wind, cloud, humidity). |
| `nowcast` | 90-minute precipitation nowcast (Nordics only — outside region returns sparse data). |
| `sunrise` | Sunrise / sunset / moon events for a date. |
| `airquality` | Air-quality forecast (Norway). |
| `oceanforecast` | Ocean forecast — current, wave height, sea temperature. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
