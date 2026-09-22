function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(CONFIG.APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function bootstrapSystem() {
  return DatabaseService.initialize();
}

function api(action, payload) {
  payload = payload || {};
  try {
    switch (action) {
      case 'config': return {ok:true, data:ConfigService.publicConfig()};
      case 'login': return AuthService.login(payload.email, payload.password);
      case 'logout': return AuthService.logout(payload.token);
      case 'me': return AuthService.requireSession(payload.token);
      case 'dashboard': return DashboardService.get(payload.token);
      case 'search': return SearchService.search(payload.token, payload.q || '');
      case 'documents': return DocumentService.list(payload.token, payload.type, payload.status);
      case 'documentSave': return DocumentService.save(payload.token, payload.data);
      case 'documentDelete': return DocumentService.remove(payload.token, payload.id);
      case 'parcels': return ParcelService.list(payload.token, payload.status);
      case 'parcelSave': return ParcelService.save(payload.token, payload.data);
      case 'parcelDelete': return ParcelService.remove(payload.token, payload.id);
      case 'lostFound': return LostFoundService.list(payload.token, payload.kind, payload.status);
      case 'lostFoundSave': return LostFoundService.save(payload.token, payload.data);
      case 'lostFoundMatch': return LostFoundService.match(payload.token, payload.id);
      case 'events': return EventService.list(payload.token);
      case 'eventSave': return EventService.save(payload.token, payload.data);
      case 'eventDelete': return EventService.remove(payload.token, payload.id);
      case 'announcements': return AnnouncementService.list(payload.token, payload.publicOnly);
      case 'announcementSave': return AnnouncementService.save(payload.token, payload.data);
      case 'announcementDelete': return AnnouncementService.remove(payload.token, payload.id);
      case 'emailSend': return EmailService.send(payload.token, payload.data);
      case 'emailTemplates': return EmailService.templates(payload.token);
      case 'reports': return ReportService.get(payload.token, payload.type);
      case 'admins': return AdminService.list(payload.token);
      case 'adminSave': return AdminService.save(payload.token, payload.data);
      case 'adminDisable': return AdminService.disable(payload.token, payload.email);
      case 'audit': return AuditService.list(payload.token);
      case 'notifications': return NotificationService.list(payload.token);
      case 'backup': return BackupService.run(payload.token);
      case 'settings': return AdminService.settings(payload.token);
      case 'settingsSave': return AdminService.saveSettings(payload.token, payload.data);
      default: throw new Error('ไม่พบคำสั่งที่ร้องขอ');
    }
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return {ok:false, error: Utils.safeError(err)};
  }
}
