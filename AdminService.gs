const AdminService = {
  list(token){ AuthService.require(token,'ADMIN_MANAGE'); return {ok:true,data:DatabaseService.rows('ADMINS')}; },
  save(token,d){
    const user=AuthService.require(token,'ADMIN_MANAGE'); d=d||{};
    if(!Utils.isEmail(d.Email)) throw new Error('Email ไม่ถูกต้อง');
    const obj={AdminID:d.AdminID||Utils.uuid('ADM'),Email:Utils.clean(d.Email).toLowerCase(),Name:Utils.clean(d.Name),Role:d.Role||'VIEWER',Permissions:d.Permissions||'',Status:d.Status||'ACTIVE',CreatedAt:d.CreatedAt||Utils.iso(new Date()),UpdatedAt:Utils.iso(new Date())};
    DatabaseService.upsert('ADMINS','AdminID',obj);
    if(d.Password) PropertiesService.getScriptProperties().setProperty('PWD_'+obj.Email,Utils.hash(d.Password));
    AuditService.write(user.email,'SAVE_ADMIN','ADMIN',obj.AdminID,'บันทึกผู้ดูแล '+obj.Email);
    return {ok:true,data:obj};
  },
  disable(token,email){
    const user=AuthService.require(token,'ADMIN_MANAGE');
    const admins=DatabaseService.rows('ADMINS'), a=admins.find(x=>String(x.Email).toLowerCase()===String(email).toLowerCase());
    if(!a) throw new Error('ไม่พบผู้ดูแล');
    a.Status='INACTIVE'; a.UpdatedAt=Utils.iso(new Date()); DatabaseService.upsert('ADMINS','AdminID',a);
    AuditService.write(user.email,'DISABLE_ADMIN','ADMIN',a.AdminID,'ปิดใช้งาน '+a.Email);
    return {ok:true};
  },
  settings(token){ AuthService.require(token,'SETTINGS'); return {ok:true,data:DatabaseService.rows('SYSTEM_SETTINGS')}; },
  saveSettings(token,data){
    const user=AuthService.require(token,'SETTINGS');
    Object.keys(data||{}).forEach(k=>DatabaseService.upsert('SYSTEM_SETTINGS','Key',{Key:k,Value:String(data[k]),UpdatedAt:Utils.iso(new Date())}));
    AuditService.write(user.email,'UPDATE_SETTINGS','SYSTEM','','อัปเดตการตั้งค่า');
    return {ok:true};
  }
};
