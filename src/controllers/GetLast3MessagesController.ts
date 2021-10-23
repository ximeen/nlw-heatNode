import { Request, Response} from "express";
import { get_last3_messages_service } from "../services/GetLast3MessagesServices";


class GetLast3MessagesController {
  async handle(request: Request, response: Response){
   const service = new get_last3_messages_service();
  
   const result = await service.execute();

   return response.json(result)

  }
}


export { GetLast3MessagesController }