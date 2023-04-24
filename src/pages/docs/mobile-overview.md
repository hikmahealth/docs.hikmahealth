---
title: Mobile app overview
description: Quidem magni aut exercitationem maxime rerum eos.
---

The mobile app is currently Android only.

---

## Technology Stack

The mobile app is built on FOSS (Free and Open Source Software) projects with permissive licensing and great track records. Some of the key technologies are:

- Platform: [React Native](https://reactnative.dev/)
- Language: [TypeScript](https://www.typescriptlang.org/) (JavaScript)
- State management: [Zustand](https://github.com/pmndrs/zustand) and [Xstate](https://xstate.js.org/)
- Internationalization: [i18n-js](https://github.com/fnando/i18n-js)
- Long performant lists: [Flashlist](https://shopify.github.io/flash-list/docs/)
- Navigation: [React Navigation](https://reactnavigation.org/) and [Expo Localization](https://docs.expo.io/versions/latest/sdk/localization/)
- UI: [React Native Paper](https://callstack.github.io/react-native-paper/)
- Icons: [Material Design Icons](https://materialdesignicons.com/)
- Data: [WatermelonDB](https://nozbe.github.io/WatermelonDB/)

Take a look at the `package.json` file for a full list of dependencies.

### File Organization

Generally, the file organization tries to follow the [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) pattern. The `src` folder is organized as follows:

![File Structure](/images/HH-folder-structure.svg)

Possimus saepe veritatis sint nobis et quam eos. Architecto consequatur odit perferendis fuga eveniet possimus rerum cumque. Ea deleniti voluptatum deserunt voluptatibus ut non iste. Provident nam asperiores vel laboriosam omnis ducimus enim nesciunt quaerat. Minus tempora cupiditate est quod.

#### Assets

The `assets` folder contains images, fonts, and other static assets.

#### Components

The `components` folder contains the building blocks of the app. These are the smallest units of the app and are generally not used directly. They are used by the `screens` and `views` to build the app.

It is important for unit tests to cover the components as they strike a nice middle ground between full integration tests and unit tests (since some of them compose of other units as well).

#### db

The `db` folder contains the database schema, models and migrations. It also contains the `index.ts` file which is the entry point for interacting with the database.

**IMPORTANT:** When updating the local schema for the database, YOU MUST ALSO UPDATE THE VERSION NUMBER OF THE DATABASE located in `index.ts`. Failure to do so will result in application crashes and potential data loss.

During development, its okay to delete the database and recreate it whenever you want, AS LONG AS YOU DO NOT SYNC YOUR CHANGES WITH THE PRODUCTION DATABASE/SERVER.

#### i18n

The `i18n` folder contains the internationalization files. These are JSON files that contain the translations for the app. The `index.ts` file is the entry point for the internationalization module.

The `en.ts` file is the default language file. If you want to add a new language, you can copy the `en.ts` file and rename it to the language code you want to add. For example, if you want to add French, you can copy `en.ts` and rename it to `fr.ts`. Then you can translate the strings in the file to French.

The application natively supports RTL (right to left) layouts for languages like arabic.

#### navigators

The `navigators` folder contains the navigators for the app. These are the screens that are used to navigate between different parts of the app. If you are adding a new "flow" of related screens with the same outcome, you should consider creating a navigator for it.

#### screens

The `screens` folder contains the screens of the app. These are the main screens that are used to build the app. They are composed of `views` and `components`. These are the screens that are consumed by the navigators to render the app.

#### stores

The `stores` folder contains the stores of the app. These are the state management modules that are used to manage the state of the app. They are composed of `zustand` and `xstate` modules. These are the stores that are consumed by the `screens` and `components` to render the app.

An important store is the `sync` store. This store keeps track of the sync process and show the sync overlay on the application to communicate the progress with the user.

#### types

The `types` folder contains the types of the app. These are the types that are used throughout the app.

If a type you are interested in has a database table/model/schema for it, you should refer to the database model from the `db` folder instead of its type. Some of the types need refactoring as they are not used anymore and are only kept for legacy reasons.

#### utils

The `utils` folder contains the utility functions of the app. These are small and self-contained functions that are used throughout the app. Due to their high reuse across the application, it is important to unit test them.

---

🏁

- [ ] TODO: Documentation on emulator vs device running
