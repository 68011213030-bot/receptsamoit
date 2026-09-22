function installTriggers() {
  const handlers=['runDeadlineAutomation','runParcelAutomation','runEventAutomation','expireAnnouncements','runDailyBackup'];
  ScriptApp.getProjectTriggers().forEach(t=>{ if(handlers.includes(t.getHandlerFunction())) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('runDeadlineAutomation').timeBased().everyHours(1).create();
  ScriptApp.newTrigger('runParcelAutomation').timeBased().everyHours(6).create();
  ScriptApp.newTrigger('runEventAutomation').timeBased().everyHours(6).create();
  ScriptApp.newTrigger('expireAnnouncements').timeBased().everyHours(6).create();
  ScriptApp.newTrigger('runDailyBackup').timeBased().everyDays(1).atHour(2).create();
  return {ok:true};
}
function runDeadlineAutomation() {
  DatabaseService.rows('DOCUMENTS_IN').concat(DatabaseService.rows('DOCUMENTS_OUT')).forEach(d=>{
    if(!d.DueDate || ['เสร็จสิ้น','ยกเลิก'].includes(d.Status)) return;
    const days=Utils.daysFromToday(d.DueDate);
    if(CONFIG.DEADLINE_REMIND_DAYS.includes(days) || days<0) {
      const emails=[d.Email].filter(Utils.isEmail);
      emails.forEach(e=>{ try{MailApp.sendEmail(e,'แจ้งเตือนกำหนดเอกสาร '+d.DocumentID,'เอกสาร '+d.DocumentID+' มีกำหนด '+d.DueDate+(days<0?' และเกินกำหนดแล้ว':'') );}catch(err){} });
    }
  });
}
function runParcelAutomation() {
  DatabaseService.rows('PARCELS').forEach(p=>{
    if(p.Status==='รอผู้รับ' && p.RecipientEmail && Utils.isEmail(p.RecipientEmail)) {
      try { MailApp.sendEmail(p.RecipientEmail,'มีพัสดุรอรับ '+p.ParcelID,'มีพัสดุรอรับ รหัสยืนยัน: '+p.PickupCode); } catch(e){}
    }
  });
}
function runEventAutomation() {
  DatabaseService.rows('EVENTS').forEach(e=>{
    if(!e.Start || !e.Email || !Utils.isEmail(e.Email)) return;
    const days=Utils.daysFromToday(e.Start);
    if(CONFIG.EVENT_REMIND_DAYS.includes(days)) { try{MailApp.sendEmail(e.Email,'แจ้งเตือนกิจกรรม '+e.Title,'กิจกรรม '+e.Title+' วันที่ '+e.Start+' สถานที่ '+e.Location);}catch(err){} }
  });
}
function expireAnnouncements() {
  DatabaseService.rows('ANNOUNCEMENTS').forEach(a=>{ if(a.ExpireDate && new Date(a.ExpireDate)<new Date() && a.Status==='PUBLISHED'){a.Status='EXPIRED';a.UpdatedAt=Utils.iso(new Date());DatabaseService.upsert('ANNOUNCEMENTS','AnnouncementID',a);} });
}
function runDailyBackup() {
  try { BackupService.runBySystem(); } catch(e) {}
}
BackupService.runBySystem = function() {
  const root=DatabaseService.rootFolder(), sysIt=root.getFoldersByName('99_System'), sys=sysIt.hasNext()?sysIt.next():root.createFolder('99_System');
  const bIt=sys.getFoldersByName('Backup'), folder=bIt.hasNext()?bIt.next():sys.createFolder('Backup');
  const stamp=Utilities.formatDate(new Date(),CONFIG.TIMEZONE,'yyyyMMdd_HHmmss'), bf=folder.createFolder('AUTO_'+stamp);
  CONFIG.SHEETS.forEach(name=>{const rows=DatabaseService.rows(name);const csv=[SCHEMA[name].join(','),...rows.map(o=>SCHEMA[name].map(h=>JSON.stringify(o[h]??'')).join(','))].join('\n');bf.createFile(name+'.csv',csv,MimeType.CSV);});
};
