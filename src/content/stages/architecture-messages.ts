/**
 * Stage 2: Architecture & Messages
 * Deep dive into MCP architecture and JSON-RPC messaging
 */

import type { Stage } from '@/types'

export const architectureMessagesStage: Stage = {
    id: 'architecture-messages',
    name: 'Architecture & Messages',
    description:
        'Master the MCP architecture components, session lifecycle, and JSON-RPC message patterns for building robust client-server integrations.',
    objectives: [
        'Understand MCP session initialization and lifecycle',
        'Learn JSON-RPC request, response, and notification patterns',
        'Master tool discovery and execution workflows',
        'Implement resource listing and reading patterns',
        'Handle errors and edge cases gracefully',
    ],
    estimatedMinutes: 50,
    sequenceOrder: 2,
    prerequisites: ['foundations'],
    concepts: [
        'session-management',
        'json-rpc',
        'tool-discovery',
        'resource-management',
        'error-handling',
    ],
    modules: [
        {
            id: 'architecture-messages-1',
            stageId: 'architecture-messages',
            title: 'Session Lifecycle & Initialization',
            objectives: [
                'Understand the initialization handshake',
                'Learn capability negotiation',
                'Manage session state properly',
                'Handle session termination',
            ],
            estimatedMinutes: 15,
            sequenceOrder: 1,
            relatedConcepts: ['session-management', 'initialization', 'capabilities'],
            content: {
                sections: [
                    {
                        heading: 'MCP Session Initialization Flow',
                        type: 'text',
                        body: `Every MCP connection follows a **strict initialization sequence**:

## 1. Connection Establishment
The client establishes a connection using one of the supported transports:
- **stdio**: Launch server as subprocess
- **SSE**: Open HTTP connection for event stream
- **HTTP**: Establish HTTP streaming connection

## 2. Initialize Request (Client → Server)
The client sends an \`initialize\` request containing:
- **Protocol version** - Which MCP version to use (e.g., "2025-06-18")
- **Client capabilities** - Features the client supports (elicitation, sampling, etc.)
- **Client info** - Name and version of the client application

## 3. Initialize Response (Server → Client)
The server responds with:
- **Protocol version** - Confirms the version (must match or be compatible)
- **Server capabilities** - Features the server offers (tools, resources, prompts)
- **Server info** - Name and version of the server

## 4. Initialized Notification (Client → Server)
The client sends an \`initialized\` notification to confirm the handshake is complete.

## 5. Active Session
Once initialized, the client and server can exchange messages freely:
- Client requests (list tools, call tools, read resources)
- Server requests (sampling, elicitation)
- Notifications (tool list changed, resource updated)

## 6. Session Termination
The session ends when:
- Client closes the transport connection
- Server process terminates
- Network connection is lost`,
                    },
                    {
                        heading: 'Capability Negotiation',
                        type: 'text',
                        body: `During initialization, both sides declare their **capabilities**:

## Client Capabilities
Clients can support:
- **elicitation** - Can prompt user for additional input
- **sampling** - Can request LLM completions from server
- **roots** - Can provide workspace roots to server

## Server Capabilities
Servers can offer:
- **tools** - Functions the LLM can call
  - \`listChanged\`: Server will notify when tool list updates
- **resources** - Data sources to read
  - \`subscribe\`: Supports resource change subscriptions
  - \`listChanged\`: Notifies when resource list changes
- **prompts** - Pre-defined prompt templates
  - \`listChanged\`: Notifies when prompt list changes
- **logging** - Can send log messages to client

Only features declared as capabilities can be used during the session!`,
                    },
                ],
                examples: [
                    {
                        language: 'mermaid',
                        description: 'Complete Session Lifecycle',
                        code: `sequenceDiagram
    participant Host
    participant Client
    participant Server

    Host->>+Client: Initialize client
    Client->>+Server: Initialize session with capabilities
    Server-->>Client: Respond with supported capabilities

    Note over Host,Server: Active Session with Negotiated Features

    loop Client Requests
        Host->>Client: User- or model-initiated action
        Client->>Server: Request (tools/resources)
        Server-->>Client: Response
        Client-->>Host: Update UI or respond to model
    end

    loop Server Requests
        Server->>Client: Request (sampling)
        Client->>Host: Forward to AI
        Host-->>Client: AI response
        Client-->>Server: Response
    end

    loop Notifications
        Server--)Client: Resource updates
        Client--)Server: Status changes
    end

    Host->>Client: Terminate
    Client->>-Server: End session
    deactivate Server`,
                    },
                    {
                        language: 'typescript',
                        description: 'TypeScript Client Initialization',
                        code: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js"]
});

const client = new Client({
  name: "example-client",
  version: "1.0.0"
});

// Connect and initialize
await client.connect(transport);
console.log("Connected to MCP server!");`,
                    },
                ],
            },
        },
        {
            id: 'architecture-messages-2',
            stageId: 'architecture-messages',
            title: 'JSON-RPC Message Patterns',
            objectives: [
                'Understand JSON-RPC 2.0 structure',
                'Distinguish requests, responses, and notifications',
                'Handle message IDs correctly',
                'Implement error responses',
            ],
            estimatedMinutes: 12,
            sequenceOrder: 2,
            relatedConcepts: ['json-rpc', 'messaging', 'error-handling'],
            content: {
                sections: [
                    {
                        heading: 'JSON-RPC 2.0 Message Types',
                        type: 'text',
                        body: `MCP uses **JSON-RPC 2.0** for all communication. There are three message types:

## 1. Request
A message that **expects a response**:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,              // Required for requests
  "method": "tools/list",
  "params": {}          // Optional
}
\`\`\`

**Key properties:**
- \`id\` must be present (number or string)
- \`method\` identifies the operation
- \`params\` contains method-specific arguments

## 2. Response
A message **sent in reply to a request**:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,              // Matches request ID
  "result": {           // Either result...
    "tools": [...]
  }
}
\`\`\`

OR (for errors):
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {            // ...or error
    "code": -32602,
    "message": "Invalid params"
  }
}
\`\`\`

## 3. Notification
A message that **does not expect a response**:
\`\`\`json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
  // No id field!
}
\`\`\`

**Key difference:** Notifications have **no \`id\` field** - the receiver never sends a response.`,
                    },
                    {
                        heading: 'Error Handling',
                        type: 'text',
                        body: `JSON-RPC defines **standard error codes**:

| Code | Meaning | When to Use |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON received |
| -32600 | Invalid request | Missing required fields |
| -32601 | Method not found | Unknown method name |
| -32602 | Invalid params | Bad parameter values |
| -32603 | Internal error | Server-side failure |

**Custom errors** use codes from -32000 to -32099.

Example error response:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32602,
    "message": "Unknown tool: invalid_tool_name"
  }
}
\`\`\``,
                    },
                ],
                examples: [
                    {
                        language: 'json',
                        description: 'Complete Request-Response Example',
                        code: `// REQUEST: List available tools
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}

// RESPONSE: Return tool list
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "calculator_arithmetic",
        "description": "Evaluate mathematical expressions",
        "inputSchema": {
          "type": "object",
          "properties": {
            "expression": { "type": "string" }
          },
          "required": ["expression"]
        }
      }
    ]
  }
}`,
                    },
                ],
            },
        },
        {
            id: 'architecture-messages-3',
            stageId: 'architecture-messages',
            title: 'Tool Discovery & Execution',
            objectives: [
                'List available tools from a server',
                'Understand tool schemas and parameters',
                'Call tools with proper arguments',
                'Handle tool execution results',
            ],
            estimatedMinutes: 13,
            sequenceOrder: 3,
            relatedConcepts: ['tool-discovery', 'tools', 'function-calling'],
            content: {
                sections: [
                    {
                        heading: 'Tool Discovery Workflow',
                        type: 'text',
                        body: `The **tool discovery pattern** enables dynamic capability detection:

## Step 1: List Tools (Client → Server)
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "cursor": "optional-pagination-cursor"
  }
}
\`\`\`

## Step 2: Receive Tool Definitions (Server → Client)
The server returns all available tools with their schemas:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "weather_current",
        "title": "Weather Information",
        "description": "Get current weather for any location",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": { "type": "string" },
            "units": {
              "type": "string",
              "enum": ["metric", "imperial"],
              "default": "metric"
            }
          },
          "required": ["location"]
        }
      }
    ]
  }
}
\`\`\`

## Step 3: Register with LLM
The client converts tool schemas to the LLM's expected format (e.g., OpenAI function calling, Anthropic tools).

## Step 4: LLM Selects Tool
When the LLM decides to use a tool, it returns a tool call request.

## Step 5: Execute Tool (Client → Server)
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "weather_current",
    "arguments": {
      "location": "San Francisco",
      "units": "imperial"
    }
  }
}
\`\`\`

## Step 6: Return Results (Server → Client)
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in San Francisco: 68°F, partly cloudy"
      }
    ]
  }
}
\`\`\``,
                    },
                    {
                        heading: 'Dynamic Tool Updates',
                        type: 'text',
                        body: `Servers can **notify clients** when their tool list changes:

\`\`\`json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
\`\`\`

When the client receives this notification, it should:
1. Re-fetch the tool list with \`tools/list\`
2. Update the LLM's available functions
3. Notify the user if currently in a conversation`,
                    },
                ],
                examples: [
                    {
                        language: 'python',
                        description: 'Python Client Tool Discovery',
                        code: `# List available tools
tools = await session.list_tools()
print("LISTING TOOLS")
for tool in tools.tools:
    print(f"Tool: {tool.name}")
    print(f"Description: {tool.description}")

# Call a specific tool
result = await session.call_tool(
    "weather_current",
    arguments={"location": "San Francisco", "units": "imperial"}
)
print(result.content[0].text)`,
                    },
                ],
            },
        },
        {
            id: 'architecture-messages-4',
            stageId: 'architecture-messages',
            title: 'Resource Management',
            objectives: [
                'List available resources and templates',
                'Read resource contents',
                'Subscribe to resource updates',
                'Handle resource URIs properly',
            ],
            estimatedMinutes: 10,
            sequenceOrder: 4,
            relatedConcepts: ['resource-management', 'resources', 'subscriptions'],
            content: {
                sections: [
                    {
                        heading: 'Resource Discovery & Access',
                        type: 'text',
                        body: `Resources provide **context data** to the LLM. The workflow is:

## Step 1: List Resources
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list"
}
\`\`\`

Response includes available resources and templates:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resources": [
      {
        "uri": "file:///project/README.md",
        "name": "README.md",
        "mimeType": "text/markdown"
      }
    ],
    "resourceTemplates": [
      {
        "uriTemplate": "file:///{path}",
        "name": "Project Files",
        "mimeType": "application/octet-stream"
      }
    ]
  }
}
\`\`\`

## Step 2: Read Resource Contents
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "file:///project/README.md"
  }
}
\`\`\`

Response with content:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "contents": [
      {
        "uri": "file:///project/README.md",
        "mimeType": "text/markdown",
        "text": "# My Project\\n\\nDocumentation..."
      }
    ]
  }
}
\`\`\`

## Resource Templates
Templates use **URI patterns** for dynamic resources:
- \`file:///{path}\` - Any file path
- \`db:///{table}\` - Database tables
- \`api:///{endpoint}\` - API endpoints

The client substitutes parameters when reading.`,
                    },
                    {
                        heading: 'Resource Subscriptions',
                        type: 'text',
                        body: `Clients can **subscribe** to resource changes:

\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/subscribe",
  "params": {
    "uri": "file:///project/src/main.rs"
  }
}
\`\`\`

When the resource changes, the server sends a notification:
\`\`\`json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "file:///project/src/main.rs"
  }
}
\`\`\`

The client should then re-read the resource to get updated content.`,
                    },
                ],
            },
        },
    ],
    quiz: {
        id: 'quiz-architecture-messages',
        stageId: 'architecture-messages',
        passingThreshold: 0.7,
        questions: [
            {
                id: 'q1',
                prompt: 'What is the correct order of MCP session initialization?',
                difficulty: 'medium',
                conceptTag: 'session-management',
                correctAnswerId: 'q1-b',
                rationale:
                    'The correct sequence is: 1) Client sends initialize request, 2) Server responds with capabilities, 3) Client sends initialized notification to confirm. This three-step handshake establishes the session.',
                options: [
                    {
                        id: 'q1-a',
                        text: 'Server initialize → Client response → Start session',
                        isCorrect: false,
                    },
                    {
                        id: 'q1-b',
                        text: 'Client initialize → Server response → Client initialized notification',
                        isCorrect: true,
                    },
                    {
                        id: 'q1-c',
                        text: 'Client connect → Server connect → Exchange messages',
                        isCorrect: false,
                    },
                    {
                        id: 'q1-d',
                        text: 'Capability exchange → Authentication → Session start',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q2',
                prompt: 'Which JSON-RPC message type does NOT expect a response?',
                difficulty: 'easy',
                conceptTag: 'json-rpc',
                correctAnswerId: 'q2-c',
                rationale:
                    'Notifications do not expect a response and do not have an "id" field. They are one-way messages used for events like tool list changes or resource updates.',
                options: [
                    { id: 'q2-a', text: 'Request', isCorrect: false },
                    { id: 'q2-b', text: 'Response', isCorrect: false },
                    { id: 'q2-c', text: 'Notification', isCorrect: true },
                    { id: 'q2-d', text: 'Error', isCorrect: false },
                ],
            },
            {
                id: 'q3',
                prompt: 'What method is used to discover available tools from an MCP server?',
                difficulty: 'easy',
                conceptTag: 'tool-discovery',
                correctAnswerId: 'q3-b',
                rationale:
                    'The "tools/list" method is the standard way to discover all available tools from an MCP server. The server responds with tool definitions including names, descriptions, and input schemas.',
                options: [
                    { id: 'q3-a', text: 'tools/get', isCorrect: false },
                    { id: 'q3-b', text: 'tools/list', isCorrect: true },
                    { id: 'q3-c', text: 'tools/discover', isCorrect: false },
                    { id: 'q3-d', text: 'server/capabilities', isCorrect: false },
                ],
            },
            {
                id: 'q4',
                prompt:
                    'What field distinguishes a JSON-RPC request from a notification?',
                difficulty: 'medium',
                conceptTag: 'json-rpc',
                correctAnswerId: 'q4-a',
                rationale:
                    'The "id" field is the key difference. Requests have an "id" field and expect a response with the same ID. Notifications lack an "id" field and never receive a response.',
                options: [
                    {
                        id: 'q4-a',
                        text: 'The presence of an "id" field',
                        isCorrect: true,
                    },
                    { id: 'q4-b', text: 'The "method" field value', isCorrect: false },
                    { id: 'q4-c', text: 'The "jsonrpc" version', isCorrect: false },
                    { id: 'q4-d', text: 'The "params" structure', isCorrect: false },
                ],
            },
            {
                id: 'q5',
                prompt: 'How does a server notify clients that its tool list has changed?',
                difficulty: 'medium',
                conceptTag: 'tool-discovery',
                correctAnswerId: 'q5-c',
                rationale:
                    'Servers send a "notifications/tools/list_changed" notification (without an id field) to inform clients. Clients should then re-fetch the tool list using "tools/list".',
                options: [
                    { id: 'q5-a', text: 'Send a new tools/list response', isCorrect: false },
                    {
                        id: 'q5-b',
                        text: 'Restart the server and reinitialize',
                        isCorrect: false,
                    },
                    {
                        id: 'q5-c',
                        text: 'Send a notifications/tools/list_changed message',
                        isCorrect: true,
                    },
                    {
                        id: 'q5-d',
                        text: 'Update the initialize response retroactively',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q6',
                prompt: 'What is a resource template in MCP?',
                difficulty: 'medium',
                conceptTag: 'resource-management',
                correctAnswerId: 'q6-b',
                rationale:
                    'Resource templates use URI patterns (like "file:///{path}") to represent dynamic resources. The client substitutes parameters when reading, enabling flexible access to many similar resources.',
                options: [
                    { id: 'q6-a', text: 'A pre-formatted prompt for the LLM', isCorrect: false },
                    {
                        id: 'q6-b',
                        text: 'A URI pattern for accessing dynamic resources',
                        isCorrect: true,
                    },
                    { id: 'q6-c', text: 'A tool with predefined arguments', isCorrect: false },
                    {
                        id: 'q6-d',
                        text: 'A server configuration file',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q7',
                prompt:
                    'Which capability must a server declare to support resource subscriptions?',
                difficulty: 'hard',
                conceptTag: 'resource-management',
                correctAnswerId: 'q7-c',
                rationale:
                    'Servers must declare "resources.subscribe: true" in their capabilities during initialization to support resource subscriptions. This tells clients they can subscribe to resource changes.',
                options: [
                    { id: 'q7-a', text: 'tools.listChanged', isCorrect: false },
                    { id: 'q7-b', text: 'prompts.subscribe', isCorrect: false },
                    { id: 'q7-c', text: 'resources.subscribe', isCorrect: true },
                    { id: 'q7-d', text: 'notifications.enabled', isCorrect: false },
                ],
            },
            {
                id: 'q8',
                prompt: 'What is the standard JSON-RPC error code for "Method not found"?',
                difficulty: 'hard',
                conceptTag: 'error-handling',
                correctAnswerId: 'q8-b',
                rationale:
                    'Error code -32601 is the standard JSON-RPC 2.0 code for "Method not found", used when a client calls a method that the server does not implement.',
                options: [
                    { id: 'q8-a', text: '-32600', isCorrect: false },
                    { id: 'q8-b', text: '-32601', isCorrect: true },
                    { id: 'q8-c', text: '-32602', isCorrect: false },
                    { id: 'q8-d', text: '-32603', isCorrect: false },
                ],
            },
        ],
    },
}
