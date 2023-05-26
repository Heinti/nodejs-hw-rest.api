const express = require("express");

const {contactCtrl} = require("../../controllers/contact");
const { schemas } = require("../../models/contact");
const { validateBody, isValidid, authenticate } = require("../../middlewares");
const router = express.Router();

router.get("/", authenticate, contactCtrl.getAll);

router.get("/:contactId", authenticate, isValidid, contactCtrl.getById);

router.post("/", authenticate, validateBody(schemas.addSchema), contactCtrl.add);

router.delete("/:contactId", authenticate, isValidid, contactCtrl.removeById);

router.put(
  "/:contactId",
  authenticate,
  isValidid,
  validateBody(schemas.addSchema),
  contactCtrl.updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidid,
  validateBody(schemas.updateFavoriteSchema),
  contactCtrl.updateStatusContact
);

module.exports = router;
