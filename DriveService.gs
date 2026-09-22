const DriveService = {
  folders(token){ AuthService.require(token,'DRIVE_VIEW'); return {ok:true,data:CONFIG.DRIVE_PATHS}; },
  upload(token,name,mime,base64,path){
    const user=AuthService.require(token,'FILE_UPLOAD');
    const root=DatabaseService.rootFolder(); let folder=root;
    (path||'99_System/Logs').split('/').filter(Boolean).forEach(part=>{const it=folder.getFoldersByName(part); folder=it.hasNext()?it.next():folder.createFolder(part);});
    const blob=Utilities.newBlob(Utilities.base64Decode(base64),mime||'application/octet-stream',name);
    const file=folder.createFile(blob);
    AuditService.write(user.email,'UPLOAD_FILE','DRIVE',file.getId(),name);
    return {ok:true,data:{id:file.getId(),name:file.getName(),url:file.getUrl()}};
  }
};
