---
title: Quick Deployment
description: Overview of how to quickly install and deploy the Hikma Health EHR platform.
---

The Hikma Health EHR is a flexible platform that can be deployed to any cloud host you choose, and the mobile application can run on all modern android devices. This guide will show how to set up the entire platform in 30 minutes.

After completing the guide you will have a base installation of the HH EHR system ready for further customizations and usage.

---

## Structure

The EHR platform is made of 3 components: [a database](https://www.postgresql.org/), [a full-stack server](https://github.com/hikmahealth/hikma-health-server) (which includes both the API and admin portal), and [a mobile application](https://play.google.com/store/apps/details?id=com.hikmahealth). Click on any of the component links to learn more about them, or to download the source code.

Each of these components will need to be set up before the EHR is ready for use. **We should set them up in the following order:**
1. Database
2. Server (API + Admin Portal)
3. Mobile application

This is the back-to-front strategy where we start with the "most backend" item that no users typically engage with and finish with the tools that people interact with. We do this because each component we set up is needed for the next one - this is how they are connected.

![HH-architecture](/images/HH-Architecture.svg)

- [More about the architecture](/docs/architecture-guide)
- [More about offline and synchronization](/docs/offline-and-sync)

{% callout title="Migrating from the old Python version?" %}
If you previously deployed the separate `hikma-health-backend` (Python/Flask) and `hikma-health-admin` (Next.js) services, they have now been unified into a single full-stack application. Migration is straightforward - simply deploy the new version using the same database, and the system will automatically run migrations. Your mobile app users will need to sign out and re-scan the QR code. [Learn more about migration](https://github.com/hikmahealth/hikma-health-server#migrating-from-python-version).
{% /callout %}

{% youtube src="https://drive.google.com/file/d/1uJuWa1oL06__cEmPMgYIluH362mj8YJf/preview" width="100%" height="480" /%}

---

## Hosting setup

Our EHR can be hosted on almost any hosting service you choose, so create an account with your favorite provider and proceed. For this guide, we will use [Render](https://render.com) as our hosting provider. They offer a secure service that is relatively simple to get started with.

Create an account and follow the instructions needed to complete your account creation. Some hosting providers will require a working credit/debit card, while others will let you get started without one.

At the time of this writing, you do need a credit card to sign up with Render. You can deploy without a credit card by changing updating the render.yaml file in the root of the project (follow the comments in that file).

---

## Server deployment (Database + API + Admin Portal)

The Hikma Health EHR system is now powered by a modern TypeScript full-stack application built with TanStack Start, backed by a PostgreSQL database. The server includes both the API (for mobile applications) and the admin web interface in a single unified application. All authentication, authorization, and data management happens through this server.

With the Render quick deploy, you can deploy both the server and database together with a single click.

### Deployment Steps

To deploy the complete system, follow these steps:

1. If you are not already signed in, sign into your [render.com](https://render.com) account in your browser.

2. Navigate to the [hikma-health-server repository](https://github.com/hikmahealth/hikma-health-server) on GitHub.

3. On the repository homepage (README), click on the **"Deploy to Render"** button. This will open a new Render page.

4. On the Render portal, enter a name for your deployment blueprint (e.g., "hikma-health-production").

5. Click **"Create"** to begin the deployment process.

6. Wait for all deployments to complete. This process will automatically:
   - Create a PostgreSQL database instance
   - Deploy the server application
   - Run database migrations
   - Connect everything together

7. Navigate back to your Render dashboard to verify that you can see all instances running successfully.

8. Click on your web service to find its URL. This is the URL you'll use to access the admin portal and that mobile devices will connect to.

**IMPORTANT NOTES:**
- Make sure to update the database instance type from **Starter to Standard** when ready to go to production. **All Starter databases are deleted after 90 days.**
- The server runs on Node.js 22.14+ and uses the latest TypeScript and TanStack Start framework.
- Database migrations run automatically on startup, so your schema is always up to date.
- The application is optimized for offline-first operation and low-resource settings.

{% youtube src="https://drive.google.com/file/d/1WVkrtzXizdMptf-lMtxPD7fu-NuCjYib/preview" width="100%" height="480" allow="autoplay" /%}

### Accessing the Admin Portal

Once your deployment is complete:

1. Navigate to the URL of your web service (found in your Render dashboard)
2. You should see the admin login page
3. Sign in with the default credentials (contact ally[at]hikmahealth.org for initial credentials)
4. **🔥 CRITICAL: Immediately change the default password**
   - Go to Settings or Users list
   - Edit your user account
   - Set a strong, unique password

The admin portal allows you to:
- Manage clinician accounts and permissions
- View patient reports and analytics
- Export data for analysis
- Create and edit medical forms
- Generate QR codes for mobile app activation
- Configure system settings

---

## Mobile app setup

The Android application is the primary data collection tool for the Hikma Health EHR system. You can choose to either manually install the application on your devices by building from the repository, or by simply downloading the app from the Play Store (recommended).

To get started with the mobile application, you **must** have a working server deployment (which includes the database, API, and admin portal). Here is how you can connect the application to your system:

### Connection Steps

1. **Open your admin portal** and navigate to the "Activate App" or QR code page. This will display the QR code needed to link your mobile application to your server.

2. **Download the application** from the [Google Play Store](https://play.google.com/store/apps/details?id=com.hikmahealth) or [Apple App Store](https://apps.apple.com/us/app/hikma-health/id1536732757).

3. **Open the application** on your device. On the sign-in page, tap **"Register with QR code"** to open the QR code scanner.

4. **Scan the QR code** displayed in your admin portal (from step 1). This tells your mobile application where to send data.

5. **Sign in** using your clinician credentials that were set up in the admin portal.

6. From here you can proceed with:
   - Patient registration
   - Recording visits
   - Viewing patient history
   - Offline data collection
   - Data synchronization when online

### Building from Source (Optional - Not Recommended)

If you need to customize the mobile application, you can build it from source:

1. Clone the [mobile app repository](https://github.com/hikmahealth/hikma-health-app)
2. Follow the setup instructions in the repository's README
3. Make sure you have React Native properly configured
4. Build and install the APK on your devices

---

## Troubleshooting

If you experience any issues with your deployment process:

### Check the Logs

1. **Server logs**: In your Render dashboard, click on your web service and navigate to the "Logs" tab
2. **Browser console**: For admin portal issues, open your browser's developer tools (F12) and check the Console tab
3. **Database connectivity**: Ensure your database instance is running and the connection string is correct

### Common Issues

**Deployment fails:**
- Check that your Render account has sufficient resources
- Verify that the database instance was created successfully
- Review the deployment logs for specific error messages

**Cannot access admin portal:**
- Verify the web service URL is correct
- Check that the deployment completed successfully
- Clear your browser cache and try again
- Check browser console for JavaScript errors

**Mobile app cannot connect:**
- Ensure you scanned the correct QR code
- Verify your server URL is accessible from your mobile device
- Check that your server is running (not sleeping)
- Confirm your device has internet connectivity

**Database connection errors:**
- Verify the DATABASE_URL environment variable is set correctly
- Ensure the database instance is running
- Check database credentials and connection string

### Getting Help

If you're stuck for more than 15 minutes, please reach out:

- **File an issue** on the [GitHub repository](https://github.com/hikmahealth/hikma-health-server/issues)
- **Send an email** to tech[@]hikmahealth.org
- **Include details**: Screenshots, log excerpts, steps to reproduce, what you expected vs. what happened

Please include as much detail as possible - we prefer too much information over too little!

---

## Next steps

At this point, you have a fully functional Hikma Health EHR deployment! You're ready to:

1. **Customize forms**: Create or modify medical forms to match your workflow
2. **Add clinicians**: Register clinician accounts with appropriate permissions
3. **Configure settings**: Adjust system settings for your organization
4. **Train staff**: Familiarize your team with both the mobile app and admin portal
5. **Start collecting data**: Begin registering patients and recording visits
6. **Monitor usage**: Use the admin portal to view reports and track system usage

### Recommended Next Reading

- [Customizing Hikma Health](/docs/customizing-hh) - Learn how to tailor forms and workflows
- [Architecture Guide](/docs/architecture-guide) - Understand how the system works
- [Security Best Practices](/docs/security) - Ensure your deployment is secure
- [Contributing](/docs/how-to-contribute) - Share improvements back with the community

---

## Production Checklist

Before going live with patient data, make sure you have:

- [ ] Upgraded database from Starter to Standard plan (on Render)
- [ ] Changed all default passwords
- [ ] Configured proper user roles and permissions
- [ ] Set up regular database backups
- [ ] Enabled HTTPS (should be automatic on Render)
- [ ] Tested the entire workflow from patient registration to data export
- [ ] Trained all staff members
- [ ] Set up monitoring and alerts
- [ ] Documented your custom configurations
- [ ] Reviewed data privacy and compliance requirements for your region
