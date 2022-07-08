const express = require("express");
const router = express.Router();
const user = require("./users");
const favorites = require("./favorites");
const friends = require("./friends");


router.use("/users", user);
router.use("/favorites", favorites);
router.use("/friends", friends);

//rutas users
const UserControllers= require("../controllers/userControllers")
router.get("/users/:id/reservations", UserControllers.getAllReservations)


//rutas offices
const OfficeControlls = require("../controllers/officeControllers");
router.get("/offices", OfficeControlls.all);
router.post("/offices", OfficeControlls.create);
router.get("/offices/:id", OfficeControlls.find);
router.put("/offices/:id", OfficeControlls.update);
router.delete("/offices/:id", OfficeControlls.delete);


//rutas reservations
const ReservationControlls = require("../controllers/reservationControllers");
router.post("/reservations", ReservationControlls.create);
router.get("/reservations/:id", ReservationControlls.find);
router.put("/reservations/:id", ReservationControlls.update);
router.delete("/reservations/:id", ReservationControlls.delete);

//busca todas las reservas de una oficina por id
router.get("/reservations/office/:id", ReservationControlls.getAllReservationsByOffice)

//busca reservas pasadas de un user
router.get("/reservations/users/:id/date", ReservationControlls.getPastReservationsByUser)

//busca reservas futuras de un user
router.get("/reservations/users/date/:id", ReservationControlls.getFutureReservationsByUser)



router.get("/reservations/users/:id/date", ReservationControlls.getAllReservationsByUserAndDate)

module.exports = router;
