#!/bin/bash

# ============================================
# OCC MeritTrack - Pre-Push Security Check
# ============================================
# Run this script before pushing to GitHub
# Usage: chmod +x check-security.sh && ./check-security.sh

echo "🔍 Running Security Checks..."
echo "================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ISSUES_FOUND=0

# ============================================
# 1. Check for .env files in git
# ============================================
echo "📁 Checking for .env files..."
if git ls-files | grep -q "\.env$"; then
    echo -e "${RED}❌ DANGER: .env files are tracked by git!${NC}"
    echo "   Files found:"
    git ls-files | grep "\.env$"
    echo ""
    echo "   Fix with: git rm --cached .env backend/.env"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ No .env files tracked${NC}"
fi
echo ""

# ============================================
# 2. Check for node_modules
# ============================================
echo "📦 Checking for node_modules..."
if git ls-files | grep -q "node_modules/"; then
    echo -e "${RED}❌ WARNING: node_modules is tracked by git!${NC}"
    echo "   Fix with: git rm -r --cached node_modules"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ node_modules not tracked${NC}"
fi
echo ""

# ============================================
# 3. Check for common secrets in files
# ============================================
echo "🔐 Scanning for potential secrets in staged files..."
SECRETS_FOUND=0

# Check for MongoDB connection strings
if git diff --cached | grep -i "mongodb+srv://" | grep -v ".env.example" > /dev/null; then
    echo -e "${RED}❌ MongoDB connection string found in staged files!${NC}"
    SECRETS_FOUND=$((SECRETS_FOUND + 1))
fi

# Check for JWT secrets (but not in .env.example)
if git diff --cached | grep -i "JWT_SECRET.*=.*[a-f0-9]\{32,\}" | grep -v ".env.example" > /dev/null; then
    echo -e "${RED}❌ Potential JWT secret found in staged files!${NC}"
    SECRETS_FOUND=$((SECRETS_FOUND + 1))
fi

# Check for API keys
if git diff --cached | grep -iE "(api_key|apikey|api-key).*=.*['\"][a-zA-Z0-9]{20,}" | grep -v ".env.example" > /dev/null; then
    echo -e "${RED}❌ Potential API key found in staged files!${NC}"
    SECRETS_FOUND=$((SECRETS_FOUND + 1))
fi

if [ $SECRETS_FOUND -gt 0 ]; then
    echo -e "${RED}❌ Found $SECRETS_FOUND potential secret(s) in staged files!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + SECRETS_FOUND))
else
    echo -e "${GREEN}✅ No obvious secrets detected${NC}"
fi
echo ""

# ============================================
# 4. Check .gitignore exists
# ============================================
echo "📋 Checking .gitignore configuration..."
if [ ! -f ".gitignore" ]; then
    echo -e "${RED}❌ .gitignore file not found!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    # Check if .env is in .gitignore
    if ! grep -q "^\.env$" .gitignore; then
        echo -e "${YELLOW}⚠️  .env not found in .gitignore${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo -e "${GREEN}✅ .gitignore properly configured${NC}"
    fi
fi
echo ""

# ============================================
# 5. Check for large files
# ============================================
echo "📊 Checking for large files..."
LARGE_FILES=$(git diff --cached --name-only | xargs -I {} du -h {} 2>/dev/null | awk '$1 ~ /^[0-9]+M$/ {print}')
if [ ! -z "$LARGE_FILES" ]; then
    echo -e "${YELLOW}⚠️  Large files detected:${NC}"
    echo "$LARGE_FILES"
    echo "   Consider using Git LFS for large files"
else
    echo -e "${GREEN}✅ No large files detected${NC}"
fi
echo ""

# ============================================
# 6. Check npm audit (if package.json exists)
# ============================================
if [ -f "package.json" ]; then
    echo "🔒 Running npm security audit..."
    npm audit --audit-level=moderate > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ No moderate or higher vulnerabilities found${NC}"
    else
        echo -e "${YELLOW}⚠️  Some vulnerabilities detected. Run 'npm audit' for details${NC}"
    fi
    echo ""
fi

# ============================================
# 7. Final Summary
# ============================================
echo "================================"
echo "📋 Security Check Summary"
echo "================================"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Safe to push.${NC}"
    echo ""
    echo "Run: git push origin main"
    exit 0
else
    echo -e "${RED}❌ Found $ISSUES_FOUND issue(s). Please fix before pushing!${NC}"
    echo ""
    echo "Common fixes:"
    echo "  1. Remove .env from tracking: git rm --cached .env backend/.env"
    echo "  2. Update .gitignore and commit changes"
    echo "  3. Remove secrets from code"
    echo ""
    exit 1
fi
