# Azure Deployment Plan

> **Status:** Deployed

Generated: 2026-09-22

---

## 1. Project Overview

**Goal:** Deploy the Academia Georgetown static site and its form API to Azure, with every related service in resource group `AcademiaGeorgetown`.

**Path:** Modernize Existing

---

## 2. Requirements

| Attribute | Value |
|-----------|-------|
| Classification | Production |
| Scale | Small |
| Budget | Cost-Optimized |
| **Subscription** | pec (`48b4280a-bb5c-4417-8bd6-5ec4268f5594`) |
| **Location** | westeurope |

---

## 3. Components Detected

| Component | Type | Technology | Path |
|-----------|------|------------|------|
| Public site | Frontend | Astro 7 static | `/` |
| Lead form API | API | Azure Functions v3 model, Node 22 | `api/` |

---

## 4. Recipe Selection

**Selected:** AZCLI

**Rationale:** The site is a static Astro build plus one HTTP function. Static Web Apps already matches that shape, so the deployment is the resource group, the Static Web App, and Communication Services email.

---

## 5. Architecture

**Stack:** App Service (Static Web Apps)

### Service Mapping

| Component | Azure Service | SKU | Name |
|-----------|---------------|-----|------|
| Static site + managed Function | Static Web Apps | Free | `academiageorgetown` |
| Transactional email | Communication Services | — | `academiageorgetown-acs` |
| Email domain | Email Communication Services | Azure managed domain | `academiageorgetown-email` |

### Supporting Services

| Service | Purpose |
|---------|---------|
| Resource group `AcademiaGeorgetown` | Single boundary for every web-related service |

**Hostname:** https://ambitious-sky-01938c103.6.azurestaticapps.net

---

## 6. Provisioning Limit Checklist

| Resource Type | Number to Deploy | Total After Deployment | Limit/Quota | Notes |
|---------------|------------------|------------------------|-------------|-------|
| Microsoft.Resources/resourceGroups | 1 | 1 new group | 980 per subscription | Created `AcademiaGeorgetown` |
| Microsoft.Web/staticSites | 1 | 1 in subscription | 10 Free per subscription | Created. No prior Static Web Apps. |
| Microsoft.Communication/communicationServices | 1 | 1 | 100+ per subscription | Created |
| Microsoft.Communication/emailServices | 1 | 1 | Service limit allows this single email resource | Created with a verified Azure-managed domain |

**Status:** All resources created in West Europe, with Communication Services data stored in Europe.

---

## 7. Execution Checklist

### Phase 2: Execution

- [x] Create resource group `AcademiaGeorgetown`
- [x] Create Static Web App
- [x] Create Communication Services email
- [x] Build and deploy the site and API
- [x] Configure runtime application settings
