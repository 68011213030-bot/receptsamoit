const AnnouncementService = {
  list(token,publicOnly){
    if(publicOnly) { let r=DatabaseService.rows('ANNOUNCEMENTS').filter(x=>x.Status==='PUBLISHED' && (!x.ExpireDate || new Date(x.ExpireDate)>=new Date())); return {ok:true,data:r.sort((a,b)=>(b.Pinned-a.Pinned)||(b.Priority-a.Priority)||String(b.PublishDate).localeCompare(String(a.PublishDate)))}; }
    AuthService.require(token,'ANNOUNCEMENTS_VIEW'); return {ok:true,data:DatabaseService.rows('ANNOUNCEMENTS').reverse()};
  },
  save(token,d){ const user=AuthService.require(token,'ANNOUNCEMENTS_EDIT'); d=d||{}; const id=d.AnnouncementID||Utils.uuid('ANN'); const o={...d,AnnouncementID:id,PublishedBy:d.PublishedBy||user.email,CreatedAt:d.CreatedAt||Utils.iso(new Date()),UpdatedAt:Utils.iso(new Date()),Status:d.Status||'DRAFT',Pinned:d.Pinned?'1':'0',Priority:d.Priority||0}; DatabaseService.upsert('ANNOUNCEMENTS','AnnouncementID',o); AuditService.write(user.email,'SAVE_ANNOUNCEMENT','ANNOUNCEMENTS',id,'บันทึกประกาศ'); return {ok:true,data:o}; },
  remove(token,id){ const user=AuthService.require(token,'ANNOUNCEMENTS_EDIT'); const ok=DatabaseService.remove('ANNOUNCEMENTS','AnnouncementID',id); if(ok) AuditService.write(user.email,'DELETE_ANNOUNCEMENT','ANNOUNCEMENTS',id,'ลบประกาศ'); return {ok}; }
};
