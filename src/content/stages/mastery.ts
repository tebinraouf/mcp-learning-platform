/**
 * Stage 5: Mastery
 * Production deployment, advanced integrations, and real-world patterns
 */

import type { Stage } from '@/types'

export const masteryStage: Stage = {
    id: 'mastery',
    name: 'Mastery',
    description:
        'Master production deployment, scalability, performance optimization, advanced integrations, and real-world MCP architectures for enterprise applications.',
    objectives: [
        'Deploy MCP servers to production with proper security',
        'Implement scalable multi-server architectures',
        'Optimize performance for high-traffic scenarios',
        'Build advanced integrations with enterprise systems',
        'Apply MCP to real-world use cases',
    ],
    estimatedMinutes: 70,
    sequenceOrder: 5,
    prerequisites: [
        'foundations',
        'architecture-messages',
        'advanced-patterns',
        'building-debugging',
    ],
    concepts: [
        'production-deployment',
        'scalability',
        'performance',
        'enterprise-integration',
        'real-world-patterns',
    ],
    modules: [
        {
            id: 'mastery-1',
            stageId: 'mastery',
            title: 'Production Deployment and Security',
            objectives: [
                'Deploy MCP servers securely to production',
                'Implement authentication and authorization',
                'Set up monitoring and observability',
                'Handle high availability and failover',
            ],
            estimatedMinutes: 20,
            sequenceOrder: 1,
            relatedConcepts: ['production-deployment', 'security', 'monitoring'],
            content: {
                sections: [
                    {
                        heading: 'Production Architecture',
                        type: 'text',
                        body: `## Multi-Tier Deployment

\`\`\`mermaid
graph TB
    Client[LLM Application]
    LB[Load Balancer]
    MCP1[MCP Server 1]
    MCP2[MCP Server 2]
    MCP3[MCP Server 3]
    Cache[Redis Cache]
    DB[(Database)]
    Monitor[Monitoring<br/>Datadog/CloudWatch]
    
    Client -->|HTTPS| LB
    LB --> MCP1
    LB --> MCP2
    LB --> MCP3
    MCP1 --> Cache
    MCP2 --> Cache
    MCP3 --> Cache
    MCP1 --> DB
    MCP2 --> DB
    MCP3 --> DB
    MCP1 -.->|Metrics| Monitor
    MCP2 -.->|Metrics| Monitor
    MCP3 -.->|Metrics| Monitor
\`\`\`

## Key Components
- ✅ **Load Balancer** - Distribute traffic (Nginx, AWS ALB, Cloudflare)
- ✅ **Multiple Servers** - Horizontal scaling for high availability
- ✅ **Caching Layer** - Redis for frequently accessed data
- ✅ **Database** - PostgreSQL/MongoDB for persistent state
- ✅ **Monitoring** - Metrics, logs, and alerts`,
                    },
                    {
                        heading: 'Authentication and Authorization',
                        type: 'text',
                        body: `## API Key Authentication

\`\`\`typescript
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const API_KEYS = new Set(process.env.API_KEYS?.split(',') || []);

export function authenticateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey || !API_KEYS.has(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  // Optional: Track usage by API key
  req.apiKeyId = crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex')
    .slice(0, 16);
  
  next();
}
\`\`\`

## OAuth 2.0 / JWT

\`\`\`typescript
import jwt from 'jsonwebtoken';

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
\`\`\`

## Role-Based Access Control (RBAC)

\`\`\`typescript
interface User {
  id: string;
  roles: string[];
}

function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    
    if (!user.roles.includes(role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

// Usage
app.post('/tools/admin-only', requireRole('admin'), async (req, res) => {
  // Only admins can access this tool
});
\`\`\``,
                    },
                    {
                        heading: 'Monitoring and Observability',
                        type: 'text',
                        body: `## Structured Logging

\`\`\`typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'mcp-server' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log tool execution
logger.info('Tool executed', {
  toolName: 'search',
  arguments: { query: 'example' },
  duration: 123,
  userId: req.user.id,
  timestamp: new Date().toISOString()
});
\`\`\`

## Metrics Collection

\`\`\`python
from prometheus_client import Counter, Histogram, start_http_server
import time

# Define metrics
tool_calls = Counter('mcp_tool_calls_total', 'Total tool calls', ['tool_name'])
tool_duration = Histogram('mcp_tool_duration_seconds', 'Tool execution time', ['tool_name'])

@mcp.tool()
def search(query: str) -> str:
    tool_calls.labels(tool_name='search').inc()
    
    start = time.time()
    try:
        result = perform_search(query)
        return result
    finally:
        duration = time.time() - start
        tool_duration.labels(tool_name='search').observe(duration)

# Start Prometheus metrics server
start_http_server(8000)
\`\`\`

## Health Checks

\`\`\`typescript
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      diskSpace: await checkDiskSpace()
    }
  };
  
  const isHealthy = Object.values(health.checks).every(c => c.ok);
  res.status(isHealthy ? 200 : 503).json(health);
});
\`\`\``,
                    },
                ],
            },
        },
        {
            id: 'mastery-2',
            stageId: 'mastery',
            title: 'Scalability and Performance',
            objectives: [
                'Implement caching strategies',
                'Optimize tool execution performance',
                'Handle high concurrency',
                'Scale horizontally',
            ],
            estimatedMinutes: 20,
            sequenceOrder: 2,
            relatedConcepts: ['scalability', 'performance', 'caching'],
            content: {
                sections: [
                    {
                        heading: 'Caching Strategies',
                        type: 'text',
                        body: `## Redis Caching for Resources

\`\`\`typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function getCachedResource(uri: string): Promise<string | null> {
  const cached = await redis.get(\`resource:\${uri}\`);
  return cached;
}

async function setCachedResource(uri: string, content: string, ttl = 3600) {
  await redis.set(\`resource:\${uri}\`, content, 'EX', ttl);
}

// Use in resource handler
server.resource(
  "documentation",
  new ResourceTemplate("docs://{page}", { list: undefined }),
  async (uri, { page }) => {
    // Check cache first
    const cached = await getCachedResource(uri.href);
    if (cached) {
      return { contents: [{ uri: uri.href, text: cached }] };
    }
    
    // Fetch and cache
    const content = await fetchDocumentation(page);
    await setCachedResource(uri.href, content);
    
    return { contents: [{ uri: uri.href, text: content }] };
  }
);
\`\`\`

## In-Memory Caching with LRU

\`\`\`typescript
import { LRUCache } from 'lru-cache';

const toolCache = new LRUCache<string, any>({
  max: 1000,              // Max 1000 entries
  ttl: 1000 * 60 * 5,     // 5 minute TTL
  updateAgeOnGet: true,   // Reset TTL on access
});

function cacheKey(toolName: string, args: any): string {
  return \`\${toolName}:\${JSON.stringify(args)}\`;
}

server.tool("search", { query: z.string() }, async ({ query }) => {
  const key = cacheKey("search", { query });
  
  // Check cache
  if (toolCache.has(key)) {
    return toolCache.get(key)!;
  }
  
  // Execute and cache
  const result = await performSearch(query);
  toolCache.set(key, result);
  
  return result;
});
\`\`\``,
                    },
                    {
                        heading: 'Concurrency and Rate Limiting',
                        type: 'text',
                        body: `## Rate Limiting

\`\`\`typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Max 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip
});

app.use('/tools', limiter);
\`\`\`

## Connection Pooling

\`\`\`python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

# Database connection pool
engine = create_engine(
    'postgresql://user:pass@localhost/db',
    poolclass=QueuePool,
    pool_size=20,          # 20 connections
    max_overflow=10,       # +10 during spikes
    pool_pre_ping=True     # Test connections
)
\`\`\`

## Async Tool Execution

\`\`\`typescript
import pLimit from 'p-limit';

const limit = pLimit(10); // Max 10 concurrent operations

server.tool("batch-process", 
  { items: z.array(z.string()) },
  async ({ items }) => {
    const results = await Promise.all(
      items.map(item => 
        limit(() => processItem(item)) // Throttle concurrency
      )
    );
    
    return { content: [{ type: "text", text: JSON.stringify(results) }] };
  }
);
\`\`\``,
                    },
                    {
                        heading: 'Performance Optimization',
                        type: 'text',
                        body: `## Lazy Loading and Pagination

\`\`\`typescript
server.resource(
  "database-records",
  new ResourceTemplate("db://records?page={page}&limit={limit}", { 
    list: { page: "1", limit: "100" } 
  }),
  async (uri, { page, limit }) => {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const records = await db.records.findMany({
      skip: offset,
      take: parseInt(limit),
    });
    
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(records)
      }]
    };
  }
);
\`\`\`

## Streaming Large Responses

\`\`\`python
@mcp.tool()
async def process_large_dataset(dataset_id: str):
    """Process large dataset with streaming"""
    
    # Stream results instead of loading all at once
    async for chunk in process_dataset_stream(dataset_id):
        yield {"type": "text", "text": json.dumps(chunk)}
\`\`\`

## Database Query Optimization

\`\`\`typescript
// Bad: N+1 query problem
const users = await db.user.findMany();
for (const user of users) {
  user.posts = await db.post.findMany({ where: { userId: user.id } });
}

// Good: Single query with join
const users = await db.user.findMany({
  include: { posts: true }
});
\`\`\``,
                    },
                ],
            },
        },
        {
            id: 'mastery-3',
            stageId: 'mastery',
            title: 'Enterprise Integration Patterns',
            objectives: [
                'Integrate with enterprise APIs and databases',
                'Build MCP gateways for legacy systems',
                'Implement event-driven architectures',
                'Connect multiple MCP servers',
            ],
            estimatedMinutes: 15,
            sequenceOrder: 3,
            relatedConcepts: ['enterprise-integration', 'multi-server', 'events'],
            content: {
                sections: [
                    {
                        heading: 'Multi-Server Orchestration',
                        type: 'text',
                        body: `## Connecting Multiple MCP Servers

\`\`\`typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

class MCPOrchestrator {
  private servers: Map<string, Client> = new Map();
  
  async addServer(name: string, config: ServerConfig) {
    const client = new Client({ name: \`orchestrator-\${name}\`, version: "1.0.0" });
    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args
    });
    
    await client.connect(transport);
    this.servers.set(name, client);
  }
  
  async callTool(serverName: string, toolName: string, args: any) {
    const server = this.servers.get(serverName);
    if (!server) throw new Error(\`Server not found: \${serverName}\`);
    
    return await server.callTool({ name: toolName, arguments: args });
  }
  
  async getAllTools() {
    const allTools = [];
    
    for (const [serverName, client] of this.servers) {
      const tools = await client.listTools();
      allTools.push(...tools.tools.map(t => ({ 
        ...t, 
        server: serverName 
      })));
    }
    
    return allTools;
  }
}

// Usage
const orchestrator = new MCPOrchestrator();
await orchestrator.addServer('database', { command: 'node', args: ['db-server.js'] });
await orchestrator.addServer('api', { command: 'node', args: ['api-server.js'] });

const result = await orchestrator.callTool('database', 'query', { sql: 'SELECT * FROM users' });
\`\`\``,
                    },
                    {
                        heading: 'MCP Gateway for Legacy Systems',
                        type: 'text',
                        body: `## Wrapping REST APIs as MCP Tools

\`\`\`python
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("SalesforceGateway")

@mcp.tool()
async def get_account(account_id: str) -> dict:
    """Get Salesforce account details"""
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SALESFORCE_URL}/services/data/v58.0/sobjects/Account/{account_id}",
            headers={
                "Authorization": f"Bearer {SALESFORCE_TOKEN}",
                "Content-Type": "application/json"
            }
        )
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def create_lead(email: str, company: str, last_name: str) -> dict:
    """Create a new lead in Salesforce"""
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SALESFORCE_URL}/services/data/v58.0/sobjects/Lead",
            headers={
                "Authorization": f"Bearer {SALESFORCE_TOKEN}",
                "Content-Type": "application/json"
            },
            json={
                "Email": email,
                "Company": company,
                "LastName": last_name
            }
        )
        response.raise_for_status()
        return response.json()
\`\`\`

## Database Gateway

\`\`\`typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

server.tool(
  "db-query",
  {
    table: z.string(),
    where: z.record(z.any()).optional(),
    limit: z.number().default(100)
  },
  async ({ table, where, limit }) => {
    // Whitelist allowed tables
    const allowedTables = ['users', 'products', 'orders'];
    if (!allowedTables.includes(table)) {
      throw new Error(\`Table not allowed: \${table}\`);
    }
    
    const results = await (prisma as any)[table].findMany({
      where,
      take: limit
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(results, null, 2)
      }]
    };
  }
);
\`\`\``,
                    },
                    {
                        heading: 'Event-Driven Architectures',
                        type: 'text',
                        body: `## MCP Server with Event Subscriptions

\`\`\`typescript
import { EventEmitter } from 'events';
import WebSocket from 'ws';

class EventDrivenMCPServer extends EventEmitter {
  private wss: WebSocket.Server;
  
  constructor() {
    super();
    this.wss = new WebSocket.Server({ port: 8080 });
    
    this.wss.on('connection', (ws) => {
      // Send events to connected clients
      const listener = (data: any) => {
        ws.send(JSON.stringify({
          jsonrpc: "2.0",
          method: "notifications/resources/updated",
          params: { uri: data.uri }
        }));
      };
      
      this.on('resource-updated', listener);
      
      ws.on('close', () => {
        this.off('resource-updated', listener);
      });
    });
  }
  
  updateResource(uri: string) {
    // Emit event to all subscribers
    this.emit('resource-updated', { uri });
  }
}
\`\`\`

## Webhooks Integration

\`\`\`python
from fastapi import FastAPI, Request
from mcp.server.fastmcp import FastMCP

app = FastAPI()
mcp = FastMCP("WebhookServer")

# Store latest webhook data
latest_webhook_data = {}

@app.post("/webhooks/github")
async def github_webhook(request: Request):
    """Receive GitHub webhooks"""
    
    payload = await request.json()
    event_type = request.headers.get("X-GitHub-Event")
    
    # Store for MCP resource
    latest_webhook_data['github'] = {
        "event": event_type,
        "payload": payload,
        "timestamp": datetime.now().isoformat()
    }
    
    return {"status": "received"}

@mcp.resource("webhook://github/latest")
def get_latest_github_event() -> dict:
    """Get the latest GitHub webhook event"""
    return latest_webhook_data.get('github', {})
\`\`\``,
                    },
                ],
            },
        },
        {
            id: 'mastery-4',
            stageId: 'mastery',
            title: 'Real-World Use Cases',
            objectives: [
                'Build AI-powered customer support systems',
                'Create code analysis and generation tools',
                'Implement data analytics workflows',
                'Develop multi-agent systems',
            ],
            estimatedMinutes: 15,
            sequenceOrder: 4,
            relatedConcepts: ['real-world-patterns', 'use-cases', 'multi-agent'],
            content: {
                sections: [
                    {
                        heading: 'Customer Support AI Agent',
                        type: 'text',
                        body: `## Complete Support System Architecture

\`\`\`mermaid
graph TB
    User[Customer]
    LLM[Claude/GPT-4]
    MCP[MCP Server]
    KB[(Knowledge Base)]
    Tickets[(Ticketing System)]
    CRM[(CRM Database)]
    
    User -->|Question| LLM
    LLM -->|Call Tools| MCP
    MCP -->|Search| KB
    MCP -->|Create/Update| Tickets
    MCP -->|Get Customer Data| CRM
    MCP -->|Results| LLM
    LLM -->|Answer| User
\`\`\`

## Implementation

\`\`\`python
from mcp.server.fastmcp import FastMCP
import chromadb

mcp = FastMCP("CustomerSupport")

# Vector database for knowledge base
chroma_client = chromadb.Client()
kb_collection = chroma_client.get_or_create_collection("knowledge_base")

@mcp.tool()
async def search_knowledge_base(query: str, top_k: int = 5) -> list[dict]:
    """Search company knowledge base for relevant articles"""
    
    results = kb_collection.query(
        query_texts=[query],
        n_results=top_k
    )
    
    return [{
        "title": metadata['title'],
        "content": doc,
        "url": metadata['url']
    } for doc, metadata in zip(results['documents'][0], results['metadatas'][0])]

@mcp.tool()
async def get_customer_info(email: str) -> dict:
    """Get customer account information"""
    
    customer = await db.customers.find_one({"email": email})
    
    return {
        "name": customer['name'],
        "tier": customer['subscription_tier'],
        "joined": customer['created_at'],
        "lifetime_value": customer['ltv']
    }

@mcp.tool()
async def create_support_ticket(
    customer_email: str,
    subject: str,
    description: str,
    priority: str = "medium"
) -> dict:
    """Create a support ticket"""
    
    ticket = await zendesk.tickets.create({
        "requester": {"email": customer_email},
        "subject": subject,
        "description": description,
        "priority": priority
    })
    
    return {
        "ticket_id": ticket.id,
        "status": ticket.status,
        "url": ticket.url
    }
\`\`\``,
                    },
                    {
                        heading: 'Code Analysis and Generation',
                        type: 'text',
                        body: `## Developer Assistant MCP Server

\`\`\`typescript
import * as ts from 'typescript';
import { execSync } from 'child_process';

server.tool(
  "analyze-code",
  { filePath: z.string() },
  async ({ filePath }) => {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );
    
    const analysis = {
      functions: [] as any[],
      classes: [] as any[],
      imports: [] as any[],
      complexity: 0
    };
    
    function visit(node: ts.Node) {
      if (ts.isFunctionDeclaration(node)) {
        analysis.functions.push({
          name: node.name?.getText(),
          parameters: node.parameters.map(p => p.name.getText()),
          lineCount: node.end - node.pos
        });
      }
      
      if (ts.isClassDeclaration(node)) {
        analysis.classes.push({
          name: node.name?.getText(),
          methods: node.members.filter(ts.isMethodDeclaration).length
        });
      }
      
      ts.forEachChild(node, visit);
    }
    
    visit(sourceFile);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(analysis, null, 2)
      }]
    };
  }
);

server.tool(
  "run-tests",
  { testPattern: z.string().optional() },
  async ({ testPattern }) => {
    const command = testPattern 
      ? \`npm test -- \${testPattern}\`
      : 'npm test';
    
    try {
      const output = execSync(command, { encoding: 'utf-8' });
      return {
        content: [{
          type: "text",
          text: \`Tests passed:\\n\${output}\`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: \`Tests failed:\\n\${error.stdout}\`
        }],
        isError: true
      };
    }
  }
);
\`\`\``,
                    },
                    {
                        heading: 'Data Analytics Workflow',
                        type: 'text',
                        body: `## Analytics MCP Server

\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64

@mcp.tool()
async def query_analytics_data(
    metric: str,
    start_date: str,
    end_date: str,
    group_by: str = "day"
) -> dict:
    """Query analytics data and return summary statistics"""
    
    df = await db.query(f"""
        SELECT 
            DATE_TRUNC('{group_by}', timestamp) as period,
            SUM({metric}) as value
        FROM analytics
        WHERE timestamp BETWEEN '{start_date}' AND '{end_date}'
        GROUP BY period
        ORDER BY period
    """)
    
    return {
        "mean": df['value'].mean(),
        "median": df['value'].median(),
        "std": df['value'].std(),
        "total": df['value'].sum(),
        "data_points": len(df)
    }

@mcp.tool()
async def create_visualization(
    metric: str,
    start_date: str,
    end_date: str,
    chart_type: str = "line"
) -> str:
    """Generate a visualization and return as base64 image"""
    
    df = await get_analytics_data(metric, start_date, end_date)
    
    plt.figure(figsize=(10, 6))
    
    if chart_type == "line":
        plt.plot(df['period'], df['value'])
    elif chart_type == "bar":
        plt.bar(df['period'], df['value'])
    
    plt.title(f"{metric.title()} Over Time")
    plt.xlabel("Date")
    plt.ylabel(metric.title())
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    # Convert to base64
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    
    return f"data:image/png;base64,{image_base64}"
\`\`\``,
                    },
                ],
            },
        },
    ],
    quiz: {
        id: 'quiz-mastery',
        stageId: 'mastery',
        passingThreshold: 0.7,
        questions: [
            {
                id: 'q1',
                prompt: 'What is the primary purpose of a load balancer in MCP production architecture?',
                difficulty: 'medium',
                conceptTag: 'production-deployment',
                correctAnswerId: 'q1-b',
                rationale:
                    'A load balancer distributes incoming traffic across multiple MCP server instances to ensure high availability, fault tolerance, and efficient resource utilization.',
                options: [
                    { id: 'q1-a', text: 'Authenticate requests', isCorrect: false },
                    {
                        id: 'q1-b',
                        text: 'Distribute traffic across multiple server instances',
                        isCorrect: true,
                    },
                    { id: 'q1-c', text: 'Cache responses', isCorrect: false },
                    { id: 'q1-d', text: 'Log all requests', isCorrect: false },
                ],
            },
            {
                id: 'q2',
                prompt: 'Which authentication method is most suitable for server-to-server MCP communication?',
                difficulty: 'medium',
                conceptTag: 'security',
                correctAnswerId: 'q2-c',
                rationale:
                    'API keys are ideal for server-to-server communication as they\'re simple to implement, don\'t require user interaction, and can be easily rotated. OAuth/JWT are better for user-facing applications.',
                options: [
                    { id: 'q2-a', text: 'Username and password', isCorrect: false },
                    { id: 'q2-b', text: 'OAuth 2.0 with user consent', isCorrect: false },
                    { id: 'q2-c', text: 'API keys', isCorrect: true },
                    { id: 'q2-d', text: 'No authentication needed', isCorrect: false },
                ],
            },
            {
                id: 'q3',
                prompt: 'What is the benefit of using Redis caching in MCP servers?',
                difficulty: 'easy',
                conceptTag: 'caching',
                correctAnswerId: 'q3-a',
                rationale:
                    'Redis provides fast in-memory caching that reduces expensive database queries and external API calls, significantly improving response times and reducing load on backend systems.',
                options: [
                    {
                        id: 'q3-a',
                        text: 'Reduce database queries and improve response times',
                        isCorrect: true,
                    },
                    { id: 'q3-b', text: 'Replace the primary database', isCorrect: false },
                    { id: 'q3-c', text: 'Authenticate users', isCorrect: false },
                    { id: 'q3-d', text: 'Generate logs', isCorrect: false },
                ],
            },
            {
                id: 'q4',
                prompt: 'How should you handle high-concurrency scenarios in MCP servers?',
                difficulty: 'hard',
                conceptTag: 'scalability',
                correctAnswerId: 'q4-d',
                rationale:
                    'A comprehensive approach to high concurrency includes rate limiting (prevent abuse), connection pooling (efficient resource use), async operations (non-blocking I/O), and horizontal scaling (distribute load).',
                options: [
                    {
                        id: 'q4-a',
                        text: 'Increase server CPU and RAM only',
                        isCorrect: false,
                    },
                    { id: 'q4-b', text: 'Block all concurrent requests', isCorrect: false },
                    {
                        id: 'q4-c',
                        text: 'Use only synchronous operations',
                        isCorrect: false,
                    },
                    {
                        id: 'q4-d',
                        text: 'Implement rate limiting, connection pooling, async operations, and horizontal scaling',
                        isCorrect: true,
                    },
                ],
            },
            {
                id: 'q5',
                prompt:
                    'What is the purpose of an MCP orchestrator that connects multiple servers?',
                difficulty: 'hard',
                conceptTag: 'multi-server',
                correctAnswerId: 'q5-b',
                rationale:
                    'An MCP orchestrator aggregates capabilities from multiple specialized MCP servers, providing a unified interface to clients while routing requests to the appropriate backend server.',
                options: [
                    {
                        id: 'q5-a',
                        text: 'Replace all servers with a single server',
                        isCorrect: false,
                    },
                    {
                        id: 'q5-b',
                        text: 'Aggregate tools from multiple servers and route requests',
                        isCorrect: true,
                    },
                    { id: 'q5-c', text: 'Only for load balancing', isCorrect: false },
                    { id: 'q5-d', text: 'Backup system only', isCorrect: false },
                ],
            },
            {
                id: 'q6',
                prompt: 'What is a key benefit of wrapping legacy REST APIs as MCP tools?',
                difficulty: 'medium',
                conceptTag: 'enterprise-integration',
                correctAnswerId: 'q6-c',
                rationale:
                    'Wrapping legacy APIs as MCP tools makes them accessible to LLMs through a standardized interface, enabling AI agents to interact with existing enterprise systems without API modifications.',
                options: [
                    {
                        id: 'q6-a',
                        text: 'It replaces the REST API entirely',
                        isCorrect: false,
                    },
                    { id: 'q6-b', text: 'It makes the API faster', isCorrect: false },
                    {
                        id: 'q6-c',
                        text: 'It makes legacy systems accessible to LLMs through a standard interface',
                        isCorrect: true,
                    },
                    {
                        id: 'q6-d',
                        text: 'It eliminates the need for authentication',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q7',
                prompt:
                    'In a customer support AI system using MCP, which tools are essential?',
                difficulty: 'medium',
                conceptTag: 'real-world-patterns',
                correctAnswerId: 'q7-a',
                rationale:
                    'A complete customer support AI needs knowledge base search (answer questions), customer data access (personalization), and ticketing system integration (issue tracking and escalation).',
                options: [
                    {
                        id: 'q7-a',
                        text: 'Knowledge base search, customer data access, and ticket creation',
                        isCorrect: true,
                    },
                    { id: 'q7-b', text: 'Only knowledge base search', isCorrect: false },
                    {
                        id: 'q7-c',
                        text: 'Only email sending capability',
                        isCorrect: false,
                    },
                    { id: 'q7-d', text: 'Only chat interface', isCorrect: false },
                ],
            },
            {
                id: 'q8',
                prompt: 'What metrics should you monitor in production MCP servers?',
                difficulty: 'hard',
                conceptTag: 'monitoring',
                correctAnswerId: 'q8-d',
                rationale:
                    'Comprehensive monitoring includes tool execution times (performance), error rates (reliability), request volume (capacity), and resource usage (infrastructure health) to ensure production stability.',
                options: [
                    { id: 'q8-a', text: 'Only error counts', isCorrect: false },
                    { id: 'q8-b', text: 'Only request volume', isCorrect: false },
                    { id: 'q8-c', text: 'Only server uptime', isCorrect: false },
                    {
                        id: 'q8-d',
                        text: 'Tool execution times, error rates, request volume, and resource usage',
                        isCorrect: true,
                    },
                ],
            },
        ],
    },
}
