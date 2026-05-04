# Audit Round 2 — Vultr Server Deploy Environment Audit

**Date:** 2026-05-02
**Server:** 158.247.252.172 (Vultr, Ubuntu 22.04)
**Target:** autonomous.fazr.co.kr (Next.js web)
**Scope:** audit-only, no server changes made

---

## 1. Caddyfile Structure

### Location

- **Host path:** `/opt/apps-newsforgreens/Caddyfile`
- **Container mount:** `apps_ng_caddy` container mounts it as `/etc/caddy/Caddyfile:ro`
- **No import/include** directives — single flat file
- **TLS:** Caddy automatic HTTPS (default). No manual cert configuration. Caddy auto-provisions Let's Encrypt certs per domain block.

### Full content (sensitive values masked)

```caddyfile
apps.newsforgreens.com {
    encode gzip zstd

    @admin path /admin*
    @apiadmin path /api/admin*

    handle @admin {
        basic_auth {
            admin $2a$14$******
        }
        reverse_proxy web:3000
    }

    handle @apiadmin {
        reverse_proxy web:3000
    }

    handle {
        reverse_proxy web:3000
    }

    @static path /_next/static/*
    @reviews path /app/*/reviews* /api/reviews*
    @dynamic path /app/* /api/*

    header @static {
        Cache-Control "public, max-age=31536000, immutable"
    }
    header @reviews {
        Cache-Control "no-store, no-cache, must-revalidate"
    }
    header @dynamic {
        Cache-Control "no-store, no-cache, must-revalidate"
    }

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}

debt.newsforgreens.com {
    encode gzip zstd
    reverse_proxy debt-workbench-web:3000

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}

vat.newsforgreens.com {
    encode gzip zstd
    reverse_proxy vat_web:3000
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}

calc.fazr.co.kr {
    encode gzip
    reverse_proxy calc_fazr_web:3000
}
```

### Domain routing summary

| Domain | reverse_proxy target | Notes |
|--------|---------------------|-------|
| apps.newsforgreens.com | `web:3000` (= apps_ng_web) | Main app, admin basic_auth |
| debt.newsforgreens.com | `debt-workbench-web:3000` | |
| vat.newsforgreens.com | `vat_web:3000` | |
| calc.fazr.co.kr | `calc_fazr_web:3000` | Simplest config |

**Key observation:** `calc.fazr.co.kr` is already on the `fazr.co.kr` domain — same domain family as `autonomous.fazr.co.kr`. Proves the Caddy + Cloudflare setup works for `*.fazr.co.kr` subdomains.

---

## 2. Docker Container Status

### All containers (docker ps -a)

| Container | Image | Status | Ports | Created |
|-----------|-------|--------|-------|---------|
| calc_fazr_web | calc-fazr-calc_fazr_web | Up 13 days | 3000/tcp (internal only) | 2026-04-18 |
| dustfazr_db | postgres:16-alpine | Up 6 weeks | 0.0.0.0:5433->5432/tcp | 2026-03-21 |
| apps_ng_web | apps-newsforgreens-web | Up 8 weeks | 127.0.0.1:3000->3000/tcp | 2026-03-02 |
| vat_web | vat-workbench-vat_web | Up 2 months (healthy) | 3000/tcp (internal only) | 2026-03-02 |
| debt-workbench-web | debt-workbench-debt_web | Up 2 months | 3000/tcp (internal only) | 2026-02-22 |
| debt-workbench-db | postgres:16-alpine | Up 3 months (healthy) | 5432/tcp (internal only) | 2026-01-15 |
| apps_ng_caddy | caddy:2-alpine | Up 2 months | 80, 443, 2019/tcp | 2025-12-24 |
| apps_ng_db | postgres:16-alpine | Up 4 months (healthy) | 127.0.0.1:5432->5432/tcp | 2025-12-24 |

**No stopped/dead containers.** All 8 are running.

### Docker Compose project mapping

| Project | Compose file | Containers | Domain |
|---------|-------------|------------|--------|
| apps-newsforgreens | `/opt/apps-newsforgreens/docker-compose.yml` | apps_ng_web, apps_ng_db, apps_ng_caddy | apps.newsforgreens.com |
| debt-workbench | `/opt/debt-workbench/docker-compose.yml` | debt-workbench-web, debt-workbench-db | debt.newsforgreens.com |
| vat-workbench | `/opt/vat-workbench/docker-compose.yml` | vat_web | vat.newsforgreens.com |
| calc-fazr | `/opt/calc-fazr/docker-compose.yml` | calc_fazr_web | calc.fazr.co.kr |
| dustfazr (standalone) | No compose file found | dustfazr_db | No web domain (DB only, port 5433) |

**Note:** `dustfazr_db` runs on the default `bridge` network, separate from other services. It has a compose collector script at `/root/dust-fazr/collector/` but no compose file — likely started with `docker run` directly.

---

## 3. Docker Network Structure

### Networks

| Network | Driver | Containers |
|---------|--------|------------|
| **apps-newsforgreens_default** | bridge | apps_ng_caddy, apps_ng_web, apps_ng_db, debt-workbench-web, debt-workbench-db, vat_web, calc_fazr_web |
| bridge | bridge | dustfazr_db |
| host | host | (none) |
| none | null | (none) |

### Analysis

- **Single shared network:** All web services + Caddy are on `apps-newsforgreens_default`. This is the only network that matters.
- **Caddy resolves container names** as DNS within this network (e.g., `web:3000` resolves to apps_ng_web, `calc_fazr_web:3000` resolves to calc_fazr_web).
- **Pattern for new projects:** Join `apps-newsforgreens_default` as external network. This is what calc-fazr, debt-workbench, and vat-workbench all do.

### Container name collision check

Candidate names for Seoul Autonomous:

| Candidate | Collision? |
|-----------|-----------|
| `seoul_autonomous_web` | No conflict |
| `autonomous_web` | No conflict |
| `sa_web` | No conflict |

**Recommendation:** `seoul_autonomous_web` — descriptive, follows existing `calc_fazr_web` naming pattern.

---

## 4. Port Usage

### Host-level listening ports

| Port | Process | Container/Service |
|------|---------|-------------------|
| 22 | sshd | SSH |
| 53 | systemd-resolve | DNS resolver (loopback) |
| 80 | docker-proxy | apps_ng_caddy (HTTP) |
| 443 | docker-proxy | apps_ng_caddy (HTTPS) |
| 3000 | docker-proxy | apps_ng_web (127.0.0.1 only) |
| 5050 | python3 | Unknown script (host-level) |
| 5432 | docker-proxy | apps_ng_db (127.0.0.1 only) |
| 5433 | docker-proxy | dustfazr_db (0.0.0.0) |

### Internal port 3000 analysis

All Next.js containers use internal port 3000, but this does NOT conflict because:
- Most containers only `expose: "3000"` (Docker-internal, no host binding)
- Only `apps_ng_web` binds to host `127.0.0.1:3000`
- Caddy routes to containers by name within the Docker network, not by host port

**Seoul Autonomous web container:** Can safely use internal port 3000 with `expose: "3000"` (no host port binding needed). Caddy will route to it by container name.

---

## 5. DNS Status: autonomous.fazr.co.kr

### Current state

```
$ nslookup autonomous.fazr.co.kr
** server can't find autonomous.fazr.co.kr: NXDOMAIN
```

**DNS record does NOT exist yet.** `autonomous.fazr.co.kr` is not configured in Cloudflare.

### Required action (next round)

Add a Cloudflare DNS A record:
- **Type:** A
- **Name:** autonomous
- **Value:** 158.247.252.172
- **Proxy:** Orange cloud ON (proxied) — consistent with other fazr.co.kr subdomains
- **TTL:** Auto (when proxied)

**Note:** `calc.fazr.co.kr` already works on this server, confirming Cloudflare -> Vultr -> Caddy pipeline is functional for `*.fazr.co.kr`.

---

## 6. Cloudflare WAF Impact

### Available information

Cloudflare WAF details require dashboard access. Based on the existing `calc.fazr.co.kr` deployment:

- **calc.fazr.co.kr is running successfully** with Caddy automatic HTTPS behind Cloudflare proxy — no WAF blocking observed for that subdomain.
- Caddy's Caddyfile for `calc.fazr.co.kr` is the simplest config (no special headers). If calc works, autonomous should work with the same setup.

### Potential concerns for Next.js static site

| Concern | Risk | Mitigation |
|---------|------|------------|
| `/_next/static/*` blocked by WAF | Low — calc.fazr.co.kr serves Next.js static assets fine | None needed |
| Bot Fight Mode blocking crawlers | Low | If needed, create a WAF exception for autonomous.* |
| Rate Limiting on page loads | Very low — static site, minimal API calls | None needed |
| Cloudflare caching vs Next.js cache | Medium — double caching possible | Add `Cache-Control` headers in Caddyfile |

### What needs Fogrin's confirmation

1. Are there custom WAF rules on `fazr.co.kr` that might block subdomains?
2. Is Bot Fight Mode enabled? (affects SEO crawlers)
3. Any Page Rules or Transform Rules on `*.fazr.co.kr`?

**Verdict:** Likely safe — calc.fazr.co.kr proves the path works. Confirm WAF rules with Fogrin if issues arise post-deploy.

---

## 7. Deployment Plan Proposal

### Host directory

```
/opt/seoul-autonomous/
```

Follows existing convention: `/opt/calc-fazr/`, `/opt/debt-workbench/`, `/opt/vat-workbench/`.

### docker-compose.yml (draft)

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: seoul_autonomous_web
    restart: unless-stopped
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
    networks:
      - apps_ng_net

networks:
  apps_ng_net:
    external: true
    name: apps-newsforgreens_default
```

**Pattern:** Matches `calc-fazr/docker-compose.yml` exactly. No DB needed (static data from routes.json). Minimal config.

### Caddyfile addition (draft, NOT applied)

```caddyfile
autonomous.fazr.co.kr {
    encode gzip zstd
    reverse_proxy seoul_autonomous_web:3000

    @static path /_next/static/*
    header @static {
        Cache-Control "public, max-age=31536000, immutable"
    }

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}
```

**Notes:**
- Append to existing Caddyfile at `/opt/apps-newsforgreens/Caddyfile`
- After editing, reload Caddy: `docker exec apps_ng_caddy caddy reload --config /etc/caddy/Caddyfile`
- Static asset caching header included (same pattern as apps.newsforgreens.com)

### Build strategy

**Recommended: Multi-stage Dockerfile (build on server)**

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Uses Next.js `output: 'standalone'` for minimal production image (~150MB).

### Disk usage estimate

| Item | Size |
|------|------|
| Source code + node_modules (build stage) | ~500MB (temporary) |
| Final Docker image | ~150MB |
| Build cache (future builds) | ~200MB |
| **Total permanent** | **~350MB** |
| **Available** | **46GB** |

No disk concerns whatsoever.

### Deployment sequence (for next round)

```
1. Cloudflare: Add A record for autonomous.fazr.co.kr -> 158.247.252.172
2. Server: mkdir /opt/seoul-autonomous && clone repo
3. Server: Create Dockerfile + docker-compose.yml
4. Server: docker compose up -d --build
5. Server: Append to Caddyfile + caddy reload
6. Verify: curl https://autonomous.fazr.co.kr
```

---

## Appendix: Server state change report

**No server state changes were made during this audit.**
- No containers started, stopped, or removed
- No files created, modified, or deleted on the server
- No DNS records changed
- No packages installed
- All commands were read-only (docker ps, docker network ls, docker inspect, cat, ls, ss)
