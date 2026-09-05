# Rosarium website

The public landing page for [Rosarium](https://rosariumprayer.com), a Catholic prayer app.
This repository contains only the website. The native apps and shared prayer engine are
maintained separately in the private `brantlymillegan/rosarium` repository.

## Local preview

Use Node.js 22.13 or newer:

```sh
npm ci
npm run dev
```

Open <http://localhost:3000/>. Build the static site with `npm run build`;
the publishable output is `dist/client/`.

## Publishing

Pushing to `main` builds and deploys the static site through GitHub Actions to GitHub Pages.
The workflow can also be started manually from the Actions tab. Only the public static
output is deployed; no server, database, or paid runner is required.

In **Settings → Pages**, use **GitHub Actions** as the source and
`rosariumprayer.com` as the custom domain. With an Actions deployment, the custom domain
is configured in GitHub Pages settings, not in a source `CNAME` file.

## Connecting the domain

At the domain's DNS provider, replace the existing apex parking records with these
four records and update the `www` CNAME:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `brantlymillegan.github.io` |

Preserve unrelated email, MX, TXT, and other DNS records. Do not add a wildcard record.
GitHub will redirect `www.rosariumprayer.com` to the apex domain. DNS propagation can
take up to 24 hours. Once GitHub's DNS check and certificate provisioning complete,
enable **Enforce HTTPS** in the repository's Pages settings.

For additional takeover protection, verify the domain under personal GitHub
**Settings → Pages → Add a domain** using the unique TXT record GitHub provides.
Keep that TXT record after verification.

References: [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site),
[HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https),
[domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
