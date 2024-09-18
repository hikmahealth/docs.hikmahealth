---
title: Frequently Asked Questions
description: 
---

If you have any specific questions not included in 
this list please file an issue on github (recommended) or email them directly to ally[at]hikmahealth.org.

---

## What does "offline-first" or "local-first" mean?
Offline-first apps are designed to work primarily offline, and online functionality is a secondary feature. 
This means you can use the mobile EHR system regardless of internet availability. 

If you are using the app without internet, be sure to synchronize the data as soon 
as internet is available to make sure other users in your organization have your latest data.

A downside to this approach is that data is not automatically available to other users on their devices all 
the time, you need access to the internet and synchronize the data to share it. This is something we are 
trying to improve on currently.


## Can I use the Hikma Health EHR system without a 'cloud' component?
Yes! This approach is cheaper and faster if you are a small clinic or dispensary that 
only has one user of the tool and are primarily interested in simply collecting data to view later on.

Remember that you can add a 'cloud' component anytime in the future, by simply registering your 
app to your backend and synchronizing the data. So, if you add another clinician, or need access to admin 
level functionality, simply add the cloud server and you are ready to expand.


## Why do I need to scan the QR code before using the mobile app?
The mobile app is available to all users directly from the play and app stores. This means anyone can download 
the Hikma Health EHR app and use it for their organization. 

To connect *YOUR* mobile app to *YOUR* other services you must scan the QR code on the administrator 
portal during the first sign in. After scanning the code, your 
mobile app is now connected to the server and knows where to store data online. 
Without doing this, the mobile app will not be able to sync data to other users - which is fine if you are 
only using the offline use case.


## I have scanned the QR code, but I am still not able to sign in to the mobile app.
The most common issue here is that something went wrong with the scanning of the QR code.

The first thing to try is re-scanning the QR code, making sure it is clearly visible wherever you are scanning from.
If this does not work, please verify your email address and password and set a new password on the admin portal 
to try a new password.

If none of the above works, file an issue with the correct logs or talk to you technical lead for further 
instructions.


## Who can see my data, and who is it shared with?
With the Hikma Health EHR system, no one but you and your technical team have access to your data. Not even us.

This is because you deploy your own backend/server, and are soley incharge of managing and protecting your data.

Please do not share your credentials for login and/or server access with anyone outside your organization.


## What are the recommended specifications for mobile devices running Hikma Health app?
Mobile phone specifications depend on the number of patients and visits you get per month. However, we highly 
recommend using a device that has **at least 4GB of RAM and 64GB of internal storage**.

The higher your specifications the more confident you can feel in how much data you can collect and store offline. 
These specifications impact everything from how fast searching is, how fast data entry is, to how fast 
the synchronization can happen.

For Android devices, please use Android 13 or higher. Lower versions of android are becoming depricated and will 
no longer receive updates from Google.

## How does deleting data work in offline systems such as Hikma Health EHR?
Deleting data works differently in offline first system as you may have been used to in always online systems.
In offline first systems, a record is never completely deleted, it is instead marked with a "tombstone" 
((learn more)[https://en.wikipedia.org/wiki/Tombstone_(data_store)]) that marks it as "deleted".

This means that you should still expect to see records you thought were deleted inside the database. These 
'deleted' records should not be visible anywhere else since they are filtered out of all queries.

The reasoning behind this kind of 'soft delete' can be very technical, but to put it simply, since all mobile app 
users are expected to be offline, any deleted record cannot be completely removed since other users need to be notified 
when they come back online that the record was removed.

## How often is the Hikma Health system updated?
We try to update our codebase *at least* once per month. These updates include performance 
improvements, new features, security improvements, bug fixes and package updates. To keep your `fork (copy)` 
of the codebase up to date, simply synchronize your repository with ours and deploy the latest changes.

We work very hard to make sure there are no breaking changes, if there are any breaking changes 
you will be notified and they will definitely be in a new repository so as to not impact current users.

Lastly, the JavaScript and Python ecosystems are notorious for how quickly things change, 
so we try to keep up with the change because simply being a few months out of date can mean a much 
more complex upgrade process.

## I have encountered an error, what now?
You can email our technical lead directly at ally[at]hikmahealth.org and/or file an issue on github (recommended).

Please include the details of your error, any screenshots or recordings will also be VERY helpful. If you have 
any technical skills, please also send any server logs you have - this will be the most helpful thing to send.

## Where can I host the backend, database and administrator portals?
We recommend hosting at (render.com)[render.com] due to the affordability and ease-of-use. 
However, you can technically deploy on any server out there - even on a raspberry pi if you want. Just keep 
in mind how much work it will be to deploy *and* to maintain the platform over time.

Here are some examples of the ease-of-use tradeoffs
- You can deploy to render with one click on the repository readme, while deploying to a virtual private server 
(VPS) can take you a few hours just to configure the server. At which point, assuming you did everything 
the right way, you now need to figure out continuous deployment.
- Deploying your database on a service that is not managed means you need to make sure you are personally taking
database updates, or write a custom script to do that. With render (and services like it) that offer managed 
databases, database snapshots and backups are taken for you.

**NOTE:** Do not host your database with a service that is not *managed*. Use a hosting provider that 
specifically mentions that they offer *a managed database service*.

## How is data stored on the mobile app?
Data on the mobile app is stored using a SQLite database that is very performant. On both Android and iOS, 
application data exists inside a *sandboxed* environment meaning that no other application can access the 
data within the Hikma Health mobile app.


## I am trying to sync and its taking a very very long time to sync.
This usually means you do not have access to the internet, or you are on a very slow network. The second most 
common cause of this is that you have thousands of unsynced records that simply take time to sync.

If none of the above is true, contact your technical lead as there could be an issue with your server.


## The number of patients reported on the admin portal is not the same as the number of patients on the mobile app.
This will happen if your server is misconfigured - notify your technical lead to resolve. The technical lead 
can schedule a call with me by contacting me at ally[at]hikmahealth.org and we can work together to resolve the issue.


## I deleted the app, installed a fresh one, but all my data is still there. How is this possible?
The operating system, Android or iOS decides when to delete/remove application data after the 
application has been uninstalled. This means it is absolutely possible to uninstall the app, install a new copy, 
and find that you are already signed in and your data is all there. You should expect this, especially 
if you install a new app a few minutes after removing the old one.

If you want to guarantee that all the data is removed from the device go to your settings and find 
the Hikma Health app in your list of apps, and clear the application data and cache.
