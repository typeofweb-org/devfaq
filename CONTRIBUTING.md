# Contributing to DevFAQ

🎉 Thanks for willing to contribute! 🎉

**Working on your first Pull Request?** You can learn how from this free videos [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

## Introduction

DevFAQ is organised into a monorepo with Turborepo. You'll find frontend ([app](./apps/app)) and backend ([api](./apps/api)) in the [apps](./apps) directory.

- Frontend is written in **Next.js (React) with TypeScript**.
- Backend is a REST API, and uses **Fastify, PostgreSQL, and TypeScript**.

## Project setup

0. Make sure you have Docker installed and `docker compose` command is available.
1. Fork and clone the repo. `develop` is the default branch and you should base your work off of it.
2. Run `pnpm install` inside the repo to install all the dependencies.
3. Run `pnpm dev` to start both frontend and backend locally.
4. In order for everything to work smoothly, you'll need to add two entries to your `/etc/hosts`. See [Configuring localhost domain](#configuring-localhost-domain) section.
5. Remember to add `.env*` files to each app located in `apps` directory. For `apps/api` it will be `.env` - example file with variables is named `.env-example` and you can find it in `apps/api`. For `apps/app`, example env file is named `.env.local-example` and it is located in `apps/app`.

### Configuring localhost domain

DevFAQ uses cookies for storing the session token. The cookie is `httpOnly`, `secure` (on production) and `sameSite=Lax` which means you'll need to run frontend and backend on the same domain for it to work. To do it locally, add the following lines to your `/etc/hosts`:

```
127.0.0.1 api.devfaq.localhost
127.0.0.1 app.devfaq.localhost
```

Now you should be able to access your app at [app.devfaq.localhost:3000](http://app.devfaq.localhost:3000) and the API at [api.devfaq.localhost:3002/](http://api.devfaq.localhost:3002/).

## Running tests

There are only a few tests and we definitely need more! To run all tests execute the following command:

```
pnpm test
```

If you need to run only www or only api tests, you can do it as follows:

```
pnpm test --filter=www
pnpm test --filter=api
```

## Creating a PR

After you're done modifying the codebase, push the changes to your fork, and create a PR against the `develop` branch in this repo. Once you do that, several tests will be run automatically which help us with the review process. Read the output from the [TypeOfWebBot](https://github.com/TypeOfWebBot) carefully 😊

Once merged, the app will be automatically deployed to [staging.devfaq.pl](https://staging.devfaq.pl). A release to production ([app.devfaq.pl](https://app.devfaq.pl)) will be done manually by one of the codeowners.

## Help needed

Please check out [the open issues](https://github.com/typeofweb/devfaq/issues).

If you have **any suggestions** or found any bugs, don't hesitate to report them!

❤️ ❤️ ❤️ **Thank you!** ❤️ ❤️ ❤️
