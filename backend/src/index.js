import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas

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

app.listen(process.env.PORT, () => {
  console.log(`server at running in http://localhost:${process.env.PORT}`);
});
