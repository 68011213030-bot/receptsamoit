const DatabaseService = {
  ss() {
    if (CONFIG.SPREADSHEET_ID) return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const props = PropertiesService.getScriptProperties();
    const id = props.getProperty('SPREADSHEET_ID');
    if (id) return SpreadsheetApp.openById(id);
    const ss = SpreadsheetApp.create(CONFIG.APP_NAME + ' Database');
    props.setProperty('SPREADSHEET_ID', ss.getId());
    return ss;
  },
  rootFolder() {
    if (CONFIG.ROOT_FOLDER_ID) return DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);
    const props = PropertiesService.getScriptProperties();
    const id = props.getProperty('ROOT_FOLDER_ID');
    if (id) return DriveApp.getFolderById(id);
    const folder = DriveApp.createFolder(CONFIG.APP_NAME);
    props.setProperty('ROOT_FOLDER_ID', folder.getId());
    return folder;
  },
  sheet(name) {
    const sh = this.ss().getSheetByName(name);
    if (!sh) throw new Error('ไม่พบ Sheet: ' + name);
    return sh;
  },
  rows(name) {
    const sh = this.sheet(name), values = sh.getDataRange().getValues();
    if (values.length <= 1) return [];
    const headers = values[0];
    return values.slice(1).filter(r => r.some(v => v !== '')).map(r => {
      const o={}; headers.forEach((h,i)=>o[h]=r[i]); return o;
    });
  },
  append(name,obj) {
    const sh=this.sheet(name), headers=SCHEMA[name];
    sh.appendRow(headers.map(h=>obj[h] === undefined ? '' : obj[h]));
  },
  upsert(name,idField,obj) {
    const sh=this.sheet(name), headers=SCHEMA[name], vals=sh.getDataRange().getValues();
    const idx=headers.indexOf(idField);
    for(let r=1;r<vals.length;r++){
      if(String(vals[r][idx])===String(obj[idField])){
        sh.getRange(r+1,1,1,headers.length).setValues([headers.map(h=>obj[h]===undefined?vals[r][headers.indexOf(h)]:obj[h])]);
        return;
      }
    }
    this.append(name,obj);
  },
  remove(name,idField,id) {
    const sh=this.sheet(name), headers=SCHEMA[name], vals=sh.getDataRange().getValues(), idx=headers.indexOf(idField);
    for(let r=1;r<vals.length;r++) if(String(vals[r][idx])===String(id)){ sh.deleteRow(r+1); return true; }
    return false;
  },
  initialize() {
    const ss=this.ss(), root=this.rootFolder();
    CONFIG.SHEETS.forEach(name=>{
      let sh=ss.getSheetByName(name);
      if(!sh) sh=ss.insertSheet(name);
      const headers=SCHEMA[name];
      if(sh.getLastRow()===0) sh.getRange(1,1,1,headers.length).setValues([headers]);
      else if(sh.getRange(1,1,1,headers.length).getValues()[0].join('')==='') sh.getRange(1,1,1,headers.length).setValues([headers]);
      sh.setFrozenRows(1);
    });
    const paths={};
    CONFIG.DRIVE_PATHS.forEach(path=>{
      let current=root;
      path.split('/').forEach(part=>{
        const it=current.getFoldersByName(part);
        current=it.hasNext()?it.next():current.createFolder(part);
      });
      paths[path]=current.getId();
    });
    const admins=this.rows('ADMINS');
    if(!admins.some(a=>String(a.Email).toLowerCase()===CONFIG.INITIAL_ADMIN.toLowerCase())){
      this.append('ADMINS',{AdminID:Utils.uuid('ADM'),Email:CONFIG.INITIAL_ADMIN,Name:'Initial Admin',Role:'SUPER_ADMIN',Permissions:'*',Status:'ACTIVE',CreatedAt:Utils.iso(new Date()),UpdatedAt:Utils.iso(new Date())});
    }
    PropertiesService.getScriptProperties().setProperty('INITIALIZED','1');
    return {ok:true, spreadsheetId:ss.getId(), rootFolderId:root.getId(), folders:paths, sheets:CONFIG.SHEETS};
  }
};
