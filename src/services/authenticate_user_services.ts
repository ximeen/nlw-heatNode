//  -> IMPORTAÇÕES <-
import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken'

// -> PASSOS SEGUINTES <-
// RECEBER O CODE:STRING 
// RECUPERAR O ACCESS_TOKEN NO GITHUB
// VERIFICAR SE O USER EXISTE NO BANCO 
// -> SIM = GERAR UM TOKEN 
// -> NÃO = CRIAR NO BANCO DEPOIS GERAR O TOKEN
//  RETORNAR O TOKEN COM AS INFORMAÇÕES DO USER QUE LOGOU

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string,
  login: string,
  id: number,
  name:string,
}

//  -> CIRANDO UMA CLASSE 
class authenticate_user_services {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data:accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id:process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
        headers: {
          "Accept": "application/json"
        }
    })

    const response = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        authorization: 'Bearer ${accessTokenResponse}'
      },
    });

    const { login, id, avatar_url, name } = response.data

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if(!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name
        }
      })
    }

    const token = sign(
      {
      user: {
        name: user.name,
        avatar_url: user.avatar_url,
        id: user.id
      }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    )

    return {token, user};
  }
}

//  -> EXPORTANDO A CLASSE PARA A APLICAÇÃO
export { authenticate_user_services }