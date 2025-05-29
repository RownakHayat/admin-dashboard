import EventDetails from '@/components/Pages/Event/EventDetails/eventDetails';
import EventsDetails from '@/components/Pages/Events/EventsDetails/eventsDetails'
import WebLayout from '@/components/Pages/HomePage/webLayout'


export default function SingleEventPage() {
  return (
    <div>
      <WebLayout>
     <EventDetails/>
      </WebLayout>
    </div>
  );
}
