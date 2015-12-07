# Home Info. Hub (Website Version)
HIH is an abbreviation, which stands for Home Information Hub. HIH targets to build the warehouse for all necessary information among all family members. Key components are:
- Finance trace. This feature allows you record (nearly) all the finance activities, and provides the reports for you to review the healthy of the family, such as the balance report, cash journal, etc;
- Learning trace. This features enable you to record the target for each family member's learning targets. Learning is a habit of self growth, no matter the ages of the family members.
- Libraries (Under design phrase). 

HIH is expected to run on a HTTP/HTTPS server, which shall be easily access by all workstations/mobile devices. 
As it name indicates, HIH shall be used inside the family network. So, ideally, it runs on a NAS or Family Server with HTTP/PHP enabling.  

## What's HIH
HIH, the abbreviation of Home Info. Hub, is a warehouse storing the necessary information among all family memebers.
For version 0.5, it supports the Finance Traces and Learning Traces. The detail explaination of the modules listed below. 

### Finance trace
- Accounts
- Documents
- Multiple Currencies Enablement
- Reporting
- Controlling perspective: Control Center and Order
- Downpayment
- Asset (to do)

### Learing trace
- Learn Object
- Learn History
- Learn Award
- Learn Plan (with Comparison to real learn history)

## Who needs HIH
If you have more than two computers, no doubtly that you will feel it's hard to synchronze the data between them. Now days, it becomes more and more critical when the mobile devices are used widely to store the pieces of information. 
It's quite ture that the cloud solution, like Apple iCloud, Microsoft OneDrive gets popular recent days for the storage purpose, but it still cannot solve the issues for the structured data - overwritting files always be the last approach.

In that case, HIH provides the opportunity to share the information among the intranet (though it's quite easy to convert it into Internet part).  And, for the family usage, the finance part the learning part coming as the first part.

## Development History
Current Version: Web 0.5.3;
Built with AngularJS, Angular UI, TinyMCE, etc. See more in Acknowledge menu.

### Key Directions/Decisions in Scope/Design/Development phrase
- 2015.7.1, Switch from native BootStrp to UI Bootstrap;
- 2015.7.2, Switch from Baidu CDN to Bootcss CDN, because the number of the components;
- 2015.7.15, Switch from Modal dialog to Sweet Alert. The dialog in HIH only for Message/Warn/Error; 
- 2015.7.22, Switch from Smart-Table to UI-Grid, because the column footer feature;
- 2015.7.29, Switch for ng-i18next to Angular Translate because UI-Grid integer it;
- 2015.8.2, It's DECIDED that the switch from ngJstree to UI-Grid tree mode suspended;
- 2015.8.4. It's DECIDED that all non-operatable (search, edit) using the native table not the UI-grid. First batch: User Detail, User List, Document Type List, Transaction Type List, Currency List, Account Category List;
- 2015.8.22, It's DECIDED that using promise concept($q) for asynchronously data loading;
- 2015.9.3， It's DECIDED that displaying all error messages during the input validation;
- 2015.9.15, It's DECIDED that exchange rate stands for the rate between the currency in use and the local currency; and the value is:
	- Formula for Rate: 1 Foreign Currency in use = 1 Local Currency * Rate;
	- Formula for calculating local currency: Local Currency = Foreign Currency / Rate;
- 2015.9.17, It's DECIDED that using auglar-selectize instead of ui-select, because its requires .selected on the attribute which causes it is not easy to use ng-model directly on other controls;
- 2015.10.20, It's DECIDED that the stored procedure in DB layer only conver simple CREATE/UPDATE/DELETE operation no others. The reason we need stored procedure is  that
	- We need LAST_INSERT_ID() in Creation case; [?] <= However, via mysqli->insert_id can anyway get the new insert ID out!
	- We need transaction in any case; [?] <= It can also achieve in PHP layer!
- 2015.11.3, It's DECIDED that the HIH using 'yyyy.MM.dd' as the default UI format for date for now. The customizing the date formatting waiting for next version. The ISO format 'yyyy-MM-dd' for database storage is no change.
- 2015.11.4, Switch from UI-Grid to Smart-Table, because the unstable of UI-Grid as well as the performance. Customer plugin (directrive) created for Smart-Table to simulate the column footer.
- 2015.12.7, It's DECIDED that using Asset Flag in Account Category to distinguish between the accounts. The allowed the value of Asset Flag as following:
	- 1: For Asset;
	- 0: For Liability;
	- 2: For Outgoing Downpayment;
	- 3: For Incoming Downpayment;  
- To be updated.

### HIH, Website Version 
1. Version 0.1 to web 0.3, Using: jQuery, jEasyUI;
2. Version 0.4 to now, using Angular JS, Boostrap, ...

### HIH, Desktop Version
1. Version 1.0, named as PIH, built with MFC, Visual C++;
2. Version 2.0 - 4.0, ....
3. Version 4.0, named changed as HIH, built with .NET, Visual Stuido;
4. Version 5.0, built with .NET/WPF, Visual Studio;



