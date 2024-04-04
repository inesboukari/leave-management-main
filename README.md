# Leave Plans

## About
Leave Plans is a leave management system built with MERN stack that enable teams to keep track of leave applications

## Documents
[PRD](https://docs.google.com/document/d/1LF7VKB64n4BXhKCeAjuBaPEsqGHtMGifSxp_LEh5pEQ/edit#)|[Deck](https://docs.google.com/presentation/d/1zI_5tlsEWro4H2Z4jx-zqPo4QSiwqYXOSZxQ7XXVQWg/edit#slide=id.g18893f9cac1_0_1193)

### Tech Stack

* MongoDB React
* Express
* React
* MongoDB
* Tailwind CSS

## User Stories
As there are two types of users on the system, this section is split into two.

### User Stories for Staff
* Authentication
    * User can sign into system
    * User can sign out of system
    * User can change password
* Settings
    * User can change their email address
* Leave
    * Entitlement
        * User can check the number of leaves used by type
        * User can check the number of remaining leave entitlements by type
    * Application
        * User can apply for leave
        * User can cancel leave application
        * User can check the status of their leave application
    * History
        * User can review leave applications they have made in the past year
    * Visibility
        * User can view other team members' leave plans on team calendar

### User Stories for Admin
* User Management
    * Admin user can create a user account on system
    * Admin user can edit a user account's details
    * Admin user can delete a user account's details
* Leave Approval
    * Admin user can approve a leave application
    * Admin user can reject a leave application
* Admin Dashboard
    * Admin user can view all staff's remaining leave on a dashboard
* Admin Tools
    * Admin can send a clear leave reminder email to users with X days or more annual leave
    * Admin can set Work Days and Rest Days on system (Note: System counts the number of days applied based on this calendar data)
    * Admin can amend leave entitlement for all leave types on system
    * Admin can create new leave types
    * Admin can delete admin created leave types
    

## Planning and Development Process

The project was broken down to several phases. 
1. Develop frontend features used by normal users
2. Develop frontend features used by admin users
3. Setting up backend
4. Writing backend controllers based on business requirements
5. System testing

### Problem-Solving Strategy

_Divide and Conquer_. Split UI into it's atomic components and build them individually before merging them into _absolute units_ that provide value to end user (Thanks for reading! Check out [r/AbsoluteUnits](https://www.reddit.com/r/AbsoluteUnits/), the content is entertaining!).

### Lessons Learned

Frontend
* Made use of react-big-calendar and tweaked its FE by reading documentation
* Made use of react-multi-date-picker and tweaked it to suit business use case

Backend
* Followed MVC architecture and created endpoints to service client requests
* Connected controllers to MongoDB and familiarised myself with MongoDB's functions and methods
* Improved user's experience by setting up session to re-authenticate user
* Setting up of auth token to enable user to reset password
* Deploying server to hosting provider

Others
* Created websocket to update team calendar instantly after leave is applied
* Created cronjob scripts to dynamically reset leaves at the start of the year
* Connected sendgrid to system to enable automatic email notifications to parties involved
* Made use of momentjs to calculate number of business days on backend
