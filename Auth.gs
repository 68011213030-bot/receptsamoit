const AuthService = {
  sessions() { return CacheService.getScriptCache(); },
  login(email,password) {
    email=Utils.clean(email).toLowerCase();
    if(!Utils.isEmail(email)) throw new Error('กรุณาระบุ Email ให้ถูกต้อง');
    const admins=DatabaseService.rows('ADMINS');
    const admin=admins.find(a=>String(a.Email).toLowerCase()===email && a.Status==='ACTIVE');
    if(!admin) throw new Error('บัญชีนี้ไม่มีสิทธิ์เข้าใช้งาน');
    // หากยังไม่ตั้ง Password ให้ใช้ Google Login หรือ AdminService ตั้ง Password ผ่านระบบภายหลัง
    const stored=PropertiesService.getScriptProperties().getProperty('PWD_'+email);
    if(!stored) {
      if(password !== CONFIG.INITIAL_ADMIN && email===CONFIG.INITIAL_ADMIN) {
        // first-run compatibility: no password is accepted; force initialization through Google access.
        throw new Error('บัญชีนี้ยังไม่ได้ตั้งรหัสผ่าน กรุณาใช้ Google Login');
      }
      throw new Error('ยังไม่ได้ตั้งรหัสผ่านสำหรับบัญชีนี้');
    }
    if(Utils.hash(password)!==stored) throw new Error('Email หรือรหัสผ่านไม่ถูกต้อง');
    return this.createSession(admin);
  },
  googleLogin() {
    const email=String(Session.getActiveUser().getEmail()||'').toLowerCase();
    if(!email) throw new Error('ไม่สามารถอ่าน Google Account ได้ กรุณา Deploy แบบจำกัดโดเมน หรือใช้ Password Login');
    const admin=DatabaseService.rows('ADMINS').find(a=>String(a.Email).toLowerCase()===email && a.Status==='ACTIVE');
    if(!admin) throw new Error('Google Account นี้ไม่มีสิทธิ์เข้าใช้งาน');
    return this.createSession(admin);
  },
  createSession(admin) {
    const token=Utilities.getUuid();
    this.sessions().put('SESSION_'+token,JSON.stringify({email:admin.Email,role:admin.Role,created:Date.now()}),CONFIG.SESSION_TTL_SECONDS);
    return {ok:true,token, user:{email:admin.Email,name:admin.Name,role:admin.Role,permissions:admin.Permissions}};
  },
  requireSession(token) {
    const raw=this.sessions().get('SESSION_'+String(token||''));
    if(!raw) throw new Error('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
    const s=JSON.parse(raw);
    const admin=DatabaseService.rows('ADMINS').find(a=>String(a.Email).toLowerCase()===String(s.email).toLowerCase() && a.Status==='ACTIVE');
    if(!admin) throw new Error('บัญชีถูกปิดใช้งาน');
    this.sessions().put('SESSION_'+token,JSON.stringify({email:admin.Email,role:admin.Role,created:s.created}),CONFIG.SESSION_TTL_SECONDS);
    return {ok:true,user:{email:admin.Email,name:admin.Name,role:admin.Role,permissions:admin.Permissions}};
  },
  logout(token){ this.sessions().remove('SESSION_'+String(token||'')); return {ok:true}; },
  can(token,permission) {
    const s=this.requireSession(token).user;
    if(s.role==='SUPER_ADMIN') return true;
    if(s.role==='ADMIN') return true;
    if(s.permissions==='*') return true;
    return String(s.permissions||'').split(',').map(x=>x.trim()).includes(permission);
  },
  require(token,permission) { if(!this.can(token,permission)) throw new Error('ไม่มีสิทธิ์ดำเนินการนี้'); return this.requireSession(token).user; }
};
