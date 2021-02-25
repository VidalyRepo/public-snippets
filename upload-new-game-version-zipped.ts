/* eslint-disable */
import S3, { ClientConfiguration } from 'aws-sdk/clients/s3'
import { Credentials } from 'aws-sdk/lib/core'
import fs from 'fs'
import dotenv from 'dotenv'

function bumpVersionAndGetCurrentVersion () {
  const fileNameWithVersion = './scripts/current_version.txt'
  const currentVersion = fs.readFileSync(fileNameWithVersion, 'utf8')
  const currentVersionNumber = Number(currentVersion)
  const newVersion = currentVersionNumber + 1
  if (!isFinite(newVersion)) {
    throw new Error('version is not a number')
  }
  fs.writeFileSync(fileNameWithVersion, `${newVersion}`)
  console.log('uploading version number:', currentVersionNumber)
  return currentVersionNumber
}

async function upload (version: number) {
  const versionString = 'v' + version
  const gameName = 'eudaville'
  const dataSuffix = '.data.gz'
  const frameworkSuffix = '.framework.js.gz'
  const loaderSuffix = '.loader.js'
  const wasmSuffix = '.wasm.gz'

  dotenv.config()
  const credentials = new Credentials({
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string
  })
  const region = process.env.S3_REGION
  const s3Config: ClientConfiguration = {
    region,
    credentials
  }
  const s3 = new S3(s3Config)
  const relPath = '../game/builds/latest/Build/latest'
  const data = fs.readFileSync(relPath + dataSuffix)
  const framework = fs.readFileSync(relPath + frameworkSuffix)
  const loader = fs.readFileSync(relPath + loaderSuffix)
  const wasm = fs.readFileSync(relPath + wasmSuffix)

  const Bucket = 'euda-game-assets'
  const versionPath = versionString + '/' + gameName
  const ContentEncoding = 'gzip'

  await s3
    .putObject({
      Bucket,
      Key: versionPath + dataSuffix,
      Body: data,
      ContentType: 'application/data',
      ContentEncoding
    })
    .promise()
  await s3
    .putObject({
      Bucket,
      Key: versionPath + frameworkSuffix,
      Body: framework,
      ContentType: 'application/js',
      ContentEncoding
    })
    .promise()
  await s3
    .putObject({
      Bucket,
      Key: versionPath + loaderSuffix,
      Body: loader,
      ContentType: 'application/js'
    })
    .promise()
  await s3
    .putObject({
      Bucket,
      Key: versionPath + wasmSuffix,
      Body: wasm,
      ContentType: 'application/wasm',
      ContentEncoding
    })
    .promise()
}

async function run () {
  const currentVersion = bumpVersionAndGetCurrentVersion()
  await upload(currentVersion)
}

run()
  .then(() => console.log('done'))
  .catch(console.error)
