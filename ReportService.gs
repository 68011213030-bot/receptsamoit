const ReportService = {
  get(token,type){
    AuthService.require(token,'REPORTS_VIEW');
    const map={incoming:'DOCUMENTS_IN',outgoing:'DOCUMENTS_OUT',parcels:'PARCELS',lostfound:'LOST_FOUND',events:'EVENTS',email:'EMAIL_LOG',audit:'AUDIT_LOG'};
    const sheet=map[type]||'DOCUMENTS_IN';
    return {ok:true,type,sheet,data:DatabaseService.rows(sheet)};
  }
};
