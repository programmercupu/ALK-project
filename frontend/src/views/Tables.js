import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationAlert from "react-notification-alert";
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  
} from "reactstrap";

function Tables() {
  const notificationAlert = React.useRef();  
  const statusOptions = ["Success", "Process", "Pending", "Cancel"];
  const [modalOpen, setModalOpen] = useState(false);
  const [agendas, setAgendas] = useState([]);
  const [editAgenda, setEditAgenda] = useState({
    id: "",
    nama: "",
    penanggungJawab: "",
    tanggal: "",
    tempat: "",
    status: "",
  });

  useEffect(() => {
    // Ketika komponen di-mount, panggil fungsi untuk mendapatkan data dari API
    fetchDataFromAPI();
  }, []);

    const fetchDataFromAPI = () => {
      axios
        .get("http://127.0.0.1:5000/api/ambil")
        .then((response) => {
          // Tangani respon dari server dan simpan data ke state agendas
          setAgendas(response.data);
        })
        .catch((error) => {
          // Tangani kesalahan jika terjadi
          console.error("Gagal mengambil data dari API:", error);
        });
    };  
    const toggleModal = () => {
      setModalOpen(!modalOpen);
    };
    const handleEdit = (agenda) => {
      setEditAgenda(agenda);
      toggleModal();
    };
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setEditAgenda({
        ...editAgenda,
        [name]: value,
      });
    };

    // Deklarasikan fungsi handleDelete di luar dari useEffect
    const handleDelete = (id) => { 
      axios
        .delete(`http://127.0.0.1:5000/api/delete/${id}`)
        .then((response) => {
          // Jika berhasil dihapus, panggil fungsi fetchDataFromAPI untuk mendapatkan data terbaru
          fetchDataFromAPI();
          notif();
        }) 
        .catch((error) => {
          // Tangani kesalahan jika terjadi
          console.error("Gagal menambahkan agenda:", error);
        });  
    };
    const formatNamaAgenda = (nama) => {
      if (nama.length > 17) {
        return nama.substring(0, 17) + "...";
      }
      return nama;
    };
    const handleUpdate = () => { 
      // Kirim permintaan PUT atau PATCH ke API untuk menyimpan perubahan pada data
      axios
        .put(`http://127.0.0.1:5000/api/update/${editAgenda._id}`, editAgenda)
        .then((response) => {
          toggleModal();
          fetchDataFromAPI();
          notif2(); 
        })
        .catch((error) => {
          console.error("Gagal mengupdate data:", error);
        });
      console.log("Edit data dengan ID:", editAgenda._id);
    };
  
    function notif(){
      console.log("Notifikasi berhasil ditampilkan");
      notificationAlert.current.notificationAlert({
        place: "tc",
        message: (
          <div>
            <Alert color="success">Agenda berhasil dihapus!</Alert>
          </div>
        ),
        type: "success",
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 3,
      });
    }
    function notif2(){
      console.log("Notifikasi berhasil ditampilkan");
      notificationAlert.current.notificationAlert({
        place: "tc",
        message: (
          <div>
            <Alert color="success">Agenda berhasil diUpdate!</Alert>
          </div>
        ),
        type: "success",
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 3,
      });
    }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Agenda List</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>ID</th>
                      <th>Nama Agenda</th>
                      <th>Penanggung Jawab</th>
                      <th>Tanggal</th>
                      <th>Tempat</th>
                      <th>Status</th>
                      <th>Option</th>
                    </tr>
                  </thead>
                  <tbody>
                  {agendas.map((agenda) => (
                    <tr key={agenda._id}>
                      <td hidden>{agenda._id}</td>
                      <td>{agenda.id}</td>
                      <td>{formatNamaAgenda(agenda.nama)}</td>
                      <td>{agenda.penanggungJawab}</td>
                      <td>{agenda.tanggal}</td>
                      <td>{agenda.tempat}</td>
                      <td>{agenda.status}</td>
                      <td>
                        <button onClick={() => handleDelete(agenda._id)}>Del</button>
                        <button onClick={() => handleEdit(agenda)}>Upd</button>
                      </td> 
                    </tr>
                  ))}
                  </tbody>
                  <NotificationAlert ref={notificationAlert} />
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
       {/* Modal untuk edit data */}
       <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Edit Agenda</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="nama">Nama Agenda</Label>
              <Input
                type="text"
                name="nama"
                id="nama"
                value={editAgenda.nama}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="penanggungJawab">Penanggung Jawab</Label>
              <Input
                type="text"
                name="penanggungJawab"
                id="penanggungJawab"
                value={editAgenda.penanggungJawab}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="tanggal">Tanggal</Label>
              <Input
                type="text"
                name="tanggal"
                id="tanggal"
                value={editAgenda.tanggal}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="tempat">Tempat</Label>
              <Input
                type="text"
                name="tempat"
                id="tempat"
                value={editAgenda.tempat}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
            <Label for="status">Status</Label>
              <Input
                type="select"
                name="status"
                id="status"
                value={editAgenda.status}
                onChange={handleInputChange}
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleUpdate()}>Save</Button>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal> 
    </> 
  );
}

export default Tables;
