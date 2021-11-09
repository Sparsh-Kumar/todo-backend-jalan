# Backend (Boilerplate)

## Dev setup
### Running Locally
In order to run the project locally, you need few keys in order for 3rd party services to run. Since the keys are sensitive, they are not checked into the code.

1. Install dependencies: `npm i`
2. Reach out to your team member for `local.json` (which has sensitive keys) and drop it into `config` folder
3. Start the server: `npm run serve`

### Contributing
#### Development Workflow
We use [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) branching model to build and release the software. [Hubflow](https://datasift.github.io/gitflow/) are a set of helper scripts that makes it easy to follow with `Gitflow` branching model.

1. Install [Hubflow](https://github.com/datasift/gitflow)
2. From the project root, initialize Hubflow: `git hf init`. Hit enter and let it use the default values.

At this point, you are ready. For any new work/bug, we ensure that there is a corresponding JIRA ticket for it. Say, you are working on user story `Expose an API to let user register based on email`. It's corresponding ticket in JIRA is `MVP-1`. In this case, you will first create a feature branch as follows:

```
git hf feature start MVP-1/account_creation_email
```

You commit your changes to this feature branch. Once you have verified the changes, raise a pull request (PR) and have one of your team member review the code.

Once your PR is approved, you should `Squash and Merge` your PR to `develop` branch.

You should then delete the feature branch by:
```
git hf feature finish MVP-1/account_creation_email
```

**NOTE: You should never commit directly to develop or master branch**

#### Editor
We use VS Code to edit the code. Please install [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) plugin to keep the consistent code formatting.

#### CI/CD
We use Heroku as our hosting platform. It is configured such that everytime a commit is made to `develop`, `staging` environment on Heroku automatically deploys `develop` branch. Similarly, everytime a commit is made to `master` branch, `production` environment on Heroku automatically deploys `master` branch

## Releasing to production:

To start a release, run
```
git hf release start <VERSION>
```

We following [Semantic Versioning](https://semver.org/). Please read it to determine appropriate version for the release.

This would create a release branch `release/<VERSION>`

Edit the `package.json` file, update the version number to `<VERSION>` and commit to release branch.

To finish the release, run
```
git hf release finish <VERSION>
```

The system will prompt the editor few times. On 2nd time, please enter release notes to be associated with the tag. Ex (these notes can be generated from JIRA -> Releases):

```
Release notes

Story
MVP-1 User should able to register via email

Bug
MVP-5 System should throw validation error if user tries to register without phone

```

Once the release is done, please share the release notes in appropriate channel in Slack workspace to let the rest of the team know.


## Scripts

- `npm run build` - For building the app.
- `npm run test` - Run automated test cases via `mocha` and `chai`.
- `npm run start` - For starting the app.
- `npm run serve` - For building and starting the app with auto-reload on changes.
- `npm run lint` - To perform linting

## Overview

- Typescript support
- Gulp integration to compile to ES5 for production mode
- Auto reload during development whenever code, or config changes

- Environment specific configuation support.
  The application use [config](https://www.npmjs.com/package/config) npm module. Please see it's documentation for more details.

- Localization support: Support for multiple languages based on Accept-Language header.
  The application use `i18n` npm module. Please see it's documentation for more details.

- Linting support

```
npm run lint
```

### Architecture

- Storage abstraction:
  Introduced the concept of repository and data store. Data Store represents a storage medium (JSON, MongoDB, SQL etc.). The application can instantiate one or more storage. A repository corresponds provides 1:1 operation to a domain model (such as Account) by using underlying data store provided by the application.

- Dependency Injection:
  All the controller gets `AppContext` that has all the dependencies such as repositories to read/write data, logger etc. This makes it easier to replace their implementation in future.
