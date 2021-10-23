import { Request, Response} from "express";
import { CreateMessageService } from "../services/create_message_service";

import { io } from "../app"

class create_message_controller {
  async handle(request: Request, response: Response){
    const { message } = request.body;
    const { user_id } = request;

    const service = new CreateMessageService();

    const result = await service.execute(message, user_id);

   

    return response.json(result)
  }
}


export { create_message_controller }