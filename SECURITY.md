# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to security@kevasiya.com

## Security Measures

### Authentication
- JWT-based authentication
- Rate limiting on login endpoints (10 requests/15 min)
- CSRF protection enabled

### Data Protection
- Database credentials stored in environment variables
- Passwords hashed with bcrypt
- Sensitive data never logged

### API Security
- Rate limiting (100 requests/15 min)
- Input validation and sanitization
- Path traversal protection

### Container Security
- Containers run as non-root user
- Read-only filesystem where possible
- No new privileges flag
- Custom seccomp profile
- Isolated Docker networks
- Resource limits (CPU/memory)

### Network Security
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- SSL/TLS encryption
- Internal database networking

### Dependencies
- Regular security scanning with Trivy
- Semgrep code analysis
- npm audit monitoring
- Automated dependency updates

## Incident Response

1. **Detection**: Automated monitoring and alerts
2. **Analysis**: Assess severity and impact
3. **Containment**: Isolate affected systems
4. **Remediation**: Apply patches/fixes
5. **Recovery**: Restore services
6. **Post-incident**: Review and improve

## Compliance

- HTTPS enforced in production
- GDPR-compliant data handling
- Regular security audits
- Secure backup procedures
