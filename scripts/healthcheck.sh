#!/usr/bin/env bash
# ==============================================================================
# LeadRescue AI — Production Pre-Flight Healthcheck Script
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}       LeadRescue AI — Production Pre-Flight System Diagnostic       ${NC}"
echo -e "${BLUE}==============================================================================${NC}"

ERRORS=0

# 1. Environment Verification
echo -n "Checking Environment Template (.env.example)... "
if [[ -f ".env.example" ]]; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${RED}✗ Missing .env.example${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 2. Database Migrations
echo -n "Checking Database Migrations in supabase/migrations/... "
MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l || echo 0)
if [[ $MIGRATION_COUNT -ge 2 ]]; then
    echo -e "${GREEN}✓ Found ${MIGRATION_COUNT} migrations${NC}"
else
    echo -e "${RED}✗ Expected at least 2 SQL migrations${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 3. Seed SQL
echo -n "Checking Demonstration Seed Data (supabase/seed.sql)... "
if [[ -f "supabase/seed.sql" ]]; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${YELLOW}! Optional seed script not found${NC}"
fi

# 4. TypeScript Type Checking
echo -n "Executing TypeScript Compiler (tsc --noEmit)... "
if pnpm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 0 Type Errors${NC}"
else
    echo -e "${RED}✗ Type errors detected${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 5. Automated Regression Test Suite
echo -n "Running Automated Regression Test Suites... "
TEST_OUTPUT=$(pnpm test 2>&1)
if [[ $? -eq 0 ]]; then
    PASSED_TESTS=$(echo "$TEST_OUTPUT" | grep "pass " | tail -n 1 | awk '{print $2}')
    echo -e "${GREEN}✓ ${PASSED_TESTS} / ${PASSED_TESTS} Tests Passed${NC}"
else
    echo -e "${RED}✗ Test suite failed${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 6. Documentation Suite Check
echo -n "Verifying Operational Documentation... "
DOCS=("README.md" "DEPLOYMENT_GUIDE.md" "PILOT_ONBOARDING_GUIDE.md" "AUDIT_REPORT.md" "IMPLEMENTATION_STATUS.md" "DECISIONS.md" "CHANGELOG.md")
MISSING_DOCS=0
for doc in "${DOCS[@]}"; do
    if [[ ! -f "$doc" ]]; then
        MISSING_DOCS=$((MISSING_DOCS + 1))
    fi
done

if [[ $MISSING_DOCS -eq 0 ]]; then
    echo -e "${GREEN}✓ All 7 Governance Documents Present${NC}"
else
    echo -e "${RED}✗ Missing ${MISSING_DOCS} documentation files${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo -e "${BLUE}==============================================================================${NC}"
if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}🎉 ALL PRE-FLIGHT CHECKS PASSED — READY FOR PRODUCTION PILOT LAUNCH!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  DIAGNOSTIC FOUND ${ERRORS} ISSUE(S). PLEASE RESOLVE BEFORE DEPLOYMENT.${NC}"
    exit 1
fi
