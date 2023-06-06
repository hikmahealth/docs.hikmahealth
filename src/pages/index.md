---
title: Getting started
pageTitle: Hikma Health - Open source and offline first electronic health records
description: The first free mobile health data system for physicians serving refugees
---

Learn how to get Hikma Health set up in your project in under thirty minutes. {% .lead %}

{% quick-links %}

{% quick-link title="Quick Start" icon="installation" href="#quick-start" description="Follow the simple step-by-step instructions to set up the servers, admins and mobile applications." /%}

{% quick-link title="Architecture guide" icon="presets" href="/docs/architecture-guide" description="Dive into the structure of the platform to learn more about all the moving parts and how they relate to each other." /%}

{% quick-link title="Customization" icon="plugins" href="/" description="Hikma Health is built to be extendable and customizable for your needs. Learn how here." /%}

{% quick-link title="Contributing" icon="theming" href="/docs/how-to-contribute" description="How your customization can help other users and create a much larger impact." /%}

{% /quick-links %}

We are committed to open source and making Hikma Health a digital public good. We believe that the best way to build a better future is to share our work with the world.

---

## Quick start

This documentation is continuously improving and expanding. If you have any questions, issues, or general feedback, please
[open an issue](https://github.com/hikmahealth/docs.hikmahealth/issues/new).

### Overview

For the rest of this documentation, it is important to keep in mind that the platform is a collection of 4 different core technologies/applications:

1. [Hikma Health Server](https://github.com/hikmahealth/hikma-health-backend)
2. [Hikma Health Admin](https://github.com/hikmahealth/admin-app)
3. [Hikma Health Mobile Application (Android only)](https://github.com/hikmahealth/hikma-health-app)
4. [Database](https://www.postgresql.org/)

Together they form the Hikma Health platform. The server is the core of the platform and is responsible for managing the data and providing the API for the mobile application and admin. The admin is a web application that allows users to manage the data in the platform. The mobile application is a mobile application that allows users to collect data in the field. The database is a relational database (PostgreSQL) that stores all the data.

### Requirements

To get started with each of the applications, you will need to have the following installed on your machine:

- [Git](https://git-scm.com/): A version control system that allows you to download the code from GitHub.
- [Node.js](https://nodejs.org/en/) (v14 or higher): A JavaScript runtime that allows you to run JavaScript code outside of a browser.
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/): A package manager that allows you to install and manage dependencies.
- [PostgreSQL](https://www.postgresql.org/): A relational database that stores all the data.
- [Android Studio](https://developer.android.com/studio): An IDE for Android development.
- [React Native](https://reactnative.dev/docs/environment-setup): A framework for building native apps using JavaScript and React.
- [Python 3.10](https://www.python.org/downloads/): A programming language that allows you to run scripts.
- [conda](https://docs.conda.io/en/latest/miniconda.html) or [virtualenv](https://virtualenv.pypa.io/en/latest/) or [venv](https://docs.python.org/3/library/venv.html) (Recommended): A tool to create isolated Python environments and prevent dependency conflicts. Love your future self by using one of these tools.
- [PGAdmin](https://www.pgadmin.org/) (Recommended): A tool that allows you to manage PostgreSQL databases. Can save you a lot of time.
- [ngrok](https://ngrok.com/) (Optional): A tool that allows you to expose a local server to the internet. This makes it easier to test the mobile application.

### Clone Repositories

First, create a directory to store all the code for the platform. Then, clone the repositories for each of the applications:

```bash
# Make a directory to store all the code
mkdir hikma-health

# Change into the directory
cd hikma-health
```

This will help with organizing the code and make it easier to run the applications.

Next, clone the repositories for each of the

```bash
# Clone the server repository
git clone https://github.com/hikmahealth/hikma-health-backend

# Clone the admin web app repository
git clone git@github.com:hikmahealth/admin-app.git

# Clone the mobile app repository
git clone git@github.com:hikmahealth/hikma-health-app.git

```

---

## Local set up

Make sure you have all the requirements installed on your machine. Then, follow the instructions below to set up the platform locally.

### PostgreSQL database

The database is a relational database (PostgreSQL) that stores all the data. You will need to install PostgreSQL on your machine and create a database for the platform.

```bash
# Start the PostgreSQL server
pg_ctl -D /usr/local/var/postgres start

# Create a database for the platform
createdb hikma_health

# Create a user for the platform
createuser hikma_health

# Grant all privileges to the user
grant all privileges on database hikma_health to hikma_health;

# Set the password for the user
alter user hikma_health with encrypted password 'hikma_health';

# Set the user as the owner of the database
alter database hikma_health owner to hikma_health;
```

### Flask server

The server is based on Flask and Python 3.10. Please make sure you have Python 3.10 installed on your computer as described [here](https://www.python.org/downloads/). Also make sure you have a database set up and running - as shown above.

```bash
# Change into the server directory
cd hikma-health-backend/app

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install the dependencies
pip3 install -r requirements.txt

# Take a look at the config.py file and update any variables as needed
# You may need to create a .env file with the correct values for the variables
# These variables can be listed as follows:
APP_ENV=prod
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hikma_health
DB_USER=hikma_health
...

# Start your server
./run.sh
```

{% callout title="Quick setup hack!" %}
You can make changes to the migrations inside the `migrations` folder on initial server start up. This will allow you to create the database tables and columns you need. Whenever you feel the need to "start afresh", you can delete the existing tables and schemas in the DB - PGAdmin is a great tool for this. Then, you can run the migrations again to create the tables and columns you need. This is a quick and dirty way to get started. You can always go back and make the migrations more robust later.
{% /callout %}

### Admin web application

The admin web application is developed using React and the Next.js framework, please make sure you have Node.js and Yarn properly set-up on your computer as described [here](https://reactjs.org/docs/getting-started.html).

```bash
# Change into the admin web app directory
cd admin-app

# Install the dependencies
yarn install

# Create a .env file with the correct HIKMA_API with the following command - edit based on which port the application is running
echo "REACT_APP_HIKMA_API=http://localhost:8000" > .env

# Start the application
yarn dev
```

### Mobile application

The mobile application is developed using React Native, please make sure you have react-native properly set-up on your computer as described [here](https://reactnative.dev/docs/environment-setup). If your set up is not correct, you will encounter errors when trying to run the application.

```bash
# Change into the mobile app directory
cd hikma-health-app

# Install the dependencies
yarn install

# Create a .env file with the correct API_URL with the following command - edit based on which port the application is running
echo "API_URL=http://localhost:8000" > .env

# Start the application
yarn android && yarn start
```

---

## Getting help

The best place to learn more about the Hikma Health platform is to visit our website at [hikmahealth.org](https://hikmahealth.org/) and our github repository at [github.com/hikmahealth](https://github.com/hikmahealth).

### Submit an issue

If you have a question or need help with getting started, please either send an email to [tech@hikmahealth.org](mailto:tech@hikmahealth.org) or submit an issue on the appropriate repository - which you can find here [GitHub repository](https://github.om/hikmahealth)

### Join the community

You can support the development of this project by writing code, fixing bugs, and improving documentation. We welcome pull requests, bug reports, and issue reports. Please see our [contributing guidelines](/docs/how-to-contribute) for more information.
