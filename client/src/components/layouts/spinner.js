import { Fragment } from "react";
import GIF from "../../img/spinner.gif";

const Spinner = () => {
  return (
    <Fragment>
      <img
        src={GIF}
        alt="spin-img"
        style={{ width: "20rem", margin: "auto", display: "block" }}
      />
    </Fragment>
  );
};
export default Spinner;
