const EmailService = {
  templates(token){ AuthService.require(token,'EMAIL_SEND'); return {ok:true,data:[
    {id:'DOC_RECEIVE',name:'แจ้งรับเอกสาร',subject:'แจ้งรับเอกสาร {{DocumentID}}',body:'เรียน {{Receiver}}\\nระบบได้รับเอกสาร {{DocumentID}} เรื่อง {{Subject}} แล้ว'},
    {id:'DOC_SEND',name:'แจ้งส่งเอกสาร',subject:'แจ้งส่งเอกสาร {{DocumentID}}',body:'เรียน {{Recipient}}\\nเอกสาร {{DocumentID}} ได้ดำเนินการจัดส่งแล้ว'},
    {id:'PARCEL',name:'แจ้งพัสดุ',subject:'มีพัสดุรอรับ {{ParcelID}}',body:'มีพัสดุของท่านรอรับ รหัส {{PickupCode}}'},
    {id:'EVENT',name:'แจ้งกิจกรรม',subject:'แจ้งกิจกรรม {{Title}}',body:'กิจกรรม {{Title}} วันที่ {{Start}} สถานที่ {{Location}}'},
    {id:'LOST',name:'แจ้งของหาย',subject:'รายการของหาย {{ItemID}}',body:'ระบบได้รับแจ้งรายการ {{Name}} แล้ว'},
    {id:'GENERAL',name:'ประกาศทั่วไป',subject:'ประกาศจาก Reception',body:'{{Message}}'}
  ]}; },
  send(token,d){
    const user=AuthService.require(token,'EMAIL_SEND'); d=d||{};
    const to=Utils.clean(d.to); if(!Utils.isEmail(to) && !to.includes(',')) throw new Error('กรุณาระบุผู้รับ Email');
    const opts={htmlBody:String(d.body||'').replace(/\n/g,'<br>')};
    if(d.cc) opts.cc=d.cc; if(d.bcc) opts.bcc=d.bcc;
    if(d.attachments && d.attachments.length) opts.attachments=d.attachments.map(id=>DriveApp.getFileById(id).getBlob());
    let status='SENT', error='';
    try { MailApp.sendEmail(to,d.subject||'',d.body||'',opts); } catch(e){status='ERROR'; error=Utils.safeError(e);}
    const id=Utils.uuid('MAIL'); DatabaseService.append('EMAIL_LOG',{EmailID:id,To:to,CC:d.cc||'',BCC:d.bcc||'',Subject:d.subject||'',Body:d.body||'',AttachmentUrls:(d.attachments||[]).join(','),Template:d.template||'',Status:status,Error:error,SentBy:user.email,SentAt:Utils.iso(new Date())});
    AuditService.write(user.email,'SEND_EMAIL','EMAIL_LOG',id,status);
    if(status==='ERROR') throw new Error(error);
    return {ok:true,data:{EmailID:id,status}};
  }
};
