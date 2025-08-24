import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routes/main.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", mainRouter);

// Tratamento de erros
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado" });
});

const errorHandler = (err, req, res, next) => {
  err.status ? res.status(err.status) : res.status(400);
  err.message
    ? res.json({ error: err.message })
    : res.json({ error: "Ocorreu algum erro" });
};
app.use(errorHandler);

// Rodando o server
app.listen(process.env.PORT || 3000, () => {
  console.log(`server at running in ${process.env.BASE_URL}`);
});
