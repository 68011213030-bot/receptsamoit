const ParcelService = {
  list(token,status){ AuthService.require(token,'PARCELS_VIEW'); let r=DatabaseService.rows('PARCELS'); if(status) r=r.filter(x=>x.Status===status); return {ok:true,data:r.reverse()}; },
  next(){ const y=Utils.year(), p='PK-'+y+'-'; const n=DatabaseService.rows('PARCELS').filter(x=>String(x.ParcelID).startsWith(p)).length+1; return p+('00000'+n).slice(-5); },
  save(token,d){
    const user=AuthService.require(token,'PARCELS_EDIT'); d=d||{}; const id=d.ParcelID||this.next();
    const obj={...d,ParcelID:id,PickupCode:d.PickupCode||String(Math.floor(100000+Math.random()*900000)),CreatedBy:d.CreatedBy||user.email,CreatedAt:d.CreatedAt||Utils.iso(new Date()),UpdatedAt:Utils.iso(new Date()),Status:d.Status||'รอผู้รับ'};
    DatabaseService.upsert('PARCELS','ParcelID',obj); AuditService.write(user.email,'SAVE_PARCEL','PARCELS',id,'บันทึกพัสดุ'); return {ok:true,data:obj};
  },
  remove(token,id){ const user=AuthService.require(token,'PARCELS_EDIT'); const ok=DatabaseService.remove('PARCELS','ParcelID',id); if(ok) AuditService.write(user.email,'DELETE_PARCEL','PARCELS',id,'ลบพัสดุ'); return {ok}; }
};
