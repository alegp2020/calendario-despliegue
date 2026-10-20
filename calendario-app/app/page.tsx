'use client';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { endianness } from 'os';


 const localizer = dayjsLocalizer(dayjs);

const events= [{
  title: "today",
  start: new Date('2019-05-05 10:22:00'),
  end: new Date('2019-05-05 10:42:00')
},
{
  title: "string",
   start: new Date('2019-05-05 12:22:00'),
  end: new Date('2019-05-05 13:42:00')
}]

export default function Home() {
  return (
    <div style={{
        height : "100vh",
        width: "200vh",  
      }}>
      <Calendar
      localizer={localizer}
      events = {events}
      startAccessor="start"
      endAccessor="end"
      style = {{height:700}}
      />
      </div>
  );
}
