import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import S3, { ClientConfiguration, GetObjectRequest } from 'aws-sdk/clients/s3'
import { Credentials } from 'aws-sdk/lib/core'

@Injectable()
export class AwsService {
  s3: S3
  constructor (config: ConfigService) {
    const credentials = new Credentials({ accessKeyId: config.get('ACCESS_KEY_ID') as string, secretAccessKey: config.get('SECRET_ACCESS_KEY') as string })
    const region = config.get('S3_REGION')
    const s3Config: ClientConfiguration = {
      region,
      credentials
    }
    this.s3 = new S3(s3Config)
  }

  async getSignedS3Url (bucket: string, key: string, expMilliSeconds = 60 * 10): Promise<any> {
    const params: GetObjectRequest & {Expires: number} = { Bucket: bucket, Key: key, Expires: expMilliSeconds }
    const url = await this.s3.getSignedUrlPromise('getObject', params)
    return url
  }
}
