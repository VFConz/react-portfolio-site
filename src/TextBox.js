import {
  ListGroup,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Container,
  Stack,
} from "react-bootstrap";
import { useState } from "react";

export default function TextBox({
  section,
  subtitle,
  subtitleColor,
  content,
  imgSrc,
  variant,
  list,
  href,
  modalHeader,
  modalSubtitle,
  modalContent,
  modalLink,
  id,
}) {
  const [modalShow, setModalShow] = useState(false);

  function ProductModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="display-5 fs-3">
            {modalHeader}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="lead fw-semibold">{modalSubtitle}</h4>
          <p className="text-justify">{modalContent}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  switch (variant) {
    case "project":
      return (
        <>
          <Card
            bg="dark"
            text="light"
            className="Card py-0 "
            style={{ width: "40rem" }}>
            <Row className="">
              <Col sm={6} md={6} className="p-0 px-2">
                <Card.Body
                  className="p-3"
                  style={{ bottom: "0%", top: "0%", position: "relative" }}>
                  <Card.Title>{section}</Card.Title>
                  <Card.Subtitle
                    className="mb-4"
                    style={{ color: subtitleColor }}>
                    {subtitle}
                  </Card.Subtitle>
                  <Card.Text>
                    <ul className="ProjList">
                      {list.map((item) => (
                        <li className="ProjList-L rounded-1 lead p-2 px-0">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card.Text>
                  <hr />
                  <div style={{ position: "relative", bottom: "0%" }}>
                    <Stack
                      gap={2}
                      className="col-md-5 mx-auto w-100"
                      style={{ height: "100%" }}>
                      <Button
                        className="fw-semibold text-decoration-none w-100"
                        variant="outline-light"
                        onClick={() => setModalShow(true)}>
                        Show More
                      </Button>
                      <Button
                        className="fw-semibold text-decoration-none w-100"
                        variant="outline-light"
                        href={href}>
                        Github Link
                      </Button>
                    </Stack>
                  </div>
                </Card.Body>
              </Col>

              <Col
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Card.Img
                  src={imgSrc}
                  id="accelerate"
                  className="image-fluid p-4 rounded-5 boxImgP"
                />
              </Col>
            </Row>
          </Card>
          <ProductModal show={modalShow} onHide={() => setModalShow(false)} />
        </>
      );
    case "education":
      return (
        <>
          <Card
            bg="dark"
            text="light"
            className="Card"
            style={{ width: "40rem" }}>
            <Card.Body>
              <Card.Title>{section}</Card.Title>
              <Card.Subtitle className={"text-muted"}>{subtitle}</Card.Subtitle>
              <Card.Text>{content}</Card.Text>
            </Card.Body>
            <ListGroup
              className="list-group-flush gap-3 px-3"
              style={{
                display: "flex",
                verticalAlign: "middle",
                justifyContent: "space-evenly",
              }}>
              {list.map((item) => (
                <ListGroup.Item
                  className="rounded-1 lead fw-semibold"
                  style={{}}>
                  {item}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Body>
              <div
                style={{
                  margin: "auto",
                  padding: "2px",
                  textAlign: "center",
                }}>
                <Card.Link
                  className=" fw-semibold link-light text-decoration-none"
                  style={{ aspectRatio: "3/2" }}
                  href="#">
                  Show More
                </Card.Link>
              </div>
            </Card.Body>
          </Card>
        </>
      );

    default:
      return (
        <>
          <Card
            bg="dark"
            text="light"
            className="Card p-3 "
            style={{ width: "40rem" }}>
            <Row style={{}}>
              <Col sm={12} md={12} lg={12} xl={6} className="pe-0">
                <Card.Body>
                  <Card.Title>{section}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {subtitle}
                  </Card.Subtitle>
                  <Card.Text className="pt-3 lead fs-4 text-center">
                    {content}
                  </Card.Text>
                  <hr className="pt-0 mt-5" />
                  <Container
                    style={{
                      padding: "2px",
                      paddingTop: "0px",
                      textAlign: "center",
                    }}>
                    <Card.Link
                      className="text-secondary fw-semibold"
                      style={{ aspectRatio: "3/2" }}
                      href="#">
                      Show More
                    </Card.Link>
                    <Card.Link
                      className="text-secondary fw-semibold"
                      href={href}>
                      Company Link
                    </Card.Link>
                  </Container>
                </Card.Body>
              </Col>
              <Col
                sm={12}
                md={12}
                lg={12}
                xl={6}
                className=""
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Card.Img
                  src={imgSrc}
                  className="boxImgE image-fluid rounded-4 shadow-lg"
                />
              </Col>
            </Row>
          </Card>
        </>
      );
  }
}
