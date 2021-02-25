import { config } from '../config'
import axios from 'axios'

class Api {
  url: string
  constructor () {
    this.url = config.apiOrigin
  }

  async getGameAssetUrl (asset: string): Promise<string> {
    const responseData = await axios.get(
        `${this.url}/euda/game/${config.gameVersion}/eudaville.${asset}`
    )
    return responseData.data
  }
}

export const api = new Api()
