const DashboardService = {
  get(token){
    AuthService.require(token,'DASHBOARD_VIEW');
    const docs=DatabaseService.rows('DOCUMENTS_IN').concat(DatabaseService.rows('DOCUMENTS_OUT'));
    const parcels=DatabaseService.rows('PARCELS'), lf=DatabaseService.rows('LOST_FOUND'), events=DatabaseService.rows('EVENTS'), anns=DatabaseService.rows('ANNOUNCEMENTS');
    const pendingDocs=docs.filter(x=>!['เสร็จสิ้น','ยกเลิก','ส่งแล้ว'].includes(x.Status));
    const overdueDocs=docs.filter(x=>x.DueDate && Utils.daysFromToday(x.DueDate)<0 && !['เสร็จสิ้น','ยกเลิก'].includes(x.Status));
    return {ok:true,data:{
      documents:docs.length,pendingDocuments:pendingDocs.length,overdueDocuments:overdueDocs.length,
      parcels:parcels.length,pendingParcels:parcels.filter(x=>x.Status==='รอผู้รับ').length,deliveredParcels:parcels.filter(x=>x.Status==='ส่งมอบแล้ว').length,
      lost:lf.filter(x=>x.Kind==='LOST').length,found:lf.filter(x=>x.Kind==='FOUND').length,
      upcomingEvents:events.filter(x=>x.Start && new Date(x.Start)>=new Date()).slice(0,5),
      announcements:anns.filter(x=>x.Status==='PUBLISHED').slice(-5).reverse(),
      notifications:DatabaseService.rows('NOTIFICATIONS').slice(-20).reverse()
    }};
  }
};
