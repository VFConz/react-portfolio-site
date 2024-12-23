import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Contact } from "./Contact.jsx";
import OffCanvasButton from "./OffCanvasButton.jsx";
import { CVContainer } from "./CVContainer.jsx";


export default function App() {
  return (
    <>
      <OffCanvasButton />
      <Container id="home" className="bg-light px-5 pt-3">
        <CVContainer />
        <Contact />
      </Container>
    </>
  );
}
