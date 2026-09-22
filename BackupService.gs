const BackupService = {
  run(token){
    const user=AuthService.require(token,'BACKUP');
    const root=DatabaseService.rootFolder(), it=root.getFoldersByName('99_System'); let sys=it.hasNext()?it.next():root.createFolder('99_System');
    const bit=sys.getFoldersByName('Backup'); const folder=bit.hasNext()?bit.next():sys.createFolder('Backup');
    const stamp=Utilities.formatDate(new Date(),CONFIG.TIMEZONE,'yyyyMMdd_HHmmss');
    const backupFolder=folder.createFolder('Backup_'+stamp);
    CONFIG.SHEETS.forEach(name=>{
      const rows=DatabaseService.rows(name), csv=[SCHEMA[name].join(','),...rows.map(o=>SCHEMA[name].map(h=>JSON.stringify(o[h]??'')).join(','))].join('\n');
      backupFolder.createFile(name+'.csv',csv,MimeType.CSV);
    });
    AuditService.write(user.email,'BACKUP_NOW','SYSTEM',backupFolder.getId(),'สร้าง Backup '+stamp);
    return {ok:true,data:{folderId:backupFolder.getId(),name:backupFolder.getName()}};
  }
};
