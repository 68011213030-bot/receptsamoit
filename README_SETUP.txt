# Reception & Secretary Management System
Google Apps Script + Google Sheets + Google Drive + MailApp

## Files
Backend: Code.gs, Config.gs, Utils.gs, Database.gs, Auth.gs, DashboardService.gs,
DocumentService.gs, ParcelService.gs, LostFoundService.gs, EventService.gs,
AnnouncementService.gs, EmailService.gs, NotificationService.gs, SearchService.gs,
ReportService.gs, DriveService.gs, AuditService.gs, AdminService.gs, BackupService.gs,
Automation.gs, Setup.gs

Frontend: Index.html, Login.html, Sidebar.html, Dashboard.html, Documents.html,
Parcels.html, LostFound.html, Calendar.html, Announcements.html, Email.html,
Reports.html, Admin.html, Styles.html, Scripts.html

## Setup
1. Create a Google Apps Script project.
2. Add every .gs and .html file from this folder.
3. Run `setupReceptionSystem()` once and authorize.
4. Optional: run `setConfigIds(spreadsheetId, rootFolderId)` if you want existing resources.
5. Run `setInitialAdminPassword('your-strong-password')`.
6. Run `installTriggers()`.
7. Deploy > New deployment > Web app.
8. Execute as: Me. Access: choose the audience appropriate to your organization.
9. Open the Web App URL.

## Important
- The specification's initial admin is 68011213030@msu.ac.th.
- Server-side role/permission checks are applied before protected operations.
- Google Login requires the deployment/account configuration to expose the signed-in Google identity.
- Password Login uses a SHA-256 hash stored in Script Properties; plaintext passwords are not stored.
