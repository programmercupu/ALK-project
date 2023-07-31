import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import TableList from "views/Tables.js";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/Add",
    name: "Add Agenda",
    icon: "nc-icon nc-simple-add",
    component: <Notifications />,
    layout: "/admin",
  },
  {
    path: "/AgendaList",
    name: "Agenda List",
    icon: "nc-icon nc-tile-56",
    component: <TableList />,
    layout: "/admin",
  },
  
  
];
export default routes;
