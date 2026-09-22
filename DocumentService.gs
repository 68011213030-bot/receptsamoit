const DocumentService = {
  list(token,type,status){
    AuthService.require(token,'DOCUMENTS_VIEW');
    let rows=type==='OUT'?DatabaseService.rows('DOCUMENTS_OUT'):type==='IN'?DatabaseService.rows('DOCUMENTS_IN'):DatabaseService.rows('DOCUMENTS_IN').concat(DatabaseService.rows('DOCUMENTS_OUT'));
    if(status) rows=rows.filter(x=>x.Status===status);
    return {ok:true,data:rows.reverse()};
  },
  next(type){
    const sheet=type==='OUT'?'DOCUMENTS_OUT':'DOCUMENTS_IN', prefix=type==='OUT'?'DOC-OUT-':'DOC-IN-', y=Utils.year();
    const n=DatabaseService.rows(sheet).filter(x=>String(x.DocumentID).indexOf(prefix+y+'-')===0).length+1;
    return prefix+y+'-'+('00000'+n).slice(-5);
  },
  save(token,d){
    const user=AuthService.require(token,'DOCUMENTS_EDIT'); d=d||{};
    const out=d.Type==='OUT';
    const id=d.DocumentID||this.next(out?'OUT':'IN');
    const base={...d,DocumentID:id,CreatedBy:d.CreatedBy||user.email,CreatedAt:d.CreatedAt||Utils.iso(new Date()),UpdatedAt:Utils.iso(new Date()),Status:d.Status||'รับเรื่อง'};
    delete base.Type;
    DatabaseService.upsert(out?'DOCUMENTS_OUT':'DOCUMENTS_IN','DocumentID',base);
    AuditService.write(user.email,'SAVE_DOCUMENT',out?'DOCUMENTS_OUT':'DOCUMENTS_IN',id,'บันทึกเอกสาร');
    return {ok:true,data:base};
  },
  remove(token,id){ const user=AuthService.require(token,'DOCUMENTS_EDIT'); const ok=DatabaseService.remove('DOCUMENTS_IN','DocumentID',id)||DatabaseService.remove('DOCUMENTS_OUT','DocumentID',id); if(ok) AuditService.write(user.email,'DELETE_DOCUMENT','DOCUMENTS',id,'ลบเอกสาร'); return {ok}; }
};
