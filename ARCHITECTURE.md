# Architecture Overview

This document outlines how the Journal Analyzer application can be scaled, optimized, and secured.

## 1. How would you scale this to 100k users?

### Backend
- **Horizontal scaling:** Run multiple Node/Express instances behind a load balancer (e.g., AWS ALB, NGINX) to distribute traffic.
- **Stateless services:** Keep the API stateless by storing session/auth in a shared cache (e.g., Redis) rather than in-process memory.
- **Database scaling:** Use a managed database service (e.g., MongoDB Atlas, AWS RDS). Enable replication, sharding, and read replicas to handle increased load.
- **Background processing:** Offload heavy tasks (e.g., LLM analysis, batch exports) to worker processes with a queue system (e.g., Redis Streams, AWS SQS).

### Frontend
- **CDN distribution:** Deploy static assets via a CDN (e.g., Vercel, Netlify, Cloudflare) for global edge delivery.
- **Asset caching:** Use long cache TTLs and cache-busting versioning for JS/CSS bundles.

## 2. How would you reduce LLM cost?

- **Model selection:** Use the smallest model that meets quality needs (e.g., a specialized embeddings/analysis model rather than a full chat model).
- **Prompt efficiency:** Only send the minimal required text (e.g., the specific journal entry) and avoid redundant context.
- **Batching:** Combine multiple analyses into a single request when appropriate.
- **Result caching:** Reuse prior analysis results (see section 3) instead of re-calling the model.
- **Fallback logic:** Use lightweight local heuristics for simple analysis and reserve LLM calls for complex insights.

## 3. How would you cache repeated analysis?

- **Cache key design:** Generate a key from a stable fingerprint of the journal entry (e.g., SHA-256 of entry text + analysis type).
- **Cache store:** Use Redis for fast lookups and/or persist cached results in the database for longer retention.
- **Invalidation:** Invalidate cache when an entry is updated or deleted. Use versioned keys or a last-modified timestamp.
- **Tiered caching:** Keep the most recent or most-requested analyses in an in-memory cache, and fall back to slower storage for less common requests.

## 4. How would you protect sensitive journal data?

- **Encryption in transit:** Enforce HTTPS/TLS for all client-server and backend-service communication.
- **Encryption at rest:** Encrypt database storage using built-in provider features (e.g., AWS KMS encryption, MongoDB encryption at rest) or field-level encryption for journal content.
- **Authentication & authorization:** Require login and ensure users can only access their own journal entries (e.g., use user IDs in database queries and validate tokens).
- **Secret management:** Store API keys, database credentials, and other secrets in a secure store (e.g., AWS Secrets Manager, environment variables with restricted access).
- **Least privilege:** Limit access rights for the app, database users, and third-party integrations to only what is needed.
- **Auditing/logging:** Log access events and failures without logging full journal content; monitor for suspicious access patterns.
- **Data retention & deletion:** Provide users a way to delete data and ensure deletion propagates to backups and caches.
