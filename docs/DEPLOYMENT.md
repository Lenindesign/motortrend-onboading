# Deployment

This project deploys to Netlify through the GitHub repository connected to the
Netlify site. Sites publishing is intentionally not part of this workflow.

Run the harness without publishing to verify the production build:

```bash
npm run deploy:netlify
```

When the branch is ready and the GitHub-connected Netlify deploy should be
triggered, opt into the push explicitly:

```bash
npm run deploy:netlify -- --push
```

The harness checks that `netlify.toml` exists, confirms that `origin` points to
GitHub, builds `dist`, and only then pushes the current `HEAD`. It never calls
Sites APIs or publishes directly to a hosting provider.
