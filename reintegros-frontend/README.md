## IPROSS - Reintegros (Frontend)

Frontend application for [`Reintegros (backend)`](https://bitbucket.org/patagoniantech/reintegros-backend/src/master/) based on [`Next.js`](https://nextjs.org/).

## Getting Started

1. First, checkout and pull develop branch of this repository

```
git fetch && git checkout develop
```

2. Install dependencies:

```bash
yarn
# or
npm install
```

3. Then add a .env.local file on project root, with this content:

```
NEXT_PUBLIC_API="http://localhost:8000/" //Your backend Url here
NEXT_PUBLIC_API_KEY= "ads..." //Your api key here
```

4. To get everything working right yo need to have an instance of the backend running, can find source code and instructions [`Here`](https://bitbucket.org/patagoniantech/reintegros-backend/src/master/)

5. Now, is time to get the front running ()

```bash
yarn dev
# or
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project structure

\*Some configuration and tools files omitted

```
.
│
...
└───.plop
...
└───components
    └───api-call
    └───builder
    └───common
    └───...
...
└───pages
└───styles
.env.local
labels.ts
...
```

- .plop: Files and functions for crud generator, including hbs templates actions and plopfile
- components: Here you can find find all the react components used by the app.
  - api-call: Here all functions to hint the backend, including and axios wrapper thus provides abstractions for post, get, put, remove, patch. Also inject bearer token in every request (If is available in cookies) through interceptors and handle re authentication via refresh token.
    - auth: HOC auth provider (wip)
  - builder: All files used by form builder for building form dynamically from object config
  - common: Common components including [´material-table´](https://material-table.com/#/) wrapper (aka Table) to configure the table for our requirements, Layout, types (used across app), ActionBar (Generic component used by action bar in each view), Alert and Loading.
  - ...: Here one folder for each entity created containing all component used by that entity
- pages: Next.js pages
- labels: Global file to centralize stings accross all application.

## Generator

You can generate crud skeleton for a new entity in a semi automatic manner using the below command

```
yarn generate
```

A prompt would ask you about a route and after that will generate a new folder in components with the provided name and basic skeleton for crud operations.
For example, if you provide 'home' as route a new folder with name home appears on component with the following files inside:

1. FormConfig.ts: File for form builder configuration, you must to write here all the configuration for the necessary fields in your form, you can se some examples on the 'nomenclador' component

2. Home.tsx: This file contains all the functional behavior for the crud, no action is required here

3. HomeForm.tsx: This file is responsible for render the form based on yours FormConfig and the builder, no action is required here

4. HomeList.tsx: This file render the List of home`s using the material-table wrapper (Table), no action is required here

5. types.ts: Types for the new entity you must define the types for the new entity here.

6. The generators also would append a HOME object in the labels file. This object includes name, route and page string if your route is different (ex- /api/home) you mus change there. Also includes fields (key/value) you should explicit yours api fields there. It be used to generate the table columns and to provide a label for the form fields. If you need static options list is recommended to define as new key in this object and refers from the FormConfig (See nomenclador example to know how works). If an special render is needes form some fields you can define a new key with the field name in the renders object (again look on nomenclador for a working example).
