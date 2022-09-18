const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const appointment = [{
    title: 'Website Re-Design Plan',
    startDate: new Date(2022, 8, 24, 9, 35),
    endDate: new Date(2022, 8, 24, 11, 30),
    id: 0,
    location: 'Room 1',
}, {
    title: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2022, 8, 20, 12, 11),
    endDate: new Date(2018, 8, 20, 13, 0),
    id: 1,
    location: 'Room 1',
}, {
    title: 'Install New Router in Dev Room',
    startDate: new Date(2018, 5, 25, 14, 30),
    endDate: new Date(2018, 5, 25, 15, 35),
    id: 2,
    location: 'Room 2',
}];

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ appointment: appointment });
});

app.post("/api", (req, res) => {
    console.log("call api for push");
    console.log(req.body.item);
    appointment.push(req.body.item);
    console.log(appointment);
    res.json({ appointment: appointment });
});

app.delete("/api/:id", (req, res) => {
    console.log("call api for delete")
    appointment.filter(x => x.id !== req.params.id);
    res.json({ appointment: appointment });
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});