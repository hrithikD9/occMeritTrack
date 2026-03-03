# 🔒 Security Guidelines

## ⚠️ CRITICAL - Before Pushing to GitHub

### 1. **Environment Variables**
**NEVER commit these files:**
- ❌ `.env` (backend)
- ❌ `.env` (frontend)
- ✅ Only commit `.env.example` files

**Verify before pushing:**
```bash
# Check if .env is being tracked
git status

# If .env appears, it's NOT in .gitignore correctly
# Remove it from git tracking (DON'T delete the file):
git rm --cached .env
git rm --cached backend/.env
```

---

## 🛡️ What's Protected

### Sensitive Data in `.env` Files
- **MongoDB Connection String** - Contains database credentials
- **JWT Secret Key** - Used for authentication tokens
- **Teacher Passkey** - Access control password
- **API Keys** - Third-party service credentials (if added)

---

## ✅ Security Checklist Before GitHub Push

- [ ] Run `git status` to check tracked files
- [ ] Verify `.env` files are NOT listed
- [ ] Check `.gitignore` is properly configured
- [ ] Ensure backend `.env` contains actual secrets (not example values)
- [ ] Verify `node_modules/` is ignored
- [ ] Check no log files are being committed

---

## 🔐 Production Deployment Security

### 1. **Generate Secure JWT Secret**
```bash
# Use Node.js to generate a cryptographically secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **Change Default Passkey**
- Default: `OCC2026`
- Change to a strong password for production

### 3. **MongoDB Atlas Security**
- ✅ Enable IP whitelist
- ✅ Use strong database passwords
- ✅ Enable connection encryption
- ✅ Rotate credentials regularly

### 4. **API Security**
- ✅ Enable CORS only for trusted domains
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Keep dependencies updated

---

## 🚨 If Secrets Are Accidentally Committed

### Immediate Actions:

1. **Rotate All Credentials Immediately**
   - Generate new MongoDB connection string
   - Generate new JWT secret
   - Change teacher passkey

2. **Remove from Git History**
   ```bash
   # Using git filter-branch (use with caution)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (only if repository is private or not yet pushed)
   git push origin --force --all
   ```

3. **Alternative: Use BFG Repo-Cleaner**
   ```bash
   # Install BFG (https://rtyley.github.io/bfg-repo-cleaner/)
   bfg --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

4. **Report & Monitor**
   - Check GitHub for any commits containing secrets
   - Monitor database access logs
   - Consider the repository compromised until all secrets are rotated

---

## 📋 Safe Sharing Guidelines

### What You CAN Share Publicly:
- ✅ Source code (without credentials)
- ✅ `.env.example` files
- ✅ Documentation and README
- ✅ Package.json files
- ✅ Configuration files (without secrets)

### What You MUST NOT Share:
- ❌ `.env` files with real credentials
- ❌ Database connection strings
- ❌ API keys and secrets
- ❌ Private keys/certificates
- ❌ Authentication tokens

---

## 🔍 Regular Security Audits

### Weekly:
- Review access logs
- Check for unauthorized access
- Update dependencies: `npm audit fix`

### Monthly:
- Rotate JWT secrets
- Review and remove unused accounts
- Check MongoDB Atlas security settings

### Before Each Release:
- Run security audit: `npm audit`
- Test authentication flows
- Verify all secrets are properly hidden
- Check CORS configuration

---

## 📞 Security Contact

If you discover a security vulnerability:
1. **DO NOT** create a public GitHub issue
2. Report privately to the repository maintainer
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

---

## 🛠️ Recommended Tools

- **Git-secrets**: Prevents committing secrets
- **TruffleHog**: Scans for secrets in git history
- **npm audit**: Checks for vulnerable dependencies
- **Snyk**: Continuous security monitoring

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
