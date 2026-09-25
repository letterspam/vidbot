# SECURITY.md

## Scope

vidbot handles two sensitive input classes:

1. Discord account credentials.
2. User-provided remote media URLs.

Treat both as untrusted/sensitive data.

## Discord user tokens

Never commit a Discord user token.

Use a protected environment variable or local secret store:

~~~
DISCORD_USER_TOKEN=your-token-here
~~~

Never log the value or place it in source, test fixtures, issues, screenshots, CI output, or shell history examples.

If a token is exposed, revoke/rotate it immediately.

## Remote URLs

Media URLs can contain private or temporary credentials. Avoid logging full URLs.

Prefer logging:

- provider;
- hostname;
- redacted identifier;
- request status;
- duration.

Do not log signed query strings, access tokens, cookies, or authorization headers.

## Downloads

Treat remote media as untrusted.

Use:

- request timeouts;
- redirect limits;
- maximum sizes where practical;
- safe temporary directories;
- cleanup on cancellation;
- content-type sanity checks.

Do not trust a remote filename.

## FFmpeg

Never construct a shell command by concatenating user-controlled input.

Use structured process arguments and validate provider-generated URLs before passing them to the media pipeline.

## Reporting

Do not publish credentials or private URLs in GitHub issues.

If a secret was committed, remove it from history where appropriate and rotate it immediately. Removing it from Git history does not make the old credential safe again.
