import React, { useState } from "react";
import { Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

export default function OffCanvasButton() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <>
      <Button
        id="offCanvasButton"
        variant="light"
        onMouseOver={toggleShow}
        className="me-2 pb-5 pt-2">
        &lt;
      </Button>
      <Offcanvas
        show={show}
        onMouseLeave={handleClose}
        onHide={handleClose}
        scroll={true}
        backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Pretty Cool Right</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h1 className="text-center" style={{ fontSize: "34px" }}>
            Navigate Around Faster
          </h1>
          <Row className="g-3 px-4 my-auto">
            <Button variant="dark" href="#home" onClick={handleClose}>
              Home
            </Button>
            <Button variant="dark" href="#experience" onClick={handleClose}>
              Experience
            </Button>
            <Button variant="dark" href="#projects" onClick={handleClose}>
              Projects
            </Button>
            <Button variant="dark" href="#education" onClick={handleClose}>
              Education
            </Button>
            <Button variant="dark" href="#contact" onClick={handleClose}>
              Contact
            </Button>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
