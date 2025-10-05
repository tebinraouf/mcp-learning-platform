/**
 * Stage 4: Building & Debugging
 * Practical implementation and debugging of MCP servers and clients
 */

import type { Stage } from '@/types'

export const buildingDebuggingStage: Stage = {
    id: 'building-debugging',
    name: 'Building & Debugging',
    description:
        'Learn to build production-ready MCP servers and clients, debug common issues, test implementations, and deploy to various environments.',
    objectives: [
        'Build a complete MCP server from scratch',
        'Implement MCP clients for different platforms',
        'Debug MCP communication issues effectively',
        'Test MCP implementations thoroughly',
        'Deploy MCP servers to production',
    ],
    estimatedMinutes: 60,
    sequenceOrder: 4,
    prerequisites: ['foundations', 'architecture-messages', 'advanced-patterns'],
    concepts: [
        'server-implementation',
        'client-implementation',
        'debugging',
        'testing',
        'deployment',
    ],
    modules: [
        {
            id: 'building-debugging-1',
            stageId: 'building-debugging',
            title: 'Building Your First MCP Server',
            objectives: [
                'Set up an MCP server project',
                'Implement tools with proper schemas',
                'Add resources and prompts',
                'Test the server with MCP Inspector',
            ],
            estimatedMinutes: 20,
            sequenceOrder: 1,
            relatedConcepts: ['server-implementation', 'tools', 'resources'],
            content: {
                sections: [
                    {
                        heading: 'Server Setup and Project Structure',
                        type: 'text',
                        body: `Let's build a **calculator MCP server** from scratch!

## Step 1: Install Dependencies

**TypeScript:**
\`\`\`bash
npm install @modelcontextprotocol/sdk zod
npm install -D @types/node typescript
\`\`\`

**Python:**
\`\`\`bash
pip install "mcp[cli]"
\`\`\`

**C# (.NET):**
\`\`\`bash
dotnet add package ModelContextProtocol --prerelease
dotnet add package Microsoft.Extensions.Hosting
\`\`\`

## Step 2: Create Server Instance

**TypeScript:**
\`\`\`typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Calculator",
  version: "1.0.0"
});
\`\`\`

**Python:**
\`\`\`python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Calculator")
\`\`\`

**C#:**
\`\`\`csharp
using ModelContextProtocol.Server;

var builder = Host.CreateApplicationBuilder(args);
builder.Services
    .AddMcpServer()
    .WithStdioServerTransport()
    .WithToolsFromAssembly();
\`\`\``,
                    },
                    {
                        heading: 'Implementing Tools',
                        type: 'text',
                        body: `Tools are the heart of your server. Here's how to add them:

## TypeScript Tool
\`\`\`typescript
server.tool(
  "add",
  { a: z.number(), b: z.number() },  // Input schema with Zod
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);
\`\`\`

## Python Tool
\`\`\`python
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b
\`\`\`

## C# Tool
\`\`\`csharp
[McpServerToolType]
public static class CalculatorTool
{
    [McpServerTool, Description("Adds two numbers")]
    public static string Add(int a, int b) => $"Sum {a + b}";
}
\`\`\`

## Key Points
- ✅ **Clear descriptions** - Help LLMs understand when to use the tool
- ✅ **Type safety** - Use schema validation (Zod, Pydantic, etc.)
- ✅ **Error handling** - Catch and return meaningful errors
- ✅ **Structured output** - Return consistent content types`,
                    },
                    {
                        heading: 'Adding Resources and Starting Server',
                        type: 'text',
                        body: `## Resources
Add dynamic resources for context:

**TypeScript:**
\`\`\`typescript
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: \`Hello, \${name}!\`
    }]
  })
);
\`\`\`

**Python:**
\`\`\`python
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"
\`\`\`

## Start the Server

**TypeScript:**
\`\`\`typescript
const transport = new StdioServerTransport();
await server.connect(transport);
\`\`\`

**Python:**
\`\`\`bash
mcp run server.py
\`\`\`

**C#:**
\`\`\`csharp
await builder.Build().RunAsync();
\`\`\``,
                    },
                ],
                examples: [
                    {
                        language: 'typescript',
                        description: 'Complete TypeScript Server',
                        code: `import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Calculator",
  version: "1.0.0"
});

// Add tool
server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// Add resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: \`Hello, \${name}!\`
    }]
  })
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);`,
                    },
                ],
            },
        },
        {
            id: 'building-debugging-2',
            stageId: 'building-debugging',
            title: 'Building MCP Clients',
            objectives: [
                'Connect to MCP servers from client applications',
                'List and call tools programmatically',
                'Integrate with LLMs (OpenAI, Anthropic)',
                'Handle responses and errors',
            ],
            estimatedMinutes: 15,
            sequenceOrder: 2,
            relatedConcepts: ['client-implementation', 'llm-integration'],
            content: {
                sections: [
                    {
                        heading: 'Client Setup and Connection',
                        type: 'text',
                        body: `Building a client to interact with MCP servers:

## TypeScript Client
\`\`\`typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js"]
});

const client = new Client({
  name: "my-client",
  version: "1.0.0"
});

await client.connect(transport);
\`\`\`

## Python Client
\`\`\`python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="python",
    args=["server.py"]
)

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        # Client is ready!
\`\`\``,
                    },
                    {
                        heading: 'Tool Discovery and Execution',
                        type: 'text',
                        body: `## List Available Tools
\`\`\`typescript
// TypeScript
const tools = await client.listTools();
console.log("Available tools:", tools.tools);
\`\`\`

\`\`\`python
# Python
tools = await session.list_tools()
for tool in tools.tools:
    print(f"Tool: {tool.name} - {tool.description}")
\`\`\`

## Call a Tool
\`\`\`typescript
// TypeScript
const result = await client.callTool({
  name: "add",
  arguments: { a: 5, b: 3 }
});
console.log(result.content[0].text); // "8"
\`\`\`

\`\`\`python
# Python
result = await session.call_tool("add", arguments={"a": 5, "b": 3})
print(result.content[0].text)  # "8"
\`\`\``,
                    },
                    {
                        heading: 'LLM Integration',
                        type: 'text',
                        body: `Integrate MCP tools with your LLM:

## With Anthropic Claude
\`\`\`python
import anthropic

# Get MCP tools
mcp_tools = await session.list_tools()

# Convert to Claude format
claude_tools = [{
    "name": tool.name,
    "description": tool.description,
    "input_schema": tool.inputSchema
} for tool in mcp_tools.tools]

# Chat with tools
client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1000,
    tools=claude_tools,
    messages=[{"role": "user", "content": "What is 5 + 3?"}]
)

# If Claude wants to use a tool
if response.content[0].type == "tool_use":
    tool_name = response.content[0].name
    tool_args = response.content[0].input
    
    # Execute via MCP
    result = await session.call_tool(tool_name, tool_args)
\`\`\`

## With OpenAI
\`\`\`typescript
import OpenAI from "openai";

const openai = new OpenAI();

// Get MCP tools
const mcpTools = await client.listTools();

// Convert to OpenAI format
const openaiTools = mcpTools.tools.map(tool => ({
  type: "function",
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema
  }
}));

// Chat with tools
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "What is 5 + 3?" }],
  tools: openaiTools
});
\`\`\``,
                    },
                ],
            },
        },
        {
            id: 'building-debugging-3',
            stageId: 'building-debugging',
            title: 'Debugging MCP Applications',
            objectives: [
                'Use MCP Inspector for interactive testing',
                'Debug connection and transport issues',
                'Trace JSON-RPC message flow',
                'Diagnose common errors',
            ],
            estimatedMinutes: 15,
            sequenceOrder: 3,
            relatedConcepts: ['debugging', 'inspector', 'troubleshooting'],
            content: {
                sections: [
                    {
                        heading: 'Using MCP Inspector',
                        type: 'text',
                        body: `The **MCP Inspector** is your debugging best friend!

## Launch Inspector
\`\`\`bash
# TypeScript server
npx @modelcontextprotocol/inspector node build/index.js

# Python server
mcp dev server.py

# Or
npx @modelcontextprotocol/inspector mcp run server.py

# .NET server
npx @modelcontextprotocol/inspector dotnet run
\`\`\`

## What Inspector Shows
1. **Server Info** - Name, version, capabilities
2. **Tools** - All available tools with schemas
3. **Resources** - Available resources and templates
4. **Prompts** - Registered prompt templates
5. **Message Log** - Real-time JSON-RPC messages

## Interactive Testing
- ✅ **List capabilities** - See what the server offers
- ✅ **Call tools** - Test with different arguments
- ✅ **Read resources** - Verify resource content
- ✅ **Get prompts** - Test prompt templates
- ✅ **View messages** - Debug JSON-RPC flow`,
                    },
                    {
                        heading: 'Common Issues and Solutions',
                        type: 'text',
                        body: `## Issue: Server Won't Start
**Symptoms:** Process exits immediately or connection fails

**Solutions:**
- ✅ Check logs on stderr
- ✅ Verify dependencies are installed
- ✅ Ensure correct Node/Python version
- ✅ Check file permissions

## Issue: Tools Not Appearing
**Symptoms:** \`tools/list\` returns empty array

**Solutions:**
- ✅ Verify tools are registered before \`connect()\`
- ✅ Check for registration errors in logs
- ✅ Ensure tools are exported/public
- ✅ Verify capabilities declared in initialize

## Issue: Tool Calls Fail
**Symptoms:** Error -32602 "Invalid params"

**Solutions:**
- ✅ Check argument names match schema exactly
- ✅ Verify argument types (number vs string)
- ✅ Ensure required arguments are provided
- ✅ Validate against inputSchema

## Issue: Connection Timeout
**Symptoms:** Client hangs on connect

**Solutions:**
- ✅ Check server is actually running
- ✅ Verify correct transport (stdio vs HTTP)
- ✅ Check firewall rules (for HTTP)
- ✅ Ensure server completes initialization handshake`,
                    },
                    {
                        heading: 'Logging Best Practices',
                        type: 'text',
                        body: `## Server-Side Logging
Always log to **stderr**, never stdout (which is used for JSON-RPC):

\`\`\`typescript
// TypeScript
console.error("Server starting...");
console.error(\`Tool called: \${name}\`);
\`\`\`

\`\`\`python
# Python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
logger.info("Server starting...")
\`\`\`

\`\`\`csharp
// C#
builder.Logging.AddConsole(options =>
{
    options.LogToStandardErrorThreshold = LogLevel.Trace;
});
\`\`\`

## What to Log
- ✅ Server lifecycle (start, stop, errors)
- ✅ Tool executions (name, arguments)
- ✅ Resource accesses
- ✅ Errors with stack traces
- ❌ Never log sensitive data
- ❌ Don't log every JSON-RPC message (use Inspector)`,
                    },
                ],
            },
        },
        {
            id: 'building-debugging-4',
            stageId: 'building-debugging',
            title: 'Testing and Deployment',
            objectives: [
                'Write unit tests for MCP servers',
                'Test client-server integration',
                'Deploy to production environments',
                'Monitor server health',
            ],
            estimatedMinutes: 10,
            sequenceOrder: 4,
            relatedConcepts: ['testing', 'deployment', 'monitoring'],
            content: {
                sections: [
                    {
                        heading: 'Testing MCP Servers',
                        type: 'text',
                        body: `## Unit Testing Tools

**TypeScript (Vitest):**
\`\`\`typescript
import { describe, it, expect } from 'vitest';
import { testServer } from './test-utils';

describe('Calculator Server', () => {
  it('should add two numbers', async () => {
    const server = await testServer();
    const result = await server.callTool('add', { a: 5, b: 3 });
    expect(result.content[0].text).toBe('8');
  });
});
\`\`\`

**Python (pytest):**
\`\`\`python
import pytest
from mcp.server.fastmcp import FastMCP

@pytest.mark.asyncio
async def test_add_tool():
    mcp = FastMCP("Calculator")
    
    @mcp.tool()
    def add(a: int, b: int) -> int:
        return a + b
    
    result = await mcp.call_tool("add", {"a": 5, "b": 3})
    assert result == 8
\`\`\`

## Integration Testing
Test complete client-server flows:
\`\`\`python
async def test_client_server_integration():
    # Start server
    server_process = await start_server()
    
    # Connect client
    async with create_client() as session:
        await session.initialize()
        
        # Test tool discovery
        tools = await session.list_tools()
        assert len(tools.tools) > 0
        
        # Test tool execution
        result = await session.call_tool("add", {"a": 5, "b": 3})
        assert result.content[0].text == "8"
    
    # Cleanup
    server_process.terminate()
\`\`\``,
                    },
                    {
                        heading: 'Deployment Strategies',
                        type: 'text',
                        body: `## stdio Servers (Desktop Apps)
Package server as executable:
\`\`\`bash
# TypeScript
npm run build
pkg build/index.js --targets node18-macos-x64

# Python
pyinstaller --onefile server.py
\`\`\`

Configure in client:
\`\`\`json
{
  "servers": {
    "calculator": {
      "command": "/path/to/calculator-server",
      "args": []
    }
  }
}
\`\`\`

## HTTP/SSE Servers (Cloud)
Deploy to cloud platforms:

**Docker:**
\`\`\`dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "build/server.js"]
\`\`\`

**Fly.io / Railway / Render:**
- Push to GitHub
- Connect repository
- Configure build command
- Set environment variables
- Deploy!

## Health Checks
Add health endpoint:
\`\`\`typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
\`\`\`

## Monitoring
- 📊 Track tool execution times
- 🚨 Alert on high error rates
- 📈 Monitor connection counts
- 💾 Log aggregation (Datadog, CloudWatch)`,
                    },
                ],
            },
        },
    ],
    quiz: {
        id: 'quiz-building-debugging',
        stageId: 'building-debugging',
        passingThreshold: 0.7,
        questions: [
            {
                id: 'q1',
                prompt: 'What package is required to build MCP servers in TypeScript?',
                difficulty: 'easy',
                conceptTag: 'server-implementation',
                correctAnswerId: 'q1-a',
                rationale:
                    'The @modelcontextprotocol/sdk package provides the core MCP server and client implementations for TypeScript/Node.js applications.',
                options: [
                    {
                        id: 'q1-a',
                        text: '@modelcontextprotocol/sdk',
                        isCorrect: true,
                    },
                    { id: 'q1-b', text: '@mcp/server', isCorrect: false },
                    { id: 'q1-c', text: 'express', isCorrect: false },
                    { id: 'q1-d', text: 'fastify', isCorrect: false },
                ],
            },
            {
                id: 'q2',
                prompt: 'Where should server-side logs be written in stdio transport?',
                difficulty: 'medium',
                conceptTag: 'debugging',
                correctAnswerId: 'q2-b',
                rationale:
                    'In stdio transport, stdout is reserved for JSON-RPC messages. All logging must go to stderr to avoid interfering with the protocol communication.',
                options: [
                    { id: 'q2-a', text: 'stdout', isCorrect: false },
                    { id: 'q2-b', text: 'stderr', isCorrect: true },
                    { id: 'q2-c', text: 'A log file', isCorrect: false },
                    { id: 'q2-d', text: 'It doesn\'t matter', isCorrect: false },
                ],
            },
            {
                id: 'q3',
                prompt: 'What tool is recommended for interactive MCP server testing?',
                difficulty: 'easy',
                conceptTag: 'inspector',
                correctAnswerId: 'q3-c',
                rationale:
                    'MCP Inspector (@modelcontextprotocol/inspector) is the official tool for interactively testing MCP servers, viewing capabilities, calling tools, and debugging JSON-RPC messages.',
                options: [
                    { id: 'q3-a', text: 'Postman', isCorrect: false },
                    { id: 'q3-b', text: 'curl', isCorrect: false },
                    { id: 'q3-c', text: 'MCP Inspector', isCorrect: true },
                    { id: 'q3-d', text: 'Chrome DevTools', isCorrect: false },
                ],
            },
            {
                id: 'q4',
                prompt: 'What does JSON-RPC error code -32602 indicate?',
                difficulty: 'medium',
                conceptTag: 'troubleshooting',
                correctAnswerId: 'q4-b',
                rationale:
                    'Error code -32602 means "Invalid params" - the parameters provided don\'t match the method\'s schema. Check argument names, types, and required fields.',
                options: [
                    { id: 'q4-a', text: 'Server not found', isCorrect: false },
                    { id: 'q4-b', text: 'Invalid parameters', isCorrect: true },
                    { id: 'q4-c', text: 'Method not found', isCorrect: false },
                    { id: 'q4-d', text: 'Timeout', isCorrect: false },
                ],
            },
            {
                id: 'q5',
                prompt: 'How do you integrate MCP tools with Claude?',
                difficulty: 'medium',
                conceptTag: 'llm-integration',
                correctAnswerId: 'q5-a',
                rationale:
                    'You convert MCP tool schemas to Claude\'s tool format and pass them in the "tools" parameter. Claude can then request tool execution, which you fulfill via MCP.',
                options: [
                    {
                        id: 'q5-a',
                        text: 'Convert MCP schemas to Claude tool format and pass in tools parameter',
                        isCorrect: true,
                    },
                    {
                        id: 'q5-b',
                        text: 'Claude automatically discovers MCP servers',
                        isCorrect: false,
                    },
                    {
                        id: 'q5-c',
                        text: 'Use a special Claude MCP plugin',
                        isCorrect: false,
                    },
                    {
                        id: 'q5-d',
                        text: 'MCP and Claude are incompatible',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q6',
                prompt: 'What should you test in MCP integration tests?',
                difficulty: 'hard',
                conceptTag: 'testing',
                correctAnswerId: 'q6-c',
                rationale:
                    'Integration tests should cover the complete client-server workflow: initialization handshake, capability negotiation, tool discovery, tool execution, and proper cleanup.',
                options: [
                    { id: 'q6-a', text: 'Only individual tool functions', isCorrect: false },
                    { id: 'q6-b', text: 'Only the network connection', isCorrect: false },
                    {
                        id: 'q6-c',
                        text: 'Complete client-server flows including initialization and tool calls',
                        isCorrect: true,
                    },
                    { id: 'q6-d', text: 'Only error cases', isCorrect: false },
                ],
            },
            {
                id: 'q7',
                prompt: 'What is the recommended deployment strategy for HTTP-based MCP servers?',
                difficulty: 'medium',
                conceptTag: 'deployment',
                correctAnswerId: 'q7-b',
                rationale:
                    'HTTP-based MCP servers should be containerized (Docker) and deployed to cloud platforms with proper security (HTTPS, authentication, health checks) for production use.',
                options: [
                    {
                        id: 'q7-a',
                        text: 'Run directly on localhost with no authentication',
                        isCorrect: false,
                    },
                    {
                        id: 'q7-b',
                        text: 'Containerize and deploy to cloud with HTTPS and authentication',
                        isCorrect: true,
                    },
                    {
                        id: 'q7-c',
                        text: 'Use stdio transport in the cloud',
                        isCorrect: false,
                    },
                    {
                        id: 'q7-d',
                        text: 'Deployment is not recommended',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q8',
                prompt: 'Why should you never log JSON-RPC messages to stdout in stdio servers?',
                difficulty: 'hard',
                conceptTag: 'debugging',
                correctAnswerId: 'q8-a',
                rationale:
                    'In stdio transport, stdout is the communication channel for JSON-RPC messages between client and server. Logging to stdout would corrupt the message stream and break the protocol.',
                options: [
                    {
                        id: 'q8-a',
                        text: 'stdout is used for JSON-RPC communication, logs would break the protocol',
                        isCorrect: true,
                    },
                    {
                        id: 'q8-b',
                        text: 'It makes the logs too large',
                        isCorrect: false,
                    },
                    {
                        id: 'q8-c',
                        text: 'stdout is read-only',
                        isCorrect: false,
                    },
                    {
                        id: 'q8-d',
                        text: 'There is no reason, it\'s fine to log to stdout',
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
}
