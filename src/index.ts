#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  domain as rdapDomain,
  ip as rdapIp,
  autnum as rdapAutnum,
} from "node-rdap";

function registerTools(server: McpServer) {
  //TOOL: Domain RDAP lookup
  server.tool(
    "rdap_domain",
    "Looks up information about the domain",
    { domain: z.string().min(1) },
    async ({ domain }) => {
      try {
        const result = await rdapDomain(domain);
        return {
          content: [
            {
              type: "text",
              text: `Domain lookup for: \n${JSON.stringify(result)}`,
            },
          ],
        };
      } catch (err: unknown) {
        const error = err as Error;
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  //TOOL: IP RDAP lookup
  server.tool(
    "rdap_ip",
    "Looks up information about the IP",
    { ip: z.string().ip() },
    async ({ ip }) => {
      try {
        const result = await rdapIp(ip);
        return {
          content: [
            {
              type: "text",
              text: `IP lookup for: \n${JSON.stringify(result)}`,
            },
          ],
        };
      } catch (err: unknown) {
        const error = err as Error;
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  //TOOL: ASN RDAP lookup
  server.tool(
    "rdap_as",
    "Looks up information about the Autonomous System Number (ASN)",
    {
      asn: z
        .string()
        .regex(/^AS\d+$/i)
        .transform((s) => parseInt(s.slice(2))),
    },
    async ({ asn }) => {
      try {
        const result = await rdapAutnum(asn);
        return {
          content: [
            {
              type: "text",
              text: `ASN lookup for: \n${JSON.stringify(result)}`,
            },
          ],
        };
      } catch (err: unknown) {
        const error = err as Error;
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    }
  );
}

async function main() {
  const server = new McpServer({
    name: "rdap",
    version: "0.1.0",
    description: "Look up about domain, IP, and ASN using RDAP.",
  });
  registerTools(server);

  let transport = new StdioServerTransport();
  await server.connect(transport);

  const cleanup = async () => {
    console.log("\n⚠️ Shutting down MCP server...");
    await transport.close();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  console.error("✅ RDAP MCP Server running on stdio");
}

function handleError(error: any) {
  console.error("\n🚨  Error initializing RDAP MCP server:\n");
  console.error(`   ${error.message}\n`);
}

main().catch((error) => {
  handleError(error);
});
