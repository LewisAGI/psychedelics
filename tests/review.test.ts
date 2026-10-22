import ci from '../.github/workflows/ci.yml?raw';
import headers from '../public/_headers?raw';
import { describe, expect, it } from 'vitest';

describe('review fixes', () => {
  it('publishes CSP, nosniff, and a referrer policy', () => {
    const policies = headers.split('\n').filter((line) => line.includes('Content-Security-Policy'));
    expect(policies).toHaveLength(1);
    expect(policies[0]).toContain("default-src 'self'");
    expect(policies[0]).toContain("script-src 'self'");
    expect(policies[0]).toContain("connect-src 'self' https://gibs.earthdata.nasa.gov");
    expect(policies[0]).toContain("object-src 'none'");
    expect(policies[0]).toContain("base-uri 'none'");
    expect(policies[0]).toContain("frame-ancestors 'none'");
    expect(policies[0]).toContain("worker-src 'self' blob:");
    expect(headers).toContain('X-Content-Type-Options: nosniff');
    expect(headers).toContain('Referrer-Policy: no-referrer');
  });

  it('pins CI actions and drops the npm cache', () => {
    expect(ci).toMatch(/permissions:\s+contents:\s+read/);
    expect(ci).not.toMatch(/cache:\s*npm/);
    expect(ci).not.toMatch(/uses:\s+actions\/checkout@v/);
    expect(ci).not.toMatch(/uses:\s+actions\/setup-node@v/);
    expect(ci).toMatch(/uses: actions\/checkout@[0-9a-f]{40}/);
    expect(ci).toMatch(/uses: actions\/setup-node@[0-9a-f]{40}/);
  });
});
