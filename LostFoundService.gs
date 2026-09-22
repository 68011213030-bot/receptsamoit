const LostFoundService = {
  list(token,kind,status){ AuthService.require(token,'LOST_FOUND_VIEW'); let r=DatabaseService.rows('LOST_FOUND'); if(kind) r=r.filter(x=>x.Kind===kind); if(status) r=r.filter(x=>x.Status===status); return {ok:true,data:r.reverse()}; },
  save(token,d){
    const user=AuthService.require(token,'LOST_FOUND_EDIT'); d=d||{}; const id=d.ItemID||Utils.uuid('ITEM');
    const obj={...d,ItemID:id,CreatedBy:d.CreatedBy||user.email,CreatedAt:d.CreatedAt||Utils.iso(new Date()),UpdatedAt:Utils.iso(new Date()),Status:d.Status||'แจ้งรายการ'};
    DatabaseService.upsert('LOST_FOUND','ItemID',obj); AuditService.write(user.email,'SAVE_LOST_FOUND','LOST_FOUND',id,'บันทึกรายการ'); return {ok:true,data:obj};
  },
  match(token,id){
    const user=AuthService.require(token,'LOST_FOUND_EDIT'), rows=DatabaseService.rows('LOST_FOUND'), target=rows.find(x=>x.ItemID===id);
    if(!target) throw new Error('ไม่พบรายการ');
    const opposite=rows.filter(x=>x.Kind!==target.Kind && ['แจ้งรายการ','กำลังตรวจสอบ','พบสิ่งของ'].includes(x.Status));
    const score=(a,b)=>{let s=0; if(a.Category&&b.Category&&a.Category===b.Category)s+=3;if(a.Color&&b.Color&&a.Color===b.Color)s+=2;if(a.Location&&b.Location&&a.Location===b.Location)s+=2;if(a.Name&&b.Name&&String(a.Name).toLowerCase().includes(String(b.Name).toLowerCase()))s+=3; const da=Utils.daysFromToday(a.Date),db=Utils.daysFromToday(b.Date); if(da!==null&&db!==null&&Math.abs(da-db)<=2)s+=2; return s;};
    const matches=opposite.map(x=>({...x,score:score(target,x)})).filter(x=>x.score>=3).sort((a,b)=>b.score-a.score);
    AuditService.write(user.email,'MATCH_LOST_FOUND','LOST_FOUND',id,'ค้นหารายการที่มีความสอดคล้อง');
    return {ok:true,data:matches};
  }
};
