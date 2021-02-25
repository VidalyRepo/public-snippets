import React, { useMemo, useState } from 'react'
import Unity, { UnityContext } from 'react-unity-webgl'
import { Progress } from 'antd'
import IUnityConfig from 'react-unity-webgl/distribution/interfaces/unityConfig'

export interface UnityProps {
  gameAssetUrls: IUnityConfig
  token: string
}
export function UnityWrapper (props: UnityProps): JSX.Element {
  const [gameLoaded, updateGameLoaded] = useState<boolean>(false)
  const [loadProgress, updateLoadProgress] = useState<number>(0)
  const context = useMemo(() => new UnityContext(props.gameAssetUrls), [
    props.gameAssetUrls
  ])

  context.on('Testing', (jwt: string) => {
    context.send('UserManager', 'SetJWT', props.token)
  })

  context.on('loaded', () => {
    updateGameLoaded(true)
  })

  context.on('progress', (progress: number) => {
    updateLoadProgress(Math.round(progress * 100))
  })

  return (
    <>
      <div style={{ textAlign: 'center' }}>{!gameLoaded && <Progress strokeColor='#01b6bc' style={{ marginTop: '20vh' }} type='circle' percent={loadProgress} />}</div>
      <div style={{ height: 'calc(100vh - 64px)', width: '100vw', margin: '0px', padding: '0px', border: '0px' }}>
        <Unity height='100%' width='100%' unityContext={context} />
      </div>
    </>
  )
}
