import express from "express";
import MainController from "./controllers/mainController.js";
import jwtAuth from "./middlewares/auth.middleware.js";

const apiRouter = express.Router();

const mainController = new MainController();

{
  apiRouter.get("/", (req, res) => {
    res.send("Welcome to api router");
  });

  apiRouter.post("/add-client", jwtAuth, (req, res) => {
    //name and email
    mainController.addClient(req, res);
  });

  apiRouter.post("/edit-client", jwtAuth, (req, res) => {
    //name and email
    mainController.editClient(req, res);
  });

  apiRouter.get("/get-all-clients", jwtAuth, (req, res) => {
    mainController.getAllClients(req, res);
  });

  apiRouter.post("/add-publisher", jwtAuth, (req, res) => {
    // name and email
    mainController.addPublisher(req, res);
  });

  apiRouter.post("/edit-publisher", jwtAuth, (req, res) => {
    // name and email
    mainController.editPublisher(req, res);
  });

  apiRouter.get("/get-all-publishers", jwtAuth, (req, res) => {
    mainController.getAllPublishers(req, res);
  });

  apiRouter.post("/create-released-order", jwtAuth, (req, res) => {
    mainController.createReleasedOrder(req, res);
  });

  apiRouter.get("/get-all-released-orders", jwtAuth, (req, res) => {
    mainController.getAllReleasedOrders(req, res);
  });

  apiRouter.post("/create-quotation", async (req, res) => {
    mainController.createQuotation(req, res);
  });

  apiRouter.get("/get-all-quotations", async (req, res) => {
    mainController.getAllQuotations(req, res);
  });

  apiRouter.get("/get-client-past-quotations/:clientId", async (req, res) => {
    mainController.getClientQuotationsByClientId(req, res);
  });

  apiRouter.get("/get-publisher-past-ros/:publisherId", async (req, res) => {
    mainController.getPublisherROsByPublisherId(req, res);
  });

  // getROandQFdetails
  apiRouter.get("/get-ro-and-qf-details/:roId", async (req, res) => {
    mainController.getROandQFdetails(req, res);
  });

  // New routes for editReleasedOrder and editQuotation
  apiRouter.put("/edit-released-order", jwtAuth, async (req, res) => {
    mainController.editReleasedOrder(req, res);
  });

  apiRouter.put("/edit-quotation", jwtAuth, async (req, res) => {
    mainController.editQuotation(req, res);
  });
}
// -------------------------------------------------------------------------

apiRouter.get("/get-next-order-id", (req, res) => {
  mainController.getNextOrderId(req, res);
});
apiRouter.get("/get-all-clients-publishers", (req, res) => {
  mainController.getClientAndPublisher(req, res);
});

apiRouter.post("/add-all-crq/:id", (req, res) => {
  mainController.addRoQf(req, res);
});

apiRouter.get("/get-all-orders", (req, res) => {
  mainController.getAllOrders(req, res);
});

apiRouter.post("/save-bill", (req, res) => {
  mainController.saveBillDetails(req, res);
});

export default apiRouter;
