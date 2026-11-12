'use client';

import { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";

const localizer = dayjsLocalizer(dayjs);

type Event = {
  title: string;
  start: Date;
  end: Date;
};

type NewEvent = {
  title: string;
  start: string;
  end: string;
};

export default function Home() {
  const [date, setDate] = useState<Date | null>(null);

  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const [events, setEvents] = useState<Event[]>([
    {
      start: dayjs().toDate(),
      end: dayjs().add(1, 'hour').toDate(),
      title: 'Today',
    },
  ]);

  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    start: '',
    end: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setDate(new Date());
  }, []);

  const limpiarFormulario = () => {
    setNewEvent({
      title: '',
      start: '',
      end: '',
    });

    setEditingIndex(null);
    setShowModal(false);
  };

  const handledAddEvent = () => {
    if (
      newEvent.title.trim() === '' ||
      newEvent.start === '' ||
      newEvent.end === ''
    ) {
      alert('Rellena todos los campos');
      return;
    }

    const fechaInicio = dayjs(newEvent.start);
    const fechaFin = dayjs(newEvent.end);

    if (!fechaInicio.isValid() || !fechaFin.isValid()) {
      alert('Introduce fechas válidas');
      return;
    }

    if (!fechaFin.isAfter(fechaInicio)) {
      alert('La fecha de finalización debe ser posterior a la de inicio');
      return;
    }

    const evento: Event = {
      title: newEvent.title.trim(),
      start: fechaInicio.toDate(),
      end: fechaFin.toDate(),
    };

    if (editingIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editingIndex] = evento;
      setEvents(updatedEvents);
    } else {
      setEvents([...events, evento]);
    }

    limpiarFormulario();
  };

  const handleDeleteEvent = () => {
    if (editingIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents.splice(editingIndex, 1);
      setEvents(updatedEvents);
    }

    limpiarFormulario();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "2rem",
        fontFamily: "var(--font-geist-sans)",
        color: "var(--foreground)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "3rem",
          fontWeight: "bold",
        }}
      >
        Calendario Despliegue
      </h1>

      <p
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "1.5rem",
          fontWeight: "normal",
        }}
      >
        Organiza toda clase de cosas
      </p>

      <Button
        onClick={() => {
          setEditingIndex(null);
          setNewEvent({
            title: '',
            start: '',
            end: '',
          });
          setShowModal(true);
        }}
      >
        Añadir nuevo evento
      </Button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "2rem",
              backgroundColor: "var(--card)",
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "350px",
              color: "var(--foreground)",
            }}
          >
            <h2>
              {editingIndex !== null ? 'Editar evento' : 'Nuevo evento'}
            </h2>

            <input
              placeholder="Título del evento"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  title: e.target.value,
                })
              }
              style={{
                padding: "0.5rem",
                borderRadius: "0.25rem",
                border: "1px solid var(--border)",
              }}
            />

            <label>Fecha de inicio</label>

            <input
              type="datetime-local"
              value={newEvent.start}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  start: e.target.value,
                })
              }
              style={{
                padding: "0.5rem",
                borderRadius: "0.25rem",
                border: "1px solid var(--border)",
              }}
            />

            <label>Fecha de finalización</label>

            <input
              type="datetime-local"
              value={newEvent.end}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  end: e.target.value,
                })
              }
              style={{
                padding: "0.5rem",
                borderRadius: "0.25rem",
                border: "1px solid var(--border)",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <Button onClick={handledAddEvent}>
                {editingIndex !== null ? 'Actualizar' : 'Crear'}
              </Button>

              {editingIndex !== null && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteEvent}
                >
                  Eliminar
                </Button>
              )}

              <Button
                variant="outline"
                onClick={limpiarFormulario}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {date !== null && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          onSelectEvent={(event) => {
            const index = events.findIndex((e) => e === event);

            setEditingIndex(index);

            setNewEvent({
              title: event.title,
              start: dayjs(event.start).format('YYYY-MM-DDTHH:mm'),
              end: dayjs(event.end).format('YYYY-MM-DDTHH:mm'),
            });

            setShowModal(true);
          }}
          formats={{
            dayHeaderFormat: (date) =>
              dayjs(date).format('DD/MM/YYYY'),
          }}
          style={{
            height: 700,
            marginTop: "2rem",
          }}
        />
      )}
    </div>
  );
}
