import React, { useState } from "react";
import NotificationAlert from "react-notification-alert";
import axios from "axios";
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

function Notification() { 
  const notificationAlert = React.useRef(); 
  const [agendas, setAgendas] = useState([]);

  const [agenda, setAgenda] = useState({
    id: "",
    nama: "",
    penanggungJawab: "",
    tanggal: "",
    tempat: "",
    status: "success", // Default status "success"
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAgenda((prevAgenda) => ({
      ...prevAgenda,
      [name]: value,
    }));
  };  
  
  const handleAddAgenda = () => {
  // Kirim data agenda ke database melalui API menggunakan axios
  axios
  .post("http://127.0.0.1:5000/api/Notifikasi", agenda)
  .then((response) => {
    // Jika berhasil, tambahkan agenda ke state agendas
    setAgendas((prevAgendas) => [...prevAgendas, response.data]); 

    // Membersihkan form setelah penambahan
    setAgenda({
      id: "",
      nama: "",
      penanggungJawab: "",
      tanggal: "",
      tempat: "",
      status: "Success", // Mengatur kembali status default ke "success"
    });

  
 // Menampilkan notifikasi
    notificationAlert.current.notificationAlert({
      place: "tc",
      message: (
        <div>
          <Alert color="success">Agenda berhasil ditambahkan!</Alert>
        </div>
      ),
      type: "success",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 3,
    });
  })
  .catch((error) => {
    // Tangani kesalahan jika terjadi
    console.error("Gagal menambahkan agenda:", error);

    // Menampilkan notifikasi gagal
    notificationAlert.current.notificationAlert({
      place: "tc",
      message: (
        <div>
          <Alert color="danger">Gagal menambahkan agenda!</Alert>
        </div>
      ),
      type: "danger",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 3,
    });
  });
};

  return (
    <>
      <div className="content">
        <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Add Agenda</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label for="id">ID Agenda</Label>
                    <Input
                      type="text"
                      name="id"
                      id="id"
                      value={agenda.id}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="nama">Nama Agenda</Label>
                    <Input
                      type="text"
                      name="nama"
                      id="nama"
                      value={agenda.nama}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="penanggungJawab">Penanggung Jawab</Label>
                    <Input
                      type="text"
                      name="penanggungJawab"
                      id="penanggungJawab"
                      value={agenda.penanggungJawab}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="tanggal">Tanggal</Label>
                    <Input
                      type="date"
                      name="tanggal"
                      id="tanggal"
                      value={agenda.tanggal}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="tempat">Tempat</Label>
                    <Input
                      type="text"
                      name="tempat"
                      id="tempat"
                      value={agenda.tempat}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <Input
                      type="select"
                      name="status"
                      id="status"
                      value={agenda.status}
                      onChange={handleInputChange}
                    >
                      <option value="Success">Success</option>
                      <option value="Process">Process</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancel">Cancel</option>
                    </Input>
                  </FormGroup>
                  <Button color="primary" onClick={handleAddAgenda}>
                    Tambah Agenda
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Notification;
