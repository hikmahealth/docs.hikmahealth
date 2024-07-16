---
title: Quick Deployment
description: Overview of how to quickly install and deploy the Hikma Health EHR platform.
---

The Hikma Health EHR is a flexible platform that can be deployed to any cloud host you choose, and the mobile application can run on all modern android devices. This guide will 
show how to set up the entire platform in 30 minutes.

After completing the guide you will have a base installation of the HH EHR system ready for further customizations and usage.

---

## Structure

The EHR platform is made of 4 components; [a database](https://www.postgresql.org/), [a server](https://github.com/hikmahealth/hikma-health-backend), 
[an admin portal](https://github.com/hikmahealth/hikma-health-admin), and 
[a mobile application](https://play.google.com/store/apps/details?id=com.hikmahealth). Click on any of the component links to learn more about them, 
or to download the source code.

Each of these components will need to be set up before the EHR is ready for use. **We should set them up in the following order:**
1. Database
2. Backend Server (API)
3. Administrator Portal
4. Mobile application


This is the back-to-front strategy where we start with the "most backend" item that no users typically engage with and finish with the tools 
that people interact with. We do this because each component we set up is needed for the one - this is how they are connected.

![HH-architecture](/images/HH-Architecture.svg)

- [More about the architecture](/docs/architecure-guide)
- [More about offline and synchronization](/docs/offline-and-sync)


{% youtube src="https://drive.google.com/file/d/1uJuWa1oL06__cEmPMgYIluH362mj8YJf/preview" width="100%" height="480" /%}


## Hosting set up

Our EHR can be hosted on almost any hosting service you choose, so create an account with your favorite 
provider and proceed. For this guide, we will use [Render](https://render.com) as our hosting provider. 
They offer a secure service that is relatively simple to get started with.

Create an account and follow the instructions needed to complete your account creation. Some hosting 
providers will require a working credit/debit card, while others will let you get started without one.

At the time of this writing, you do not need a credit card to sign up.


## Backend set up

The Hikma Health EHR system is powered by a python backend and a postgresql database. The administrator 
dashboard and mobile applications all send data and queries to the backend which communicates with the 
database to carry out any requests. All authentication and authorization happens in the backend as well.

With the render quick deploy, you can deploy both the backend and database.

To deploy the database, follow the following steps:
1. If you are not already signed in, sign into your render.com account in your browser.
2. Fork the backend repository found here [repository](https://github.com/hikmahealth/hikma-health-backend) onto your own ogranizations repository.
3. On the repository homepage, known as the README, click on the "Deploy to Render" button. This will open a new render page.
4. On the Render portal, enter a new name for the backend blueprint.
5. Click "create".
6. Wait for all the deployments to complete. At which point your database and backend have both been set up for you.
7. Navigate back to the dashboard to make sure you can see the instances.


**NOTE:** Make sure to update the instance type from starter to standard when ready to go to production. **all starter databases are deleted after 90 days**

{% youtube src="https://drive.google.com/file/d/1WVkrtzXizdMptf-lMtxPD7fu-NuCjYib/preview" width="100%" height="480" allow="autoplay" /%}


## Admin portal set up

The administrator portal is a React based web application (built on JavaScript/TypeScript & Next.js) for administrators 
to manage clinician accounts, view reports, export data, and edit forms. This is a powerful portal so access to it should 
be limited to only those with the right permissions.

The portal source code can be found [in this repository](https://github.com/hikmahealth/hikma-health-admin), you can investigate the package.json file to see 
the dependencies and supported commands

To deploy to render.com follow these instructions"
1. Clone the portal repository to your own github organization or account
2. Fork the backend repository found here [repository](https://github.com/hikmahealth/hikma-health-admin) onto your own ogranizations repository.
3. On the repository home page, known as the README, find the one click on the "Deploy to Render" button. This will open a new render page
4. On the Render portal, enter a new name for the admin portal blueprint
5. Click on create
6. Wait for all the deployments to complete. After the deployment, your admin portal is almost ready.
7. Navigate back to the dashboard
8. Open the new web service you just created
9. Open the environment tab
10. You need to replace the value of "NEXT_PUBLIC_HIKMA_API" with the URL of your backend - you can find this on the backend deployment we just did.
11. This will trigger a new deploy process, wait for a few minutes for the deployment to complete.
12. Open the URL of your deployment and sign in to test it (you can get the default credentials by contacting ally[at]hikmahealth(dot)org)

{% youtube src="https://drive.google.com/file/d/1MFYUtkkDxyDxulARGLZAZBHvRu8g_F6X/preview" width="100%" height="480" allow="autoplay" /%}

## Mobile set up
The android application is the primary data collection tool for the Hikma Health EHR system. You can choose to either 
manually install the application on your devices by running the code from the repository, or by simply downloading the 
app from the play store (recommended). 

To get started with the mobile application, you **must** have a working backend, database, and administrator portal. Here 
is how you can connect the application to the rest of your system.
1. Open your administrator portal and navigate to the "Activate App" page. This will show you the QR code needed to link your application.
2. Download the application from the play store
3. After opening the application, on the sign in page, click on the "Register with QR code" to open the QR code scanner
4. Use your phone to scan the QR code opened in step 1 above. This will tell your mobile application where to send data to.
5. Once linked, you can use your credentials to sign into the application
6. From here you can proceed with patient registration, recording visits and more.


## Troubleshooting
If you experience any issues with your deployment process, the first step should be to look at the logs 
(whether this is the browser console or the server logs). If the issue is still not clear, please file an issue directly on github or send us an email. 
Please include as much detail as possible, we prefer if you include too much details and screenshots / videos. If you are stuck for more than 15 minutes, please reach out.

## Next steps
At this point you are ready to start customizing your deployment by setting up different forms and registering clinicians.
