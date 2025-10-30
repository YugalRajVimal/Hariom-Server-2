import UserModel from "../schemas/user.schema.js";
import ClientModel from "../schemas/client.schema.js";
import PublisherModel from "../schemas/publisher.schema.js";
import ReleaseOrder from "../schemas/releasedOrder.schema.js"; // adjust the path as needed
import Quotation from "../schemas/quotation.schema.js";
import sendMail from "../config/nodeMailer.config.js";
import AllModel from "../schemas/overAllSchema.js";
import ClientPublisherModel from "../schemas/clientPublisher.js";
import MultiBillModel from "../schemas/multiBillSchema.js";

class MainController {
  //add client name & email
  addClient = async (req, res) => {
    try {
      const { clientName, email } = req.body;
      const existingClient = await ClientModel.findOne({ email });
      if (existingClient) {
        return res.status(409).send("Client already exists");
      }
      const newClient = new ClientModel({ clientName, email });
      await newClient.save();
      res.status(201).send("Client added successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

  //edit client name & email
  editClient = async (req, res) => {
    try {
      const { clientName, email } = req.body;
      const client = await ClientModel.findOneAndUpdate(
        { email },
        { clientName, email },
        { new: true }
      );
      if (!client) {
        return res.status(404).send("Client not found");
      }
      res.status(200).send("Client updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

  getAllClients = async (req, res) => {
    try {
      const clients = await ClientModel.find();
      res.status(200).send(clients);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

  //add publisher name & email
  addPublisher = async (req, res) => {
    try {
      const { publisherName, email } = req.body;
      const existingPublisher = await PublisherModel.findOne({ email });
      if (existingPublisher) {
        return res.status(409).send("Publisher already exists");
      }
      const newPublisher = new PublisherModel({ publisherName, email });
      await newPublisher.save();
      res.status(201).send("Publisher added successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

  //edit publisher name & email
  editPublisher = async (req, res) => {
    try {
      const { publisherName, email } = req.body;
      const publisher = await PublisherModel.findOneAndUpdate(
        { email },
        { publisherName, email },
        { new: true }
      );
      if (!publisher) {
        return res.status(404).send("Publisher not found");
      }
      res.status(200).send("Publisher updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

  getAllPublishers = async (req, res) => {
    try {
      const publishers = await PublisherModel.find();
      res.status(200).send(publishers);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };

  createReleasedOrder = async (req, res) => {
    try {
      const {
        roNo,
        clientId,
        clientName,
        publicationId,
        publicationName,
        insertionDate,
        position,
        category,
        noOfAds,
        referenceNo,
        hui,
        schemaMaterial,
        width,
        height,
        rate,
        amount,
        agency1,
        agency2,
        agency3,
        totalCommission,
        totalAmount,
        remark,
        quotationFormNo,
      } = req.body;

      // Validate required fields
      if (
        !roNo ||
        !clientId ||
        !publicationId ||
        !clientName ||
        !publicationName ||
        !insertionDate ||
        !position ||
        !category ||
        !referenceNo ||
        !schemaMaterial ||
        !quotationFormNo ||
        width === undefined ||
        height === undefined ||
        rate === undefined
      ) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      // Check for duplicate RO No
      const existingRO = await ReleaseOrder.findOne({ roNo });
      if (existingRO) {
        return res.status(409).json({ message: "RO Number already exists." });
      }

      // Create and save new release order
      const newRO = new ReleaseOrder({
        roNo,
        quotationFormNo,
        clientId,
        clientName,
        publicationId,
        publicationName,
        insertionDate,
        position,
        category,
        noOfAds,
        referenceNo,
        hui,
        schemaMaterial,
        width,
        height,
        rate,
        amount,
        agency1,
        agency2,
        agency3,
        totalCommission,
        totalAmount,
        remark,
      });

      const publisher = await PublisherModel.findOne({
        publisherName: publicationName,
      });
      if (!publisher) {
        return res.status(404).json({ message: "Publisher not found." });
      }
      const publisherEmail = publisher.email;
      // sendMail(
      //   publisherEmail,
      //   "Released Order Details",
      //   `
      //     Released Order No. : ${roNo},
      //     Quotation Form No. : ${quotationFormNo}
      //     Client Id: ${clientId}
      //     Client Name: ${clientName},
      //     Publication Id: ${publicationId}
      //     Publication Name: ${publicationName},
      //     Insertion Date: ${insertionDate},
      //     Position: ${position},
      //     Category: ${category},
      //     No. of Ads: ${noOfAds},
      //     Reference No.: ${referenceNo},
      //     HUI: ${hui},
      //     Schema Material: ${schemaMaterial},
      //     Width: ${width},
      //     Height: ${height},
      //     Rate: ${rate},
      //     Amount: ${amount},
      //     Agency 1: ${agency1},
      //     Agency 2: ${agency2},
      //     Agency 3: ${agency3},
      //     Total Commission: ${totalCommission},
      //     Total Amount: ${totalAmount},
      //     Remark: ${remark}
      //     `
      // );

      const savedRO = await newRO.save();

      res.status(201).json({
        message: "Release Order created successfully.",
        data: savedRO,
      });
    } catch (error) {
      console.error("Error creating release order:", error);
      res.status(500).json({
        message: "Server error while creating release order.",
        error: error.message,
      });
    }
  };

  editReleasedOrder = async (req, res) => {
    try {
      const {
        roNo,
        clientId,
        clientName,
        publicationId,
        publicationName,
        insertionDate,
        position,
        category,
        noOfAds,
        orderRefNo,
        hui,
        schemaMaterial,
        width,
        height,
        rate,
        amount,
        agency1,
        agency2,
        agency3,
        totalCommission,
        totalAmount,
        remark,
        quotationFormNo,
      } = req.body;

      console.log("----", req.body);

      // Validate required fields
      if (
        !roNo ||
        !clientId ||
        !publicationId ||
        !clientName ||
        !publicationName ||
        !insertionDate ||
        !position ||
        !category ||
        !orderRefNo ||
        !schemaMaterial ||
        !quotationFormNo ||
        width === undefined ||
        height === undefined ||
        rate === undefined
      ) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      // Find and update release order
      const updatedRO = await ReleaseOrder.findOneAndUpdate(
        { roNo },
        {
          clientId,
          clientName,
          publicationId,
          publicationName,
          insertionDate,
          position,
          category,
          noOfAds,
          referenceNo: orderRefNo,
          hui,
          schemaMaterial,
          width,
          height,
          rate,
          amount,
          agency1,
          agency2,
          agency3,
          totalCommission,
          totalAmount,
          remark,
          quotationFormNo,
        },
        { new: true }
      );

      if (!updatedRO) {
        return res.status(404).json({ message: "Release Order not found." });
      }

      res.status(200).json({
        message: "Release Order updated successfully.",
        data: updatedRO,
      });
    } catch (error) {
      console.error("Error editing release order:", error);
      res.status(500).json({
        message: "Server error while editing release order.",
        error: error.message,
      });
    }
  };

  getAllReleasedOrders = async (req, res) => {
    try {
      const releasedOrders = await ReleaseOrder.find();
      if (!releasedOrders) {
        return res.status(404).json({ message: "No released orders found." });
      }
      res.status(200).json({
        message: "Released orders fetched successfully.",
        data: releasedOrders,
      });
    } catch (error) {
      console.error("Error fetching released orders:", error);
      res.status(500).json({
        message: "Server error while fetching released orders.",
        error: error.message,
      });
    }
  };

  createQuotation = async (req, res) => {
    try {
      const quotation = new Quotation(req.body);

      // const client = await ClientModel.findOne({
      //   clientName: quotation.clientName,
      // });
      // if (!client) {
      //   return res.status(404).json({ message: "Client not found." });
      // }
      // const clientEmail = client.email;
      // sendMail(
      //   clientEmail,
      //   "Quotation Details",
      //   `
      //   Quotation Form Number - ${quotation.quotationFormNumber}
      //   Client Id - ${quotation.clientId}
      //   Client Name - ${quotation.clientName}
      //   Address - ${quotation.address}
      //   Date - ${quotation.date}
      //   Subject - ${quotation.subject}
      //   PublicationId - ${quotation.publicationId}
      //   Publication - ${quotation.publication}
      //   Rate - ${quotation.size}
      //   Size - ${quotation.size}
      //   HUI - ${quotation.hui}
      //   `
      // );

      const savedQuotation = await quotation.save();
      res.status(201).json({
        message: "Quotation created successfully.",
        data: savedQuotation,
      });
    } catch (error) {
      console.error("Error creating quotation:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

  editQuotation = async (req, res) => {
    try {
      const {
        quotationFormNumber,
        clientId,
        clientName,
        address,
        date,
        subject,
        publicationId,
        publication,
        size,
        hui,
        rate,
      } = req.body;

      console.log(req.body);

      // Validate required fields
      if (
        !quotationFormNumber ||
        !clientId ||
        !clientName ||
        !address ||
        !date ||
        !subject ||
        !publicationId ||
        !publication ||
        !size ||
        !hui ||
        !rate
      ) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      // Find and update quotation
      const updatedQuotation = await Quotation.findOneAndUpdate(
        { quotationFormNumber },
        {
          clientId,
          clientName,
          address,
          date,
          subject,
          publicationId,
          publication,
          size,
          hui,
          rate,
        },
        { new: true }
      );

      if (!updatedQuotation) {
        return res.status(404).json({ message: "Quotation not found." });
      }

      res.status(200).json({
        message: "Quotation updated successfully.",
        data: updatedQuotation,
      });
    } catch (error) {
      console.error("Error editing quotation:", error);
      res.status(500).json({
        message: "Server error while editing quotation.",
        error: error.message,
      });
    }
  };

  getAllQuotations = async (req, res) => {
    try {
      const quotations = await Quotation.find();
      if (!quotations) {
        return res.status(404).json({ message: "No quotations found." });
      }
      res.status(200).json({
        message: "Quotations fetched successfully.",
        data: quotations,
      });
    } catch (error) {
      console.error("Error fetching quotations:", error);
      res.status(500).json({
        message: "Server error while fetching quotations.",
        error: error.message,
      });
    }
  };

  getClientQuotationsByClientId = async (req, res) => {
    try {
      const clientId = req.params.clientId;
      console.log(clientId);
      const quotations = await Quotation.find({ clientId: clientId });
      if (!quotations) {
        return res
          .status(404)
          .json({ message: "No quotations found for this client." });
      }
      console.log(quotations);
      res.status(200).json({
        message: "Quotations fetched successfully.",
        data: quotations,
      });
    } catch (error) {
      console.error("Error fetching quotations by client ID:", error);
      res.status(500).json({
        message: "Server error while fetching quotations by client ID.",
        error: error.message,
      });
    }
  };

  getPublisherROsByPublisherId = async (req, res) => {
    try {
      const publisherId = req.params.publisherId;
      const releasedOrders = await ReleaseOrder.find({
        publicationId: publisherId,
      });
      if (!releasedOrders) {
        return res
          .status(404)
          .json({ message: "No released orders found for this publisher." });
      }
      res.status(200).json({
        message: "Released orders fetched successfully.",
        data: releasedOrders,
      });
    } catch (error) {
      console.error("Error fetching released orders by publisher ID:", error);
      res.status(500).json({
        message: "Server error while fetching released orders by publisher ID.",
        error: error.message,
      });
    }
  };

  getROandQFdetails = async (req, res) => {
    try {
      const roId = req.params.roId;
      const releasedOrder = await ReleaseOrder.findById(roId);
      if (!releasedOrder) {
        return res.status(404).json({ message: "Released Order not found." });
      }
      const quotationFormNo = releasedOrder.quotationFormNo;
      const quotationForm = await Quotation.findOne({
        quotationFormNumber: quotationFormNo,
      });
      if (!quotationForm) {
        return res.status(404).json({ message: "Quotation Form not found." });
      }
      res.status(200).json({
        message:
          "Released Order and Quotation Form details fetched successfully.",
        data: {
          releasedOrder: releasedOrder,
          quotationForm: quotationForm,
        },
      });
    } catch (error) {
      console.error(
        "Error fetching Released Order and Quotation Form details:",
        error
      );
      res.status(500).json({
        message:
          "Server error while fetching Released Order and Quotation Form details.",
        error: error.message,
      });
    }
  };

  // -------------------------------------------

  getNextOrderId = async (req, res) => {
    try {
      const nextOrderId = await UserModel.findOne({}).select("orderSeries");
      if (!nextOrderId) {
        return res
          .status(404)
          .json({ success: false, message: "Order series not found." });
      }
      res.status(200).json({
        success: true,
        message: "Next Order Id fetched successfully.",
        nextOrderId: nextOrderId.orderSeries,
      });
    } catch (error) {
      console.error("Error fetching Next Order Id:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  getClientAndPublisher = async (req, res) => {
    try {
      const users = await ClientPublisherModel.find({});

      console.log(users);

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found." });
      }

      const clients = users
        .filter((user) => user.category == "client")
        .map((user) => user.name);

      const publishers = users
        .filter((user) => user.category == "publisher")
        .map((user) => user.name);

      console.log(clients);
      console.log(publishers);

      res.status(200).send({
        clients,
        publishers,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  addRoQf = async (req, res) => {
    try {
      const { orderId, ...data } = req.body;

      const orderIdValue = orderId;

      console.log(orderId);

      if (!orderIdValue) {
        return res.status(400).json({ message: "orderId is required." });
      }

      if (orderIdValue === undefined || isNaN(Number(orderIdValue))) {
        console.log(orderIdValue);
        return res.status(400).json({ message: "Valid orderId is required." });
      }

      let updateFields = {};

      updateFields = {
        publicationName: data.publicationName || null,
        clientName: data.clientName || null,
        noOfAds: data.noOfAds || null,
        scheme: data.scheme || null,
        position: data.position || null,
        hui: data.hui || null,
        remark: data.remark || null,
        dateOfInsertion: data.dateOfInsertion || null,
        commonDetailsCompleted: true,
        agencyCode: "ins 11141" || null,
        agencyCode: data.agencyCode || null,
        orderRefId: data.orderRefId || null,
        category: data.category || null,
        code: data.code || null,
        roRate: data.roRate || null,
        roDate: data.roDate || null,
        roHeight: data.roHeight || null,
        roWidth: data.roWidth || null,
        roMultiplyBy: data.roMultiplyBy || null,
        percentageOfGST: data.percentageOfGST || null,
        agencyCommission1: data.agencyCommission1 || null,
        agencyCommission2: data.agencyCommission2 || null,
        agencyCommission3: data.agencyCommission3 || null,
        totalCommission: data.totalCommission || null,
        roAmount: data.roAmount || null,
        roTotalAmount: data.roTotalAmount || null,
        releasedOrderDetailsCompleted: true,
      };

      const existingDoc = await AllModel.findOne({
        orderId: Number(orderIdValue),
      });
      var savedDoc;
      if (existingDoc) {
        // Update existing document
        savedDoc = await AllModel.findOneAndUpdate(
          { orderId: Number(orderIdValue) },
          { $set: updateFields },
          { new: true, runValidators: true }
        );
      } else {
        // Create new document
        const newDoc = new AllModel({
          ...updateFields,
          orderId: Number(orderIdValue),
        });
        savedDoc = await newDoc.save();
        await UserModel.findOneAndUpdate(
          {},
          { $inc: { orderSeries: 1 } },
          { new: true }
        ).select("orderSeries");
      }

      res.status(200).json(savedDoc);
    } catch (error) {
      console.error("Error in addRoQf:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  };

  getAllOrders = async (req, res) => {
    try {
      const orders = await AllModel.find();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  };

  saveBillDetails = async (req, res) => {
    try {
      const {
        orderId,
        descHeading,
        billDate,
        typeOfGST,
        percentageOfGST,
        discount,
        address,
        billAmount,
        billTotalAmount,
        clientGSTNumber,
        amountSummary,
        billClientName,
      } = req.body;

      if (!["CGST+SGST", "IGST"].includes(typeOfGST)) {
        return res.status(400).json({
          message: "Invalid typeOfGST. Expected 'CGST+SGST' or 'IGST'",
        });
      }

      if (![2.5, 5, 6.1, 9, 12, 18, 24].includes(Number(percentageOfGST))) {
        console.log(Number(percentageOfGST));
        return res.status(400).json({
          message:
            "Invalid percentageOfGST. Expected one of the following values: 2.5, 5, 6.1, 9, 12, 18, 24",
        });
      }

      const updateFields = {
        billDate,
        typeOfGST,
        percentageOfGST,
        discount,
        address,
        billAmount,
        billTotalAmount,
        billDetailsCompleted: true,
      };

      if (descHeading) updateFields.descHeading = descHeading;
      if (clientGSTNumber) updateFields.clientGSTNumber = clientGSTNumber;
      if (amountSummary) updateFields.amountSummary = amountSummary;
      if (billClientName) updateFields.billClientName = billClientName;

      const savedDoc = await AllModel.findOneAndUpdate(
        { orderId: Number(orderId) },
        { $set: updateFields },
        { new: true, upsert: true, runValidators: true }
      );
      res.status(200).json(savedDoc);
    } catch (error) {
      console.error("Error in saveBillDetails:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  };

  saveMultiBillDetails = async (req, res) => {
    try {
      const {
        orderIds,
        descHeading,
        billDate,
        typeOfGST,
        percentageOfGST,
        discount,
        address,
        billAmount,
        billTotalAmount,
        clientGSTNumber,
        amountSummary,
        billClientName,
      } = req.body;

      // ✅ 1. Validate core fields
      if (!Array.isArray(orderIds) || orderIds.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one Order ID is required." });
      }

      if (!billDate || !typeOfGST || !percentageOfGST || !address) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      if (!Array.isArray(billAmount) || billAmount.length === 0) {
        return res
          .status(400)
          .json({ message: "billAmount must be a non-empty array." });
      }

      // ✅ 2. Validate GST inputs
      if (!["CGST+SGST", "IGST"].includes(typeOfGST)) {
        return res.status(400).json({
          message: "Invalid typeOfGST. Expected 'CGST+SGST' or 'IGST'.",
        });
      }

      if (![2.5, 5, 6.1, 9, 12, 18, 24].includes(Number(percentageOfGST))) {
        return res.status(400).json({
          message:
            "Invalid percentageOfGST. Expected one of: 2.5, 5, 6.1, 9, 12, 18, 24.",
        });
      }

      // ✅ 3. Verify all Order IDs exist in AllModel
      const existingOrders = await AllModel.find({
        orderId: { $in: orderIds.map((id) => Number(id)) },
      });

      const foundIds = existingOrders.map((o) => o.orderId.toString());
      const notFoundIds = orderIds.filter((id) => !foundIds.includes(id));

      if (notFoundIds.length > 0) {
        return res.status(404).json({
          message: `RO not found for Order ID(s): ${notFoundIds.join(", ")}`,
        });
      }

      // ✅ 4. Compute totals based on array + discount
      const totalBeforeDiscount = billAmount.reduce((sum, amt) => sum + amt, 0);
      const discountedTotal = totalBeforeDiscount - (parseFloat(discount) || 0);

      let totalAfterGST = discountedTotal;
      if (typeOfGST === "CGST+SGST") {
        totalAfterGST += discountedTotal * ((percentageOfGST * 2) / 100);
      } else if (typeOfGST === "IGST") {
        totalAfterGST += discountedTotal * (percentageOfGST / 100);
      }

      // ✅ 5. Save MultiBill record
      const newMultiBill = new MultiBillModel({
        orderIds,
        descHeading,
        billDate,
        typeOfGST,
        percentageOfGST,
        discount,
        address,
        billAmount,
        totalBeforeDiscount,
        billTotalAmount: totalAfterGST,
        clientGSTNumber,
        amountSummary,
        billClientName,
      });

      await newMultiBill.save();

      // ✅ 6. (Optional) Update status of all orders to mark bill completion
      await AllModel.updateMany(
        { orderId: { $in: orderIds.map((id) => Number(id)) } },
        { $set: { billDetailsCompleted: true } }
      );

      // ✅ 7. Respond success
      return res.status(200).json({
        message: "Multi-order bill saved successfully.",
        data: {
          ...newMultiBill.toObject(),
          computedTotals: {
            totalBeforeDiscount,
            totalAfterDiscount: discountedTotal,
            finalTotalAfterGST: totalAfterGST,
          },
        },
      });
    } catch (error) {
      console.error("Error in saveMultiBillDetails:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };

  getAllMultiBills = async (req, res) => {
    try {
      // Fetch all MultiBill records
      const multiBills = await MultiBillModel.find().sort({ createdAt: -1 });

      // Gather all orderIds from all multiBills, flatten and deduplicate
      const allOrderIds = [...new Set(multiBills.flatMap(mb => mb.orderIds))];

      // Fetch only the required fields for matching orders
      const allOrders = await AllModel.find(
        { orderId: { $in: allOrderIds.map(id => Number(id)) } },
        'orderId roHeight roWidth publicationName dateOfInsertion category hui'
      );

      // Prepare a Map for quick lookup by orderId
      const orderIdToOrder = {};
      allOrders.forEach(order => {
        orderIdToOrder[String(order.orderId)] = order;
      });

      // Attach orders info to each MultiBill, respecting order
      const result = multiBills.map(mb => ({
        ...mb.toObject(),
        orders: mb.orderIds.map(orderId => orderIdToOrder[String(orderId)] || null)
      }));

      res.status(200).json({
        message: "All Multi Bill records fetched successfully.",
        data: result,
      });
    } catch (error) {
      console.error("Error in getAllMultiBills:", error);
      res.status(500).json({
        message: "Failed to fetch Multi Bill records.",
        error: error.message,
      });
    }
  };
}

export default MainController;
