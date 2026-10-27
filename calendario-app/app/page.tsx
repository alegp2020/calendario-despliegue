'use client';
import { useState, useEffect } from "react";
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

type newEvent = {
  title: string;
  start: string;
  end: string;
}

export default function Home() {
  const [date, setDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setDate(new Date());
    
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const eventosCargados = data.map((e: any) => ({
            title: e.title,
            start: new Date(e.start),
            end: new Date(e.end),
          }));
          setEvents(eventosCargados);
        }
      })
      .catch(err => console.error("Error cargando eventos:", err));
  }, []);

  const [newEvent, setNewEvent] = useState<newEvent>({
    title: '',
    start: '',
    end: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handledAddEvent = async () => {
    if (newEvent.title === '' || newEvent.start == '' || newEvent.end === '') {
      alert('rellena todos los campos ');
      return;
    }

    if (editingIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editingIndex] = {
        title: newEvent.title,
        start: dayjs(newEvent.start).toDate(),
        end: dayjs(newEvent.end).toDate(),
      };
      setEvents(updatedEvents);
    } else {
      try {
        const response = await fetch('/api/eventos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent)
        });

        if (response.ok) {
          const eventoGuardado = await response.json();
          setEvents([...events, {
            title: eventoGuardado.title,
            start: new Date(eventoGuardado.start),
            end: new Date(eventoGuardado.end),
          }]);
        }
      } catch (error) {
        alert("No se pudo guardar en la base de datos");
      }
    }

    setShowModal(false);
    setEditingIndex(null);
    setNewEvent({ title: '', start: '', end: '' });
  }

  const handleDeleteEvent = () => {
    if (editingIndex !== null) {
      setEvents(events.filter((_, index) => index !== editingIndex));
    }
    setShowModal(false);
    setEditingIndex(null);
    setNewEvent({ title: '', start: '', end: '' });
  }

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      fontFamily: 'var(--font-geist-sans)',
      color: 'var(--foreground)',
    }}>

      <h1 style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '3rem', fontWeight: 'bold' }}>
        Calendario Despliegue
      </h1>

      <p style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '1.5rem', fontWeight: 'normal' }}>
        Organiza toda clase de cosas
      </p>

      <Button style={{ fontFamily: 'var(--font-geist-sans)' }} onClick={() => {
        setEditingIndex(null);
        setShowModal(true);
      }}>
        Añadir nuevo evento
      </Button>

      {showModal && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "2rem", backgroundColor: "var(--card)", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1rem", zIndex: 1000, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" }}>
          <input placeholder='Titulo del evento nuevo' value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid var(--border)", fontFamily: "var(--font-geist-sans)" }} />
          <input type="datetime-local" value={newEvent.start} onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid var(--border)", fontFamily: "var(--font-geist-sans)" }} />
          <input type="datetime-local" value={newEvent.end} onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })} style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid var(--border)", fontFamily: "var(--font-geist-sans)" }} />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={handledAddEvent}>
              {editingIndex !== null ? 'Actualizar' : 'Crear'}
            </Button>
            {editingIndex !== null && (
              <Button variant="destructive" onClick={handleDeleteEvent}>Eliminar</Button>
            )}
            <Button variant="destructive" onClick={() => setShowModal(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {date !== null && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          onSelectEvent={(event) => {
            const index = events.findIndex(e => e === event);
            setEditingIndex(index);
            setNewEvent({
              title: event.title,
              start: dayjs(event.start).format('YYYY-MM-DDTHH:mm'),
              end: dayjs(event.end).format('YYYY-MM-DDTHH:mm'),
            });
            setShowModal(true);
          }}
          formats={{
            dayHeaderFormat: (date) => dayjs(date).format('DD/MM/YYYY')
          }}
          style={{ height: 700 }}
        />
      )}

    </div>
  );
}
