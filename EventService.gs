const EventService = {
  list(token){ AuthService.require(token,'CALENDAR_VIEW'); return {ok:true,data:DatabaseService.rows('EVENTS').sort((a,b)=>new Date(a.Start)-new Date(b.Start))}; },
  save(token,d){ const user=AuthService.require(token,'CALENDAR_EDIT'); d=d||{}; const id=d.EventID||Utils.uuid('EVT'); const o={...d,EventID:id,CreatedBy:d.CreatedBy||user.email,CreatedAt:d.CreatedAt||Utils.iso(new Date()),UpdatedAt:Utils.iso(new Date()),Status:d.Status||'ACTIVE'}; DatabaseService.upsert('EVENTS','EventID',o); AuditService.write(user.email,'SAVE_EVENT','EVENTS',id,'บันทึกกิจกรรม'); return {ok:true,data:o}; },
  remove(token,id){ const user=AuthService.require(token,'CALENDAR_EDIT'); const ok=DatabaseService.remove('EVENTS','EventID',id); if(ok) AuditService.write(user.email,'DELETE_EVENT','EVENTS',id,'ลบกิจกรรม'); return {ok}; }
};
