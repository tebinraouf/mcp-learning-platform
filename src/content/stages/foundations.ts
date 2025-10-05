/**
 * Stage 1: MCP Foundations
 * Introduction to Model Context Protocol fundamentals
 */

import type { Stage } from '@/types'

export const foundationsStage: Stage = {
    id: 'foundations',
    name: 'MCP Foundations',
    description:
        'Learn the core concepts and architecture of the Model Context Protocol (MCP), understanding how it enables standardized communication between AI applications and data sources.',
    objectives: [
        'Understand what MCP is and its purpose in the AI ecosystem',
        'Learn the client-server architecture pattern of MCP',
        'Grasp the three core primitives: Resources, Prompts, and Tools',
        'Understand JSON-RPC 2.0 as the messaging protocol',
        'Learn about transports (stdio, SSE, HTTP streaming)',
    ],
    estimatedMinutes: 45,
    sequenceOrder: 1,
    prerequisites: [],
    concepts: ['protocol-basics', 'client-server', 'json-rpc', 'primitives', 'transports'],
    modules: [
        {
            id: 'foundations-1',
            stageId: 'foundations',
            title: 'What is the Model Context Protocol?',
            objectives: [
                'Define MCP and understand its role',
                'Learn how MCP standardizes AI-to-data connections',
                'Understand the analogy to USB-C for AI',
            ],
            estimatedMinutes: 10,
            sequenceOrder: 1,
            relatedConcepts: ['protocol-basics', 'client-server'],
            content: {
                sections: [
                    {
                        heading: 'Introduction to MCP',
                        type: 'text',
                        body: `The **Model Context Protocol (MCP)** is an **open protocol** that standardizes how applications provide context to Large Language Models (LLMs). Think of it as a **USB-C port for AI applications** – just as USB-C standardized device connections, MCP standardizes how AI models connect to diverse data sources and tools.

## Why MCP Matters

Before MCP, every integration between an AI application and a data source required custom code:
- 🔌 **Fragmentation**: Each AI app built its own integrations
- 🔒 **Vendor Lock-in**: Solutions were tightly coupled to specific platforms  
- 🐌 **Slow Innovation**: Building integrations was time-consuming

MCP solves this by providing a **standardized way** for:
- AI applications to **discover capabilities**
- LLMs to **access context from multiple sources**
- Developers to **build once, use everywhere**

## Key Benefits

✅ **Interoperability** - One integration works across multiple AI applications  
✅ **Composability** - Mix and match data sources and tools  
✅ **Security** - Standardized access controls and permissions  
✅ **Extensibility** - Easy to add new capabilities without changing core code`,
                    },
                    {
                        heading: 'Real-World Analogy',
                        type: 'example',
                        body: `Imagine you're building a smart home system. Without MCP, you'd need:
- Custom code for each smart device brand
- Different APIs for lights, thermostats, cameras
- Separate SDKs for voice assistants

With MCP, you have:
- **One protocol** to connect all devices
- **Standardized discovery** of device capabilities  
- **Unified interface** for AI agents to control everything

This is exactly how MCP works for AI applications and data sources!`,
                    },
                ],
                examples: [
                    {
                        language: 'mermaid',
                        description: 'MCP Architecture Overview',
                        code: `graph TB
    subgraph "MCP Host (AI Application)"
        Client1["MCP Client 1"]
        Client2["MCP Client 2"]
        Client3["MCP Client 3"]
    end

    Server1["MCP Server 1<br/>(e.g., Database)"]
    Server2["MCP Server 2<br/>(e.g., Files)"]
    Server3["MCP Server 3<br/>(e.g., APIs)"]

    Client1 ---|"One-to-one<br/>connection"| Server1
    Client2 ---|"One-to-one<br/>connection"| Server2
    Client3 ---|"One-to-one<br/>connection"| Server3`,
                    },
                ],
            },
        },
        {
            id: 'foundations-2',
            stageId: 'foundations',
            title: 'Client-Server Architecture',
            objectives: [
                'Understand the MCP client role and responsibilities',
                'Learn about MCP servers and their capabilities',
                'Grasp the one-to-one connection pattern',
            ],
            estimatedMinutes: 12,
            sequenceOrder: 2,
            relatedConcepts: ['client-server', 'architecture', 'session-management'],
            content: {
                sections: [
                    {
                        heading: 'MCP Architecture Pattern',
                        type: 'text',
                        body: `MCP follows a **client-server architecture** where:

## MCP Clients
The **client** (also called MCP Host) is typically an **AI application** that:
- 🎯 **Connects to multiple servers** - One client can manage connections to many servers
- 🔍 **Discovers capabilities** - Queries servers for available resources, tools, and prompts
- 🤖 **Integrates with LLMs** - Provides context to language models
- 📡 **Manages communication** - Handles JSON-RPC message exchange

Examples: Claude Desktop, VS Code Copilot, custom AI agents

## MCP Servers
The **server** is a **data source or tool provider** that:
- 📚 **Exposes resources** - Files, databases, APIs, documentation
- 🛠️ **Provides tools** - Functions the LLM can call (e.g., search, calculate)
- 💬 **Offers prompts** - Pre-defined templates for LLM interactions
- 🔐 **Controls access** - Manages permissions and security

Examples: File system server, database connector, web search server

## Connection Pattern
Each **client-server pair maintains a one-to-one connection**:
- Clients can connect to **multiple servers simultaneously**
- Each connection is **independent** with its own lifecycle
- Servers can serve **multiple clients** (but each connection is isolated)`,
                    },
                    {
                        heading: 'Capability Negotiation',
                        type: 'text',
                        body: `When a client connects to a server, they **negotiate capabilities** through an initialization handshake:

1. **Client sends Initialize Request** with its capabilities
2. **Server responds** with its supported features
3. **Client sends Initialized Notification** to finalize
4. **Session begins** with agreed-upon features

This ensures both sides know what operations are supported.`,
                    },
                ],
                examples: [
                    {
                        language: 'json',
                        description: 'MCP Initialization Request',
                        code: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "elicitation": {}
    },
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}`,
                    },
                    {
                        language: 'json',
                        description: 'MCP Initialization Response',
                        code: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {}
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    }
  }
}`,
                    },
                ],
            },
        },
        {
            id: 'foundations-3',
            stageId: 'foundations',
            title: 'Core Primitives: Resources, Prompts, Tools',
            objectives: [
                'Understand Resources and their use cases',
                'Learn about Prompts and templating',
                'Grasp Tools and function calling',
                'Distinguish between the three primitives',
            ],
            estimatedMinutes: 15,
            sequenceOrder: 3,
            relatedConcepts: ['primitives', 'resources', 'prompts', 'tools'],
            content: {
                sections: [
                    {
                        heading: 'MCP Primitives Overview',
                        type: 'text',
                        body: `MCP defines three core primitives that servers expose to clients:

## 1. Resources 📚
**Resources** are **data sources** that the LLM can read for context:
- 📄 **Files** - Read file contents from a file system
- 🗄️ **Database records** - Query data from databases
- 🌐 **API responses** - Fetch data from external services
- 📝 **Documents** - Access knowledge base articles

**Key Characteristics:**
- URI-based addressing (e.g., \`file:///path/to/file.txt\`)
- Support for templates (e.g., \`file:///{path}\` for dynamic paths)
- Can be text, binary, or structured data
- Support subscriptions for real-time updates

## 2. Prompts 💬
**Prompts** are **reusable templates** for LLM interactions:
- 🎯 **Structured messages** - Pre-defined conversation starters
- 🔧 **Parameterized** - Accept arguments for customization
- 📋 **Best practices** - Encode expert prompting strategies
- 🔄 **Consistency** - Ensure repeatable LLM behavior

**Example Use Cases:**
- Code review templates
- Customer support responses  
- Data analysis workflows
- Document summarization patterns

## 3. Tools 🛠️
**Tools** are **functions** the LLM can **call** to take actions:
- 🔍 **Search** - Web search, database queries
- 📊 **Compute** - Calculations, data transformations
- ✍️ **Write** - File modifications, database updates
- 🌐 **Integrate** - API calls, external service interactions

**Key Characteristics:**
- JSON Schema-based parameter definitions
- Synchronous execution model
- Return structured or unstructured results
- Support for error reporting`,
                    },
                ],
                examples: [
                    {
                        language: 'json',
                        description: 'Example Resource (File)',
                        code: `{
  "uri": "file:///project/README.md",
  "name": "README.md",
  "title": "Project Documentation",
  "mimeType": "text/markdown",
  "text": "# My Project\n\nThis is the project documentation..."
}`,
                    },
                    {
                        language: 'json',
                        description: 'Example Prompt (Code Review)',
                        code: `{
  "name": "code_review",
  "description": "Code review prompt",
  "arguments": {
    "code": "def hello():\n    print('world')"
  },
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Please review this Python code:\ndef hello():\n    print('world')"
      }
    }
  ]
}`,
                    },
                    {
                        language: 'json',
                        description: 'Example Tool (Calculator)',
                        code: `{
  "name": "calculator_arithmetic",
  "title": "Calculator",
  "description": "Evaluate mathematical expressions",
  "inputSchema": {
    "type": "object",
    "properties": {
      "expression": {
        "type": "string",
        "description": "Mathematical expression (e.g., '2 + 3 * 4')"
      }
    },
    "required": ["expression"]
  }
}`,
                    },
                ],
            },
        },
        {
            id: 'foundations-4',
            stageId: 'foundations',
            title: 'Transports: stdio, SSE, HTTP Streaming',
            objectives: [
                'Understand stdio transport for local processes',
                'Learn Server-Sent Events (SSE) for web applications',
                'Grasp HTTP streaming for modern APIs',
                'Choose the right transport for your use case',
            ],
            estimatedMinutes: 8,
            sequenceOrder: 4,
            relatedConcepts: ['transports', 'stdio', 'sse', 'http-streaming'],
            content: {
                sections: [
                    {
                        heading: 'MCP Transport Mechanisms',
                        type: 'text',
                        body: `MCP supports multiple **transport mechanisms** for client-server communication:

## 1. stdio (Standard Input/Output)
**Best for:** Local development, desktop applications, subprocess servers

**How it works:**
- Client launches server as a **subprocess**
- Messages exchanged via **stdin/stdout**
- Logs go to **stderr**
- Server terminates when client closes connection

**Example:** Claude Desktop connecting to a local file system server

## 2. Server-Sent Events (SSE)
**Best for:** Web applications, cloud deployments, real-time updates

**How it works:**
- Client opens **HTTP GET** connection for SSE stream
- Server pushes **notifications** and **requests** via SSE
- Client sends **requests** and **responses** via **HTTP POST**
- Supports **session resumability** with Last-Event-ID

**Example:** Web-based AI assistant connecting to cloud MCP servers

## 3. HTTP Streaming
**Best for:** Modern web APIs, scalable cloud services

**How it works:**
- Similar to SSE but uses **generic HTTP streaming**
- Supports **chunked transfer encoding**
- More flexible content types
- Better suited for complex web architectures

**Example:** Enterprise AI platforms with load-balanced MCP servers`,
                    },
                ],
                examples: [
                    {
                        language: 'mermaid',
                        description: 'stdio Transport Flow',
                        code: `sequenceDiagram
    participant Client
    participant Server Process

    Client->>+Server Process: Launch subprocess
    loop Message Exchange
        Client->>Server Process: Write to stdin
        Server Process->>Client: Write to stdout
        Server Process--)Client: Optional logs on stderr
    end
    Client->>Server Process: Close stdin, terminate subprocess
    deactivate Server Process`,
                    },
                ],
            },
        },
    ],
    quiz: {
        id: 'quiz-foundations',
        stageId: 'foundations',
        passingThreshold: 0.7,
        questions: [
            {
                id: 'q1',
                prompt: 'What is the primary purpose of the Model Context Protocol (MCP)?',
                difficulty: 'easy',
                conceptTag: 'protocol-basics',
                correctAnswerId: 'q1-b',
                rationale:
                    'MCP standardizes how AI applications connect to data sources and tools, similar to how USB-C standardized device connections. This enables interoperability and composability.',
                options: [
                    { id: 'q1-a', text: 'To replace REST APIs entirely', isCorrect: false },
                    {
                        id: 'q1-b',
                        text: 'To standardize how AI applications access context and tools',
                        isCorrect: true,
                    },
                    { id: 'q1-c', text: 'To create a new programming language for AI', isCorrect: false },
                    {
                        id: 'q1-d',
                        text: 'To provide cloud hosting for LLM applications',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q2',
                prompt: 'In MCP architecture, what is the role of the MCP client?',
                difficulty: 'easy',
                conceptTag: 'client-server',
                correctAnswerId: 'q2-c',
                rationale:
                    'The MCP client (host) is typically an AI application that connects to multiple servers, discovers their capabilities, and integrates them with LLMs.',
                options: [
                    { id: 'q2-a', text: 'To store data and expose it to servers', isCorrect: false },
                    { id: 'q2-b', text: 'To execute AI model training', isCorrect: false },
                    {
                        id: 'q2-c',
                        text: 'To connect to servers and integrate capabilities with LLMs',
                        isCorrect: true,
                    },
                    { id: 'q2-d', text: 'To host the language model itself', isCorrect: false },
                ],
            },
            {
                id: 'q3',
                prompt: 'Which MCP primitive would you use to provide the LLM with file contents?',
                difficulty: 'medium',
                conceptTag: 'primitives',
                correctAnswerId: 'q3-a',
                rationale:
                    'Resources are data sources that the LLM can read for context, such as files, database records, or API responses. They use URI-based addressing.',
                options: [
                    { id: 'q3-a', text: 'Resource', isCorrect: true },
                    { id: 'q3-b', text: 'Prompt', isCorrect: false },
                    { id: 'q3-c', text: 'Tool', isCorrect: false },
                    { id: 'q3-d', text: 'Transport', isCorrect: false },
                ],
            },
            {
                id: 'q4',
                prompt:
                    'What protocol does MCP use for message exchange between client and server?',
                difficulty: 'easy',
                conceptTag: 'json-rpc',
                correctAnswerId: 'q4-b',
                rationale:
                    'MCP uses JSON-RPC 2.0 for all communication. This provides a standardized request/response/notification pattern.',
                options: [
                    { id: 'q4-a', text: 'GraphQL', isCorrect: false },
                    { id: 'q4-b', text: 'JSON-RPC 2.0', isCorrect: true },
                    { id: 'q4-c', text: 'gRPC', isCorrect: false },
                    { id: 'q4-d', text: 'WebSockets', isCorrect: false },
                ],
            },
            {
                id: 'q5',
                prompt: 'Which transport is best suited for web-based AI applications?',
                difficulty: 'medium',
                conceptTag: 'transports',
                correctAnswerId: 'q5-b',
                rationale:
                    'Server-Sent Events (SSE) is ideal for web applications as it supports real-time server-to-client communication via HTTP, works well with cloud deployments, and supports session resumability.',
                options: [
                    { id: 'q5-a', text: 'stdio (standard input/output)', isCorrect: false },
                    { id: 'q5-b', text: 'Server-Sent Events (SSE)', isCorrect: true },
                    { id: 'q5-c', text: 'FTP', isCorrect: false },
                    { id: 'q5-d', text: 'SMTP', isCorrect: false },
                ],
            },
            {
                id: 'q6',
                prompt:
                    'What happens during the MCP initialization handshake?',
                difficulty: 'medium',
                conceptTag: 'client-server',
                correctAnswerId: 'q6-c',
                rationale:
                    'During initialization, the client and server negotiate capabilities by exchanging information about what features they support, ensuring both sides know what operations are available.',
                options: [
                    { id: 'q6-a', text: 'The client downloads the server code', isCorrect: false },
                    { id: 'q6-b', text: 'The LLM is trained on new data', isCorrect: false },
                    {
                        id: 'q6-c',
                        text: 'Client and server exchange capability information',
                        isCorrect: true,
                    },
                    { id: 'q6-d', text: 'All available tools are executed', isCorrect: false },
                ],
            },
            {
                id: 'q7',
                prompt: 'Which MCP primitive allows the LLM to execute functions and take actions?',
                difficulty: 'easy',
                conceptTag: 'tools',
                correctAnswerId: 'q7-c',
                rationale:
                    'Tools are functions that the LLM can call to perform actions like searches, calculations, file modifications, or API calls. They have JSON Schema-defined parameters.',
                options: [
                    { id: 'q7-a', text: 'Resources', isCorrect: false },
                    { id: 'q7-b', text: 'Prompts', isCorrect: false },
                    { id: 'q7-c', text: 'Tools', isCorrect: true },
                    { id: 'q7-d', text: 'Transports', isCorrect: false },
                ],
            },
            {
                id: 'q8',
                prompt: 'What is a key advantage of using MCP over custom integrations?',
                difficulty: 'medium',
                conceptTag: 'protocol-basics',
                correctAnswerId: 'q8-a',
                rationale:
                    'MCP provides interoperability - one integration works across multiple AI applications. This eliminates the need to build custom integrations for each AI platform, reducing development time and vendor lock-in.',
                options: [
                    {
                        id: 'q8-a',
                        text: 'One integration works across multiple AI applications',
                        isCorrect: true,
                    },
                    { id: 'q8-b', text: 'Automatic code generation for all tasks', isCorrect: false },
                    { id: 'q8-c', text: 'Free cloud hosting included', isCorrect: false },
                    { id: 'q8-d', text: 'Built-in LLM training capabilities', isCorrect: false },
                ],
            },
        ],
    },
}
