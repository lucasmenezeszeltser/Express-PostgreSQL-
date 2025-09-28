// api/routes/user.js
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await req.context.models.User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: "Username e email são obrigatórios." });
    }
    const user = await req.context.models.User.create({ username, email });
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Username ou email já cadastrado." });
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const { username, email } = req.body;
    await user.update({ username, email });
    res.json(user);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Username ou email já cadastrado." });
    }
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;