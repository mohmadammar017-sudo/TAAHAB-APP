import express from "express";
import cors from "cors";
import alertsRouter from "./routes/alerts";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "taahab-server"
  });
});

app.use("/api/alerts", alertsRouter);

app.listen(port, () => {
  console.log(`Taahab server listening on http://localhost:${port}`);
});
