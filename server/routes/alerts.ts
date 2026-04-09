import { Router } from "express";
import { createAlert, getAlertById, getAlerts } from "../controllers/alertsController";

const router = Router();

router.post("/", createAlert);
router.get("/", getAlerts);
router.get("/:id", getAlertById);

export default router;

