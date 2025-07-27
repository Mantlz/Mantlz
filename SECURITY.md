# Security Policy

## Reporting Security Vulnerabilities

We take the security of Mantlz seriously. If you discover a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

## How to Report a Security Vulnerability

To report a security vulnerability, please email us at:

**security@mantlz.com**

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

## Response Timeline

We will acknowledge receipt of your vulnerability report within 48 hours and will send you regular updates about our progress. If you have not received a response to your email within 48 hours, please follow up to ensure we received your original message.

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all releases still under maintenance
4. Release new versions as soon as possible

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Security Best Practices

When using Mantlz, we recommend:

- Keep your dependencies up to date
- Use environment variables for sensitive configuration
- Implement proper input validation
- Use HTTPS in production
- Regularly review and rotate API keys
- Follow the principle of least privilege for database access

## Bug Bounty Program

We currently do not have a formal bug bounty program, but we greatly appreciate security researchers who responsibly disclose vulnerabilities to us.

## Contact

For any questions about this security policy, please contact us at security@mantlz.com.