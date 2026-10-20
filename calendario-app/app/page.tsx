'use client';
import {useState, useEffect} from "react";
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";


 const localizer = dayjsLocalizer(dayjs);

type Event = {
  title: string;
  start: Date;
  end: Date;
}

type newEvent ={
  title : string;
  start:string;
  end:string;
}


export default function Home() {
  const [date, setDate] = useState<Date | null>(null);
useEffect(()=>{
  setDate(new Date());
},
[]);


  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<Event[]>([
    {
    start: dayjs().toDate(),
    end: dayjs().toDate(),
     title: 'Today',
  },
  ]);

  const [newEvent, setNewEvent] = useState<newEvent>({
    title:'',
    start:'',
    end:'',
  });


  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handledAddEvent = () => {
    if(newEvent.title === '' || newEvent.start == '' || newEvent.end === ''){
      alert('rellena todos los campos ');
      return;
    }

    if(editingIndex !== null){
      const updatedEvents = [...events];
      updatedEvents[editingIndex]={
        title: newEvent.title,
        start:dayjs(newEvent.start).toDate(),
        end:dayjs(newEvent.end).toDate(),
      };
      setEvents(updatedEvents);
    }else{
      setEvents([...events, {
        title:newEvent.title,
        start: dayjs(newEvent.start).toDate(),
        end: dayjs(newEvent.end).toDate(),
      },
    ]);
    }

    setShowModal(false);
    setEditingIndex(null);
    setNewEvent({title: '',start:'',end:''});
  }

  const handleDeleteEvent = () => {
    if (editingIndex !== null) {
      setEvents(events.filter((_, index) => index !== editingIndex));
    }
    setShowModal(false);
    setEditingIndex(null);
    setNewEvent({title: '',start:'',end:''});
  }


  return (
    <div style={{
        height : "100vh",
        width: "100vw",  
        fontFamily: 'var(--font-geist-sans)',
        color: 'var(--foreground)',
      }}>

      <h1 style={{fontfamily:'var(--font-geist-sans)',fontSize: '3rem',fontWeight:'bold'}}>
        Calendario Despliegue
      </h1>

      <p style={{fontfamily:'var(--font-geist-sans)',fontSize: '1.5rem',fontWeight:'normal'}}>
        Organiza toda clase de cosas
      </p>

      <Button style={{fontfamily:'var(--font-geist-sans)'}} onClick={() => {
        setEditingIndex(null);
        setShowModal(true);
      }}>
        Añadir nuevo evento

      </Button>

      {showModal && (
        <div style={{position:"fixed",top:"50%",left:"50%",padding:"2rem",backgroundColor:"var(--card)",borderRadius:"1rem",display:"flex",flexDirection:"column",gap:"1rem",zIndex:1000,backgroundColor:"var(--card)"}}>

          <input placeholder='Titulo del evento nuevo' value= {newEvent.title} onChange = {(e) => setNewEvent({...newEvent,title:e.target.value})} style={{padding:"0.5rem",borderRadius:"0.25rem",border:"1px solid var(--border)",fontFamily: "var(--font-geist-sans)"}}/>
          <input type="datetime-local" value= {newEvent.start} onChange={(e) => setNewEvent({...newEvent,start:e.target.value})} style={{padding:"0.5rem",borderRadius:"0.25rem",border:"1px solid var(--border)",fontFamily: "var(--font-geist-sans)"}}/>
          <input type="datetime-local" value={newEvent.end} onChange={(e)=> setNewEvent({...newEvent,end: e.target.value})} style={{padding:"0.5rem",borderRadius:"0.25rem",border:"1px solid var(--border)",fontFamily: "var(--font-geist-sans)"}}/>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={handledAddEvent}>
              {editingIndex !== null ? 'Actualizar' : 'Crear'}
            </Button>
            {editingIndex !== null && (
              <Button variant="destructive" onClick={handleDeleteEvent}>Eliminar</Button>
            )}
            <Button variant="destructive" onClick={()=> setShowModal(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {date !== null &&(
        <Calendar
      localizer={localizer}
      events = {events}
      startAccessor="start"
      endAccessor="end"
      date={date}
      view={view}
      onNavigate = {setDate}
      onView={setView}
      onSelectEvent={(event)=>{
        const index = events.findIndex(e => e === event);
        setEditingIndex(index);
        setNewEvent({
          title:event.title,
          start: dayjs(event.start).format('YYYY-MM-DDTHH:mm'),
          end: dayjs(event.end).format('YYYY-MM-DDTHH:mm'),
        });
        setShowModal(true);
      }}
      formats={{
        dayHeaderFormat: (date) => dayjs(date).format('DD/MM/YYYY')
      }}
     
      style = {{height:700}}
      />
      )}
      
      </div>
  );
}
