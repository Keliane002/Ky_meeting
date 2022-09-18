
import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import { appointments } from './appointments';

function getDate()
{
  let  today 		= new Date();
  let  dd 		= String(today.getDate()).padStart(2, '0');
  let  mm 		= String(today.getMonth() + 1).padStart(2, '0'); //janvier = 0
  let  yyyy 		= today.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
  //return dd + '/' + mm + '/' + yyyy; // change form if you need
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: appointments,
      currentDate: getDate(),

      addedAppointment: {},
      appointmentChanges: {},
      editingAppointment: undefined,
    };

    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
  }

  componentDidMount() {
    fetch("/api")
        .then(res => res.json())
        .then(
            (result) => {
              this.setState({
                data: result.appointment,
              });
              console.log(result.appointment);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
        )
  }

  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }

  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }

  changeEditingAppointment(editingAppointment) {
    this.setState({ editingAppointment });
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        fetch("/api", {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({item: { id: startingAddedId, ...added }})
        }).then(res => res.json())
            .then(
                (result) => {
                  this.setState({
                    data: result.appointment

                  });
                  console.log("bonjour j'ai rajouter ----> ")
                  console.log(result.appointment);
                  console.log("\n\n\n ")
                },

            )
      }

      if (changed) {
        data = data.map(appointment => (
            changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }

      if (deleted !== undefined) {

        fetch("/api/" + deleted, {
          method: "DELETE",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: deleted})
        }).then(res => res.json())
            .then(
                (result) => {
                  this.setState({
                    data: data.filter(appointment => appointment.id !== deleted)

                  });
                  console.log(data);
                },
                (error) => {
                }
            )
      }

      return { data };
    });
  }

  render() {
    const {
      currentDate, data, addedAppointment, appointmentChanges, editingAppointment,
    } = this.state;
    return (
        <Paper>
          <Scheduler
              data={data}
              height={660}
          >
            <ViewState
                currentDate={currentDate}
            />
            <EditingState
                onCommitChanges={this.commitChanges}
                addedAppointment={addedAppointment}
                onAddedAppointmentChange={this.changeAddedAppointment}
                appointmentChanges={appointmentChanges}
                onAppointmentChangesChange={this.changeAppointmentChanges}
                editingAppointment={editingAppointment}
                onEditingAppointmentChange={this.changeEditingAppointment}
            />
            <WeekView
                startDayHour={9}
                endDayHour={17}
            />
            <AllDayPanel />
            <EditRecurrenceMenu />
            <ConfirmationDialog />
            <Appointments />
            <AppointmentTooltip
                showOpenButton
                showDeleteButton
            />
            <AppointmentForm />
          </Scheduler>
        </Paper>
    );
  }
}

export default App;
