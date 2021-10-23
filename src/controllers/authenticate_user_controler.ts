import { Request, Response} from "express";
import { authenticate_user_services } from "../services/authenticate_user_services";

class authenticate_user_controler {
  async handle(request: Request, response: Response){
    
    const { code } = request.body;
    const service = new authenticate_user_services();

    try {
      const result = await service.execute(code)
      return response.json(result);

    }catch(err){
      return response.json({error: err.message});
    }

  }
}


export { authenticate_user_controler }