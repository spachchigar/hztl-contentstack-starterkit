# Contentstack Kickstart: Next.js

Contentstack Kickstarts are the minimum amount of code needed to connect to Contentstack.
This kickstart covers the following items:

- SDK initialization
- Live preview and Visual building setup

More details about this codebase can be found on the [Contentstack docs](https://www.contentstack.com/docs/developers).

[![Join us on Discord](https://img.shields.io/badge/Join%20Our%20Discord-7289da.svg?style=flat&logo=discord&logoColor=%23fff)](https://community.contentstack.com)

## How to get started

Before you can run this code, you will need a Contentstack "Stack" to connect to.
Follow the following steps to seed a Stack that this codebase understands.

> If you installed this Kickstart via the Contentstack Markertplace or the new account onboarding, you can skip this step.

### Install the CLI

```bash
npm install -g @contentstack/cli
```

#### Using the CLI for the first time?

It might ask you to set your default region.
You can get all regions and their codes [here](https://www.contentstack.com/docs/developers/cli/configure-regions-in-the-cli) or run `csdx config:get:region`.

> Beware, Free Contentstack developer accounts are bound to the EU region. We still use the CDN the API is lightning fast.

Set your region like so:

```bash
csdx config:set:region EU
```

### Log in via the CLI

```bash
csdx auth:login
```

### Get your organization UID

In your Contentstack Organization dashboard find `Org admin` and copy your Organization ID (Example: `blt481c598b0d8352d9`).

### Create a new stack

Make sure to replace `<YOUR_ORG_ID>` with your actual Organization ID and run the below.

```bash
csdx cm:stacks:seed --repo "contentstack/kickstart-stack-seed" --org "<YOUR_ORG_ID>" -n "Kickstart Stack"
```

## Create a new delivery token.

Go to `Settings > Tokens` and create a delivery token. Select the `preview` scope and turn on `Create preview token`

## Fill out your .env file.

Now that you have a delivery token, you can fill out the .env file in your codebase.

> You can find the API key, Delivery Token and Preview Token in Settings > Tokens > Your token.

```
NEXT_PUBLIC_CONTENTSTACK_API_KEY=<YOUR_API_KEY>
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=<YOUR_DELIVERY_TOKEN>
NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=<YOUR_PREVIEW_TOKEN>
NEXT_PUBLIC_CONTENTSTACK_REGION=EU
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=preview
NEXT_PUBLIC_CONTENTSTACK_PREVIEW=true
```

## Turn on Live Preview

Go to Settings > Live Preview. Click enable and select the `Preview` environment in the drop down. Hit save.

## Install the dependencies

````bash
npm install

## Prepare husky

```bash
npm run prepare
````

### Run your app

```bash
npm run dev
```

### See your page visually

### In the browser

Go to `http://localhost:3000`.

#### In the CMS

Go to Entries and select the only entry in the list.
In the sidebar, click on the live preview icon.
Or, see your entry in the visual builder

## For Developers

### Pull Request Checklist

### Before Submitting a Pull Request

- [ ] **Complete the Feature/Task**: Ensure the entire feature or task is fully implemented and tested.
- [ ] **Run All Tests**: Confirm all unit tests, integration tests, and end-to-end tests pass.
- [ ] **Linting and Formatting**: Run linters and code formatters to adhere to coding standards.
- [ ] **Update Documentation**: If applicable, update documentation (README files, code comments, API docs).
- [ ] **Check for Nulls and Exceptions**: Ensure proper null checks and exception handling are in place.
- [ ] **Remove Unused Code**: Delete unused or commented-out code.
- [ ] **Avoid Hardcoded Values**: Replace hardcoded values with constants or configurations.
- [ ] **Use Meaningful Names**: Ensure variables, functions, and classes have descriptive names.
- [ ] **Generalize Where Possible**: Refactor to reuse existing functions or create utilities where possible.
- [ ] **Optimize Performance**: Check for opportunities to improve performance.
- [ ] **Check Commit Messages**: Follow commit message guidelines; keep them clear and concise.
- [ ] **Take Screenshots**: Attach screenshots or videos for new features or UI changes.
- [ ] **Cross-Browser Testing**: Verify functionality across multiple browsers (if applicable).
- [ ] **Check Localization/Internationalization**: Ensure compatibility with different locales/languages (if applicable).
- [ ] **Review Touch Points**: Check for unintended impact on other parts of the system.

---

### During the Pull Request

- [ ] **Provide Context**: Explain the purpose of the PR, linking to relevant tickets/docs.
- [ ] **Summarize Changes**: Give a brief overview of what was changed.
- [ ] **Flag Known Issues**: List any known issues or areas needing attention.
- [ ] **Request Specific Feedback**: Highlight areas where reviewer input is needed.

---

### After Submitting a Pull Request

- [ ] **Monitor Feedback**: Be available to answer reviewer questions.
- [ ] **Respond to Comments**: Address feedback promptly (with code changes or clarifications).
- [ ] **Re-test After Changes**: Re-run tests after making updates based on feedback.
- [ ] **Update PR Description**: If significant changes were made, update the PR summary.
- [ ] **Confirm No Conflicts**: Ensure your branch is up-to-date and has no merge conflicts.
- [ ] **Double-Check Merged Code**: Verify functionality in the target environment after merge.

## Husky Bypass

Bypass (emergency only):
prepend terminal git command with "BYPASS_CHECKS=true"

for example:
BYPASS_CHECKS=true git commit -m "hotfix"
BYPASS_CHECKS=true git push

→ Commit automatically tagged [BYPASSED]
→ Entry logged in .husky/bypass.log
