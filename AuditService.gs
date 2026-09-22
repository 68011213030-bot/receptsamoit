const AuditService = {
  write(email,action,module,id,details) {
    DatabaseService.append('AUDIT_LOG',{AuditID:Utils.uuid('AUD'),UserEmail:email,Action:action,Module:module,RecordID:id||'',Details:Utils.clean(details),DateTime:Utils.iso(new Date())});
  },
  list(token) {
    AuthService.require(token,'AUDIT_VIEW');
    return {ok:true,data:DatabaseService.rows('AUDIT_LOG').slice(-500).reverse()};
  }
};
