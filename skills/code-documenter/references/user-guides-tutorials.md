---
render_with_liquid: false
---

---

### "Rate limit exceeded"

**Symptoms:**
- 429 Too Many Requests error
- Requests failing intermittently

**Immediate fix:**
Wait 60 seconds and retry.

**Long-term solutions:**

**1. Implement exponential backoff:**
```typescript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
      throw error;
    }
  }
}
```

**2. Batch requests:**
Instead of 100 individual requests, use batch endpoints.

**3. Upgrade your plan:**
[View plans](/pricing) - Higher tiers have increased limits.
```

## FAQ Section

```markdown
# Frequently Asked Questions

## General

### What's included in the free tier?
- 1,000 API requests/month
- 1GB storage
- Community support
- All core features

### How do I upgrade?
Click "Upgrade" in your [dashboard](/dashboard) and select a plan.

## Technical

### Can I use this in production?
Yes, the API is production-ready with 99.9% SLA on paid plans.

### What's the rate limit?
- Free: 10 requests/minute
- Pro: 100 requests/minute
- Enterprise: Custom limits

### Do you support webhooks?
Yes! See [Webhooks Guide](/guides/webhooks) for setup.

### Which regions are available?
Currently: US East, US West, EU Central, Asia Pacific.

## Billing

### How does billing work?
- Monthly subscription
- Pay-as-you-go for overages
- Cancel anytime

### What payment methods do you accept?
Credit card, PayPal, wire transfer (annual plans only).

---
{% raw %}


**Can't find your answer?**
- [Browse all docs](/docs)
- [Ask the community](https://community.example.com)
- [Contact support](/support)
```

## Quick Reference

| Content Type | Best For | Key Elements |
|-------------|----------|-------------|
| Quick Start | New users (5 min) | Prerequisites, minimal code, verify |
| Tutorial | Learning by doing | Steps, checkpoints, working code |
| How-To Guide | Specific tasks | Goal, steps, troubleshooting |
| Reference | Looking up details | Comprehensive, searchable |
| Explanation | Understanding concepts | Why, not how |

| Writing Principle | Technique |
|------------------|-----------|
| Clarity | Active voice, short sentences |
| Scannability | Headings, lists, code blocks |
| Completeness | Prerequisites, next steps, related links |
| Accuracy | Test all code, version specifics |

{% endraw %}
