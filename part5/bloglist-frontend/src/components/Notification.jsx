export default function Notification ({ notif }){
  return (
    <div>
      <h2 className={notif.type}>{notif.message}</h2>
    </div>
  )

}
