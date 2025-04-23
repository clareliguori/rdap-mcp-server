# rdap-mcp-server

[Model Context Protocol](https://modelcontextprotocol.io) server to look up domain names and IPs using [RDAP](https://www.icann.org/rdap).

This project is forked from [whois-mcp](https://github.com/bharathvaj-ganesan/whois-mcp).
Some TLDs such as .dev no longer support the whois protocol, but do support RDAP.

## Available Tools

| Tool          | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `rdap_domain` | Looks up rdap information about a domain                          |
| `rdap_ip`     | Looks up rdap information about an IP                             |
| `rdap_as`     | Looks up rdap information about an Autonomous System Number (ASN) |

### Usage

```json
"mcpServers": {
  "domains": {
    "command": "docker",
    "args": ["run", "-i", "--rm", "ghcr.io/clareliguori/rdap-mcp-server"]
  }
}
```

### Development

```bash
# Debug locally
npm install
npm run build
npx @modelcontextprotocol/inspector node dist/index.js

# Build and debug with Docker
docker build -t ghcr.io/clareliguori/rdap-mcp-server:latest .
npx @modelcontextprotocol/inspector docker run -i --rm ghcr.io/clareliguori/rdap-mcp-server:latest


# Publish
docker push ghcr.io/clareliguori/rdap-mcp-server:latest
```
