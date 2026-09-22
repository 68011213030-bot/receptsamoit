const SearchService = {
  search(token,q){
    AuthService.require(token,'SEARCH');
    q=Utils.clean(q).toLowerCase(); if(!q) return {ok:true,data:[]};
    const sets=[
      ['Documents',DatabaseService.rows('DOCUMENTS_IN').concat(DatabaseService.rows('DOCUMENTS_OUT'))],
      ['Parcels',DatabaseService.rows('PARCELS')],
      ['Lost & Found',DatabaseService.rows('LOST_FOUND')],
      ['Events',DatabaseService.rows('EVENTS')],
      ['Announcements',DatabaseService.rows('ANNOUNCEMENTS')]
    ];
    const out=[];
    sets.forEach(([module,rows])=>rows.forEach(r=>{
      const hay=Object.values(r).join(' ').toLowerCase();
      if(hay.includes(q)) out.push({module,data:r});
    }));
    return {ok:true,data:out.slice(0,100)};
  }
};
