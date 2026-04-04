import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import workersRouter from "./workers";
import plansRouter from "./plans";
import policiesRouter from "./policies";
import riskRouter from "./risk";
import disruptionsRouter from "./disruptions";
import claimsRouter from "./claims";
import fraudRouter from "./fraud";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(workersRouter);
router.use(plansRouter);
router.use(policiesRouter);
router.use(riskRouter);
router.use(disruptionsRouter);
router.use(claimsRouter);
router.use(fraudRouter);
router.use(dashboardRouter);

export default router;
