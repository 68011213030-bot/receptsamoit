function setupReceptionSystem() {
  const result = DatabaseService.initialize();
  return result;
}
function setInitialAdminPassword(password) {
  if(!password || String(password).length < 8) throw new Error('Password ต้องมีอย่างน้อย 8 ตัวอักษร');
  PropertiesService.getScriptProperties().setProperty('PWD_'+CONFIG.INITIAL_ADMIN,Utils.hash(password));
  return {ok:true};
}
function setConfigIds(spreadsheetId,rootFolderId) {
  if(spreadsheetId) PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID',spreadsheetId);
  if(rootFolderId) PropertiesService.getScriptProperties().setProperty('ROOT_FOLDER_ID',rootFolderId);
  return {ok:true};
}

function googleLogin() { return AuthService.googleLogin(); }
