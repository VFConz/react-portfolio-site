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
    // Set default values for modal text if props are undefined

    return (
      <Modal
        {...props}
        size="lg"
        fullscreen="md-down" // Makes the modal fullscreen for medium screens and below
        scrollable // Allows scrolling for lengthy content
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="display-5 fs-3 text-center">
            {modalHeader}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="lead fw-semibold text-center">{modalSubtitle}</h4>
          <p className="text-justify text-wrap">{modalContent}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide} className="btn btn-primary w-100">
            Close
          </Button>
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
            className="Card"
            style={{
              width: "100%", // Adjust to take full width of the grid column
              height: "100%", // Let the card scale with its content
            }}>
            <Row style={{ height: "100%" }}>
              <Col sm={12} md={12} lg={12} xl={6} className="p-0 px-2">
                <Card.Body
                  className="p-3 d-flex flex-column" // Flexbox applied
                  style={{
                    height: "100%", // Ensure full height of the Card.Body
                  }}>
                  {/* Top Content */}
                  <div>
                    <Card.Title>{section}</Card.Title>
                    <Card.Subtitle
                      className="mb-4"
                      style={{ color: subtitleColor }}>
                      {subtitle}
                    </Card.Subtitle>
                    <Card.Text>
                      <ul className="ProjList">
                        {list.map((item) => (
                          <li
                            key={item}
                            className="ProjList-L rounded-1 lead p-2 px-0">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card.Text>
                  </div>

                  {/* Footer Section: Anchored to the Bottom */}
                  <div
                    className="mt-auto" // Push to bottom
                    style={{
                      marginTop: "auto",
                    }}>
                    <hr />
                    <Stack gap={2} className="col-md-5 mx-auto w-100">
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
                sm={12}
                md={12}
                lg={12}
                xl={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Card.Img
                  src={imgSrc}
                  id="accelerate"
                  className="image-fluid rounded-5 boxImgP p-3"
                  style={{
                    width: "100%", // Ensure it scales to fit the container
                    height: "auto", // Maintain aspect ratio
                    objectFit: "cover", // Ensure the image scales and crops if necessary
                  }}
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
            style={{
              width: "100%", // Adjust to take full width of the grid column
              height: "100%", // Let the card scale with its content
            }}>
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
            className="Card"
            style={{
              width: "100%", // Adjust to take full width of the grid column
              height: "100%", // Let the card scale with its content
            }}>
            <Row style={{ height: "100%" }}>
              <Col sm={12} md={12} lg={12} xl={6} className="p-0 px-2">
                <Card.Body
                  className="p-3 d-flex flex-column" // Flexbox applied
                  style={{
                    height: "100%",
                  }}>
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
                      className="text-light fw-semibold text-decoration-none"
                      style={{ aspectRatio: "3/2" }}
                      href="javascript: void(0)"
                      onClick={() => setModalShow(true)}>
                      Show More
                    </Card.Link>
                    <Card.Link
                      className="text-info fw-semibold text-decoration-none"
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Card.Img
                  style={{
                    width: "100%", // Ensure it scales to fit the container
                    height: "auto", // Maintain aspect ratio
                    objectFit: "cover", // Ensure the image scales and crops if necessary
                  }}
                  src={imgSrc}
                  className="boxImgE image-fluid rounded-5 p-3"
                />
              </Col>
            </Row>
            <ProductModal show={modalShow} onHide={() => setModalShow(false)} />
          </Card>
        </>
      );
  }
}
