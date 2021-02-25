import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common'
import { Auth0ManagementService } from './auth/auth0ManagementApi.service'
import { AwsService } from './aws/aws.service'

@Controller()
export class AppController {
  constructor (
    private readonly awsService: AwsService,
    private readonly auth0Service: Auth0ManagementService
  ) {}

  @Get('/euda/game/:version/:assetKey')
  async getGameAssetUrl (
    @Param('assetKey') assetKey: string,
      @Param('version') version: string
  ): Promise<string> {
    return await this.awsService.getSignedS3Url(
      'euda-game-assets',
      `${version}/${assetKey}`
    )
  }

}
