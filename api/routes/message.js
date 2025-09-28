// api/routes/message.js
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await req.context.models.Message.findAll({
      include: [{ model: req.context.models.User, as: "user" }]
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(req.params.messageId, {
      include: [{ model: req.context.models.User, as: "user" }]
    });
    if (!message) {
      return res.status(404).json({ error: "Mensagem não encontrada." });
    }
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ error: "Texto e userId são obrigatórios." });
    }
    // Verifica se o usuário existe
    const user = await req.context.models.User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não existe." });
    }
    const message = await req.context.models.Message.create({ text, userId });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.delete("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: "Mensagem não encontrada." });
    }
    await message.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;