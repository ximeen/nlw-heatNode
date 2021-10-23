import { Router } from "express";
import { authenticate_user_controler } from "./controllers/authenticate_user_controler";
import { create_message_controller } from "./controllers/create_message_controller";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middleware/ensure_authenticated";

const router = Router();

router.post("/authenticate", new authenticate_user_controler().handle)

router.post("/messages", ensureAuthenticated ,new create_message_controller().handle)

router.get("/messages/last3", new GetLast3MessagesController().handle)

router.get("/profile", ensureAuthenticated,new ProfileUserController().handle)

export { router } 