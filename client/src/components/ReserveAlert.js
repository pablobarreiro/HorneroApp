import { useSelector, useDispatch } from "react-redux";
import { BsFillShareFill,BsDashCircle, BsPlusCircle } from "react-icons/bs";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import { getReservations, newReservation } from "../store/reservations";
import { getFavorites, removeFavorite, addFavorite } from "../store/favorites";

const ReserveAlert = ({
  Show,
  setShow,
  officeNameOk,
  handleCancelReserve,
  selectedOffice,
  date,
  hour,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const favorites = useSelector((state) => state.favorites);

  const handleRemoveFromFavorites = async (desk) => {
    await dispatch(removeFavorite(`${officeNameOk}:${desk}`));
    dispatch(getFavorites());
  };

  const handleAddToFavorites = async (desk) => {
    await dispatch(addFavorite(`${officeNameOk}:${desk}`));
    dispatch(getFavorites());
  };

  //confirmacion de la reserva
  const reserveConfirmation = async () => {
    try {
      await dispatch(
        newReservation({
          start: `${date}T${hour}`,
          user: user._id,
          booking: Show.desk,
          office: selectedOffice._id,
        })
      );
      await dispatch(getReservations(selectedOffice._id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Alert variant="info" show={Show} onClose={() => setShow("")} dismissible>
      {Show.desk && (
        <Alert.Heading>
        <div style={{display:'flex',alignItems:"center",justifyContent:'space-around'}}>
          <h2>{`Escritorio ${Show.desk.split("D")[1]}`}</h2>
        
          {favorites.includes(`${officeNameOk}:${Show.desk}`) ? (
            <button
              style={{ marginBottom: "8px" }}
              className={"mx-2 ml-10 main-button-black"}
              onClick={() => handleRemoveFromFavorites(Show.desk)}
            >
              <BsDashCircle size={20} /> Favorito
            </button>
          ) : (
            <button
              style={{ marginBottom: "8px" }}
              className={"mx-2 ml-10 main-button"}
              onClick={() => handleAddToFavorites(Show.desk)}
            >
              <BsPlusCircle size={20} /> Favorito
            </button>
          )}
        </div>
        </Alert.Heading>
      )}
      <hr/>
      {Show.reserve[0] ? (
        <>
          <p> Reservado por </p>
          <p>
            <Image
              roundedCircle="true"
              thumbnail="true"
              src={Show.reserve[0].user.imgUrl}
              style={{ width: "20%", height: "auto", maxWidth: "100px" }}
            />
            <strong>
              {" "}
              {Show.reserve[0].user.name} {Show.reserve[0].user.surname}{" "}
            </strong>
          </p>
          <span>
            Desde: <strong>{Show.reserve[0].start.slice(-5)} hs</strong>
          </span>
          {" | "}
          <span>
            Hasta: <strong>{Show.reserve[0].end} hs</strong>
          </span>
        </>
      ) : (
        <>
          <p>
            {" "}
            Este escritorio está <strong>libre</strong>.
          </p>{" "}
          <p>¡Hace tu reserva!</p>
        </>
      )}

      <hr />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >

        {!Show.reserve[0] ? (
          <button
            className={"mx-2 main-button"}
            onClick={() => reserveConfirmation()}
          >
            Reservar
          </button>
        ) : (
          Show.reserve[0].user._id === user._id && (
            <div style={{display:'flex',justifyContent:'space-around'}}>
            <button className={"main-button"}><BsFillShareFill/> Compartir</button>
            <button
              className={"mx-2 main-button-black"}
              onClick={() => handleCancelReserve(Show.reserve[0]._id)}
            >
              Cancelar Reserva
            </button>
            </div>
          )
        )}
      </div>
    </Alert>
  );
};

export default ReserveAlert;
