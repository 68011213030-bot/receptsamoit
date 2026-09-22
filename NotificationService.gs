const NotificationService = {
  list(token){ const u=AuthService.requireSession(token).user; return {ok:true,data:DatabaseService.rows('NOTIFICATIONS').filter(x=>!x.UserEmail||x.UserEmail===u.email).reverse().slice(0,50)}; },
  create(email,title,message,type,ref){ DatabaseService.append('NOTIFICATIONS',{NotificationID:Utils.uuid('NTF'),UserEmail:email||'',Title:title,Message:message,Type:type||'INFO',ReferenceID:ref||'',Read:'0',CreatedAt:Utils.iso(new Date())}); }
};
