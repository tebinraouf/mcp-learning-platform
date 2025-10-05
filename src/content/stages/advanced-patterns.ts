/**
 * Stage 3: Advanced Patterns
 * Advanced MCP patterns including sampling, prompts, and security
 */

import type { Stage } from '@/types'

export const advancedPatternsStage: Stage = {
    id: 'advanced-patterns',
    name: 'Advanced Patterns',
    description:
        'Master advanced MCP patterns including server-initiated sampling, prompt engineering, human-in-the-loop workflows, and security best practices.',
    objectives: [
        'Implement server-initiated LLM sampling',
        'Create and use prompt templates effectively',
        'Build human-in-the-loop approval workflows',
        'Apply security best practices for MCP servers',
        'Handle complex multi-step interactions',
    ],
    estimatedMinutes: 55,
    sequenceOrder: 3,
    prerequisites: ['foundations', 'architecture-messages'],
    concepts: [
        'sampling',
        'prompts',
        'human-in-loop',
        'security',
        'multi-step-workflows',
    ],
    modules: [
        {
            id: 'advanced-patterns-1',
            stageId: 'advanced-patterns',
            title: 'Server-Initiated Sampling',
            objectives: [
                'Understand when servers need LLM access',
                'Implement sampling/createMessage requests',
                'Configure model preferences and priorities',
                'Handle sampling responses and errors',
            ],
            estimatedMinutes: 15,
            sequenceOrder: 1,
            relatedConcepts: ['sampling', 'model-preferences', 'server-requests'],
            content: {
                sections: [
                    {
                        heading: 'What is Server-Initiated Sampling?',
                        type: 'text',
                        body: `**Sampling** allows MCP servers to **request LLM completions** from the client. This enables servers to:

## Why Servers Need LLM Access
- 🧠 **Intelligent processing** - Analyze complex data before returning results
- 📊 **Data synthesis** - Combine multiple sources into coherent responses
- 🔍 **Smart filtering** - Use LLM to select relevant information
- ✨ **Enhancement** - Improve tool outputs with AI processing

## Example Scenario
A flight booking server receives a request to find flights. Instead of returning raw data:
1. Server searches for available flights (47 results)
2. Server **requests sampling** from client's LLM
3. LLM analyzes flights based on user preferences
4. Server returns **intelligently filtered** recommendations

## The Sampling Request
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Analyze these 47 flights and recommend the best..."
        }
      }
    ],
    "modelPreferences": {
      "hints": [{ "name": "claude-3-5-sonnet" }],
      "costPriority": 0.3,
      "speedPriority": 0.2,
      "intelligencePriority": 0.9
    },
    "systemPrompt": "You are a travel expert...",
    "maxTokens": 1500
  }
}
\`\`\``,
                    },
                    {
                        heading: 'Model Preferences',
                        type: 'text',
                        body: `Servers can guide model selection with **preferences**:

## Hints
Suggest models by name (treated as flexible substrings):
\`\`\`typescript
hints: [
  { name: "claude-3-sonnet" },  // Matches claude-3-sonnet-*
  { name: "claude" }             // Fallback to any Claude model
]
\`\`\`

## Priority Weights (0.0 to 1.0)
- **costPriority** - Prefer cheaper models when high
- **speedPriority** - Prefer faster models when high  
- **intelligencePriority** - Prefer more capable models when high

The client chooses the best available model balancing these priorities.

## Example: Complex Analysis
\`\`\`json
{
  "costPriority": 0.3,      // Less concerned about cost
  "speedPriority": 0.2,     // Can wait for thoroughness
  "intelligencePriority": 0.9  // Need advanced reasoning
}
\`\`\`

## Example: Quick Summary
\`\`\`json
{
  "costPriority": 0.8,      // Keep costs low
  "speedPriority": 0.9,     // Fast response critical
  "intelligencePriority": 0.3  // Simple task
}
\`\`\``,
                    },
                    {
                        heading: 'Human-in-the-Loop Review',
                        type: 'text',
                        body: `**Critical security feature**: Clients SHOULD present sampling requests to users for approval before executing.

## Review Flow
1. **Server requests** LLM completion
2. **Client presents** request to user with:
   - The prompt content
   - Which server made the request
   - Estimated token cost
3. **User reviews** and can:
   - ✅ Approve the request
   - ✏️ Modify the prompt
   - ❌ Reject the request
4. **Client executes** approved request
5. **Client presents** LLM response to user
6. **User reviews** response and can:
   - ✅ Approve sending to server
   - ✏️ Modify the response
   - ❌ Reject and return error
7. **Client returns** approved response to server

This prevents servers from making unauthorized LLM calls or extracting sensitive information.`,
                    },
                ],
                examples: [
                    {
                        language: 'mermaid',
                        description: 'Sampling Flow with Human Review',
                        code: `sequenceDiagram
    participant Server
    participant Client
    participant User
    participant LLM

    Note over Server,Client: Server initiates sampling
    Server->>Client: sampling/createMessage

    Note over Client,User: Human-in-the-loop review
    Client->>User: Present request for approval
    User-->>Client: Review and approve/modify

    Note over Client,LLM: Model interaction
    Client->>LLM: Forward approved request
    LLM-->>Client: Return generation

    Note over Client,User: Response review
    Client->>User: Present response for approval
    User-->>Client: Review and approve/modify

    Note over Server,Client: Complete request
    Client-->>Server: Return approved response`,
                    },
                    {
                        language: 'json',
                        description: 'Sampling Response',
                        code: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "role": "assistant",
    "content": {
      "type": "text",
      "text": "Based on your preferences, I recommend Flight AA123..."
    },
    "model": "claude-3-sonnet-20240307",
    "stopReason": "endTurn"
  }
}`,
                    },
                ],
            },
        },
        {
            id: 'advanced-patterns-2',
            stageId: 'advanced-patterns',
            title: 'Prompt Templates & Best Practices',
            objectives: [
                'Create reusable prompt templates',
                'Use prompt arguments for customization',
                'Implement prompt listing and retrieval',
                'Apply prompt engineering best practices',
            ],
            estimatedMinutes: 12,
            sequenceOrder: 2,
            relatedConcepts: ['prompts', 'templates', 'prompt-engineering'],
            content: {
                sections: [
                    {
                        heading: 'Prompt Templates in MCP',
                        type: 'text',
                        body: `**Prompts** are **reusable templates** that encode best practices for LLM interactions:

## Discovery Flow
1. **Client requests** available prompts:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/list"
}
\`\`\`

2. **Server returns** prompt catalog:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "prompts": [
      {
        "name": "code_review",
        "description": "Review code for quality and security",
        "arguments": [
          {
            "name": "code",
            "description": "Code to review",
            "required": true
          },
          {
            "name": "language",
            "description": "Programming language",
            "required": false
          }
        ]
      }
    ]
  }
}
\`\`\`

3. **Client retrieves** specific prompt with arguments:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {
      "code": "def hello():\\n    print('world')",
      "language": "python"
    }
  }
}
\`\`\`

4. **Server returns** formatted prompt:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "description": "Code review prompt",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review this Python code:\\ndef hello():\\n    print('world')"
        }
      }
    ]
  }
}
\`\`\``,
                    },
                    {
                        heading: 'Embedded Resources in Prompts',
                        type: 'text',
                        body: `Prompts can **embed resources** directly in messages:

\`\`\`json
{
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": "Review this code file:"
    },
    {
      "type": "resource",
      "resource": {
        "uri": "file:///project/src/main.rs",
        "mimeType": "text/x-rust",
        "text": "fn main() {\\n    println!(\\"Hello!\\");\\n}"
      }
    }
  ]
}
\`\`\`

This allows prompts to reference server-side data without the client needing to fetch it separately.

## Benefits
- ✅ **Consistency** - Same prompt structure every time
- ✅ **Efficiency** - No separate resource fetch needed
- ✅ **Context** - Rich data embedded in messages
- ✅ **Flexibility** - Mix text and resources freely`,
                    },
                ],
                examples: [
                    {
                        language: 'typescript',
                        description: 'Using Prompts in TypeScript Client',
                        code: `// List available prompts
const prompts = await client.listPrompts();

// Get a specific prompt with arguments
const prompt = await client.getPrompt({
  name: "code_review",
  arguments: {
    code: "function add(a, b) { return a + b; }",
    language: "javascript"
  }
});

// Use the prompt messages with your LLM
const response = await llm.chat(prompt.messages);`,
                    },
                ],
            },
        },
        {
            id: 'advanced-patterns-3',
            stageId: 'advanced-patterns',
            title: 'Security & Access Control',
            objectives: [
                'Implement authentication for HTTP transports',
                'Validate Origin headers to prevent attacks',
                'Apply principle of least privilege',
                'Secure sensitive data in tool responses',
            ],
            estimatedMinutes: 15,
            sequenceOrder: 3,
            relatedConcepts: ['security', 'authentication', 'access-control'],
            content: {
                sections: [
                    {
                        heading: 'MCP Security Best Practices',
                        type: 'text',
                        body: `Security is **critical** for MCP servers, especially with HTTP transports:

## 1. Origin Header Validation
**Always validate** the \`Origin\` header to prevent DNS rebinding attacks:

\`\`\`python
from fastapi import Request, HTTPException

@app.middleware("http")
async def validate_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    if origin and origin not in ALLOWED_ORIGINS:
        raise HTTPException(status_code=403, detail="Forbidden")
    return await call_next(request)
\`\`\`

## 2. Localhost Binding (Development)
For local development, **bind to localhost only**:
\`\`\`python
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
\`\`\`

Never bind to \`0.0.0.0\` in development!

## 3. Authentication (Production)
Implement authentication for production deployments:
- **API Keys** - Simple token-based auth
- **OAuth 2.0** - Delegated authorization
- **mTLS** - Mutual TLS for strong security

Example with API key:
\`\`\`python
API_KEY = os.environ.get("MCP_API_KEY")

@app.middleware("http")
async def check_api_key(request: Request, call_next):
    auth_header = request.headers.get("authorization")
    if not auth_header or auth_header != f"Bearer {API_KEY}":
        raise HTTPException(status_code=401)
    return await call_next(request)
\`\`\`

## 4. HTTPS Only (Production)
**Always use HTTPS** in production:
- Encrypts all traffic
- Prevents man-in-the-middle attacks
- Required for secure credential transmission`,
                    },
                    {
                        heading: 'Data Security in Responses',
                        type: 'text',
                        body: `Protect sensitive data in tool and resource responses:

## Principle of Least Privilege
Only return **necessary information**:
- ❌ Don't return entire database records
- ✅ Return only requested fields
- ❌ Don't expose internal IDs or tokens
- ✅ Use public identifiers

## Redact Sensitive Data
Implement **PII redaction** filters:
\`\`\`python
def redact_pii(text: str) -> str:
    # Redact email addresses
    text = re.sub(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
                  '[EMAIL]', text)
    # Redact phone numbers
    text = re.sub(r'\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b',
                  '[PHONE]', text)
    return text
\`\`\`

## Access Control
Check permissions **before** executing tools:
\`\`\`typescript
async function callTool(name: string, args: any, userId: string) {
  if (!await hasPermission(userId, name)) {
    throw new Error("Unauthorized");
  }
  return await executeTool(name, args);
}
\`\`\`

## Audit Logging
Log all security-relevant events:
- Authentication attempts
- Tool executions
- Resource accesses
- Permission denials`,
                    },
                ],
                examples: [
                    {
                        language: 'python',
                        description: 'Complete Security Implementation',
                        code: `from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# 1. CORS configuration
ALLOWED_ORIGINS = ["https://trusted-client.example.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. API Key authentication
API_KEY = os.environ.get("MCP_API_KEY")

@app.middleware("http")
async def authenticate(request: Request, call_next):
    auth = request.headers.get("authorization")
    if not auth or auth != f"Bearer {API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await call_next(request)

# 3. Audit logging
import logging
logger = logging.getLogger(__name__)

@app.middleware("http")
async def audit_log(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response`,
                    },
                ],
            },
        },
        {
            id: 'advanced-patterns-4',
            stageId: 'advanced-patterns',
            title: 'Multi-Step Workflows',
            objectives: [
                'Chain multiple tool calls together',
                'Manage conversation context across steps',
                'Handle failures and retry logic',
                'Implement complex agentic behaviors',
            ],
            estimatedMinutes: 13,
            sequenceOrder: 4,
            relatedConcepts: ['multi-step-workflows', 'tool-chaining', 'agentic-patterns'],
            content: {
                sections: [
                    {
                        heading: 'Building Multi-Step Interactions',
                        type: 'text',
                        body: `Complex tasks often require **multiple tool calls** in sequence:

## Example: Research and Summarize Workflow
1. **Search** for relevant articles (web_search tool)
2. **Fetch** article contents (fetch_url tool)
3. **Analyze** and extract key points (analysis tool)
4. **Synthesize** into summary (LLM sampling)
5. **Format** for presentation (formatting tool)

## Conversation Context Management
The client maintains **conversation history** including:
- User messages
- Assistant messages  
- Tool calls
- Tool results

Each step adds to this context, allowing the LLM to make informed decisions.

## Example Flow
\`\`\`typescript
const messages = [];

// Step 1: User asks question
messages.push({
  role: "user",
  content: "Research recent advances in quantum computing"
});

// Step 2: LLM decides to search
const response1 = await llm.chat(messages, { tools });
messages.push(response1.message);

// Step 3: Execute search tool
const searchResult = await mcpClient.callTool(
  "web_search",
  { query: "quantum computing advances 2024" }
);
messages.push({
  role: "tool",
  tool_call_id: response1.tool_calls[0].id,
  content: searchResult.content
});

// Step 4: LLM processes results and may call more tools
const response2 = await llm.chat(messages, { tools });
// ... continue until complete
\`\`\``,
                    },
                    {
                        heading: 'Error Handling and Retries',
                        type: 'text',
                        body: `Robust multi-step workflows need **error handling**:

## Retry Strategy
\`\`\`typescript
async function callToolWithRetry(
  name: string,
  args: any,
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await mcpClient.callTool(name, args);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      await sleep(Math.pow(2, attempt) * 1000);
      
      console.log(\`Retry \${attempt}/\${maxRetries} for \${name}\`);
    }
  }
}
\`\`\`

## Graceful Degradation
If a tool fails, the LLM can:
1. **Try alternative tool** - Use a different approach
2. **Request user input** - Ask for manual help
3. **Partial completion** - Return what was accomplished
4. **Clear error message** - Explain what went wrong

## Tool Result Validation
\`\`\`typescript
function validateToolResult(result: any): boolean {
  if (!result.content || result.content.length === 0) {
    return false;
  }
  if (result.isError) {
    return false;
  }
  return true;
}
\`\`\``,
                    },
                ],
                examples: [
                    {
                        language: 'python',
                        description: 'Multi-Step Research Agent',
                        code: `async def research_and_summarize(query: str):
    messages = [{"role": "user", "content": query}]
    
    # Step 1: Search for information
    search_result = await session.call_tool(
        "web_search",
        arguments={"query": query}
    )
    messages.append({
        "role": "assistant",
        "content": f"Found {len(search_result)} articles"
    })
    
    # Step 2: Fetch top articles
    articles = []
    for url in search_result[:3]:
        article = await session.call_tool(
            "fetch_url",
            arguments={"url": url}
        )
        articles.append(article)
    
    # Step 3: Request LLM to synthesize
    synthesis_prompt = f"""
    Analyze these {len(articles)} articles and provide a summary:
    {articles}
    """
    
    final_summary = await llm.complete(synthesis_prompt)
    return final_summary`,
                    },
                ],
            },
        },
    ],
    quiz: {
        id: 'quiz-advanced-patterns',
        stageId: 'advanced-patterns',
        passingThreshold: 0.7,
        questions: [
            {
                id: 'q1',
                prompt: 'Why would an MCP server request sampling from the client?',
                difficulty: 'medium',
                conceptTag: 'sampling',
                correctAnswerId: 'q1-b',
                rationale:
                    'Servers request sampling to leverage the client\'s LLM for intelligent processing, such as analyzing complex data, synthesizing information, or enhancing responses before returning them.',
                options: [
                    {
                        id: 'q1-a',
                        text: 'To train the LLM with new data',
                        isCorrect: false,
                    },
                    {
                        id: 'q1-b',
                        text: 'To get LLM analysis or synthesis of server-side data',
                        isCorrect: true,
                    },
                    {
                        id: 'q1-c',
                        text: 'To update the server\'s capabilities',
                        isCorrect: false,
                    },
                    {
                        id: 'q1-d',
                        text: 'To authenticate the client',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q2',
                prompt: 'What should clients do before executing a sampling request from a server?',
                difficulty: 'medium',
                conceptTag: 'human-in-loop',
                correctAnswerId: 'q2-c',
                rationale:
                    'For security, clients SHOULD present sampling requests to users for approval. This prevents unauthorized LLM usage and gives users control over what information is processed.',
                options: [
                    {
                        id: 'q2-a',
                        text: 'Execute it immediately without delay',
                        isCorrect: false,
                    },
                    {
                        id: 'q2-b',
                        text: 'Cache the request for later',
                        isCorrect: false,
                    },
                    {
                        id: 'q2-c',
                        text: 'Present it to the user for approval',
                        isCorrect: true,
                    },
                    {
                        id: 'q2-d',
                        text: 'Log it and reject it',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q3',
                prompt: 'What do model preference priorities control?',
                difficulty: 'medium',
                conceptTag: 'model-preferences',
                correctAnswerId: 'q3-b',
                rationale:
                    'Model preference priorities (costPriority, speedPriority, intelligencePriority) guide the client\'s model selection by indicating the server\'s preferences for cost, speed, or capability.',
                options: [
                    {
                        id: 'q3-a',
                        text: 'Which tools the LLM can use',
                        isCorrect: false,
                    },
                    {
                        id: 'q3-b',
                        text: 'How the client chooses which LLM model to use',
                        isCorrect: true,
                    },
                    {
                        id: 'q3-c',
                        text: 'The maximum tokens in the response',
                        isCorrect: false,
                    },
                    {
                        id: 'q3-d',
                        text: 'Authentication requirements',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q4',
                prompt: 'How do prompts differ from tools in MCP?',
                difficulty: 'easy',
                conceptTag: 'prompts',
                correctAnswerId: 'q4-a',
                rationale:
                    'Prompts are reusable templates for LLM interactions that format messages, while tools are executable functions that perform actions. Prompts guide the LLM, tools extend its capabilities.',
                options: [
                    {
                        id: 'q4-a',
                        text: 'Prompts are templates for LLM messages, tools are executable functions',
                        isCorrect: true,
                    },
                    {
                        id: 'q4-b',
                        text: 'Prompts require arguments, tools do not',
                        isCorrect: false,
                    },
                    {
                        id: 'q4-c',
                        text: 'Prompts are faster to execute than tools',
                        isCorrect: false,
                    },
                    {
                        id: 'q4-d',
                        text: 'There is no difference',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q5',
                prompt: 'Why is Origin header validation important for HTTP-based MCP servers?',
                difficulty: 'hard',
                conceptTag: 'security',
                correctAnswerId: 'q5-c',
                rationale:
                    'Validating the Origin header prevents DNS rebinding attacks where malicious websites could trick browsers into making requests to your local MCP server.',
                options: [
                    {
                        id: 'q5-a',
                        text: 'It improves performance',
                        isCorrect: false,
                    },
                    {
                        id: 'q5-b',
                        text: 'It helps with caching',
                        isCorrect: false,
                    },
                    {
                        id: 'q5-c',
                        text: 'It prevents DNS rebinding attacks',
                        isCorrect: true,
                    },
                    {
                        id: 'q5-d',
                        text: 'It enables CORS',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q6',
                prompt: 'What is the principle of least privilege in MCP security?',
                difficulty: 'medium',
                conceptTag: 'access-control',
                correctAnswerId: 'q6-b',
                rationale:
                    'The principle of least privilege means only returning the minimum necessary information. This reduces the attack surface and protects sensitive data from unnecessary exposure.',
                options: [
                    {
                        id: 'q6-a',
                        text: 'Give all users maximum permissions',
                        isCorrect: false,
                    },
                    {
                        id: 'q6-b',
                        text: 'Return only the minimum necessary information',
                        isCorrect: true,
                    },
                    {
                        id: 'q6-c',
                        text: 'Use the smallest possible server',
                        isCorrect: false,
                    },
                    {
                        id: 'q6-d',
                        text: 'Minimize the number of tools',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q7',
                prompt: 'In multi-step workflows, why is conversation context important?',
                difficulty: 'medium',
                conceptTag: 'multi-step-workflows',
                correctAnswerId: 'q7-a',
                rationale:
                    'Maintaining conversation context (user messages, tool calls, and results) allows the LLM to make informed decisions at each step based on what happened previously.',
                options: [
                    {
                        id: 'q7-a',
                        text: 'It allows the LLM to make decisions based on previous steps',
                        isCorrect: true,
                    },
                    {
                        id: 'q7-b',
                        text: 'It reduces the number of API calls',
                        isCorrect: false,
                    },
                    {
                        id: 'q7-c',
                        text: 'It makes the workflow run faster',
                        isCorrect: false,
                    },
                    {
                        id: 'q7-d',
                        text: 'It is not important',
                        isCorrect: false,
                    },
                ],
            },
            {
                id: 'q8',
                prompt: 'What should happen when a tool call fails in a multi-step workflow?',
                difficulty: 'hard',
                conceptTag: 'error-handling',
                correctAnswerId: 'q8-c',
                rationale:
                    'When a tool fails, the workflow should implement retry logic with exponential backoff, and if retries fail, allow the LLM to try alternative approaches or gracefully degrade.',
                options: [
                    {
                        id: 'q8-a',
                        text: 'Immediately terminate the entire workflow',
                        isCorrect: false,
                    },
                    {
                        id: 'q8-b',
                        text: 'Silently ignore the failure and continue',
                        isCorrect: false,
                    },
                    {
                        id: 'q8-c',
                        text: 'Retry with backoff, then try alternatives or degrade gracefully',
                        isCorrect: true,
                    },
                    {
                        id: 'q8-d',
                        text: 'Always ask the user to manually fix it',
                        isCorrect: false,
                    },
                ],
            },
        ],
    },
}
