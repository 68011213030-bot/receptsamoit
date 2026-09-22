const CONFIG = {
  APP_NAME: 'Reception & Secretary Management System',
  ORG_NAME: 'Samoit | Faculty of Informatics Student Club',
  TIMEZONE: 'Asia/Bangkok',
  THEME: {primary:'#1565C0', navy:'#0B1F33', bg:'#F4F7FB', white:'#FFFFFF'},
  LOGO_URL: 'https://i.postimg.cc/4NpRDfX4/CMDCS.png',
  SPREADSHEET_ID: '', // ใส่ Spreadsheet ID หากต้องการใช้ไฟล์ที่มีอยู่แล้ว
  ROOT_FOLDER_ID: '', // ใส่ Folder ID หากต้องการใช้โฟลเดอร์ที่มีอยู่แล้ว
  INITIAL_ADMIN: '68011213030@msu.ac.th',
  SESSION_TTL_SECONDS: 21600,
  DEADLINE_REMIND_DAYS: [3,1,0],
  EVENT_REMIND_DAYS: [7,3,1,0],
  SHEETS: [
    'CONFIG','ADMINS','USERS','DOCUMENTS_IN','DOCUMENTS_OUT','PARCELS',
    'LOST_FOUND','EVENTS','ANNOUNCEMENTS','EMAIL_LOG','NOTIFICATIONS',
    'AUDIT_LOG','SYSTEM_SETTINGS'
  ],
  DRIVE_PATHS: [
    '01_Documents/Incoming','01_Documents/Outgoing','02_Parcels/Photos',
    '03_Lost_and_Found/Lost','03_Lost_and_Found/Found','04_Events/Attachments',
    '05_Announcements','06_Email_Attachments','07_Reports','99_System/Backup','99_System/Logs'
  ]
};

const SCHEMA = {
  CONFIG: ['Key','Value','UpdatedAt'],
  ADMINS: ['AdminID','Email','Name','Role','Permissions','Status','CreatedAt','UpdatedAt'],
  USERS: ['UserID','Email','Name','Phone','Department','Status','CreatedAt','UpdatedAt'],
  DOCUMENTS_IN: ['DocumentID','ReceivedDate','ReceivedTime','Sender','Department','Email','Phone','Subject','Attention','Details','Receiver','DueDate','FileUrl','Note','Status','CreatedBy','CreatedAt','UpdatedAt'],
  DOCUMENTS_OUT: ['DocumentID','SentDate','SentTime','Recipient','Department','Email','Phone','Subject','Attention','Details','FileUrl','ReplyDueDate','Operator','Status','CreatedBy','CreatedAt','UpdatedAt'],
  PARCELS: ['ParcelID','Date','Time','Depositor','DepositorEmail','DepositorPhone','Recipient','RecipientEmail','RecipientPhone','Type','Details','Carrier','TrackingNumber','PhotoUrl','DueDate','PickupCode','ActualReceiver','ReceivedAt','Note','Status','CreatedBy','CreatedAt','UpdatedAt'],
  LOST_FOUND: ['ItemID','Kind','Name','Category','Details','Color','Location','Date','Time','ImageUrl','Reporter','Email','Phone','Note','Status','MatchedItemID','OwnerConfirmed','CreatedBy','CreatedAt','UpdatedAt'],
  EVENTS: ['EventID','Title','Type','Start','End','Location','Responsible','Email','Budget','Participants','Details','AttachmentUrl','Note','Status','CreatedBy','CreatedAt','UpdatedAt'],
  ANNOUNCEMENTS: ['AnnouncementID','Title','Description','ImageUrl','PublishDate','ExpireDate','Priority','Pinned','Status','Link','PublishedBy','CreatedAt','UpdatedAt'],
  EMAIL_LOG: ['EmailID','To','CC','BCC','Subject','Body','AttachmentUrls','Template','Status','Error','SentBy','SentAt'],
  NOTIFICATIONS: ['NotificationID','UserEmail','Title','Message','Type','ReferenceID','Read','CreatedAt'],
  AUDIT_LOG: ['AuditID','UserEmail','Action','Module','RecordID','Details','DateTime'],
  SYSTEM_SETTINGS: ['Key','Value','UpdatedAt']
};
