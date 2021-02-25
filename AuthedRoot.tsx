import { useAuth0 } from '@auth0/auth0-react'
import { Button, Layout, notification, Row, Col } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import IUnityConfig from 'react-unity-webgl/distribution/interfaces/unityConfig'
import { api } from './api/api'
import './App.less'
import { config } from './config'
import logo from './assets/logo.png'
import { UnityWrapper } from './Unity'

const { Header } = Layout

export function AuthedRoot (): JSX.Element {
  const {
    user,
    loginWithRedirect,
    logout,
    isLoading,
    getAccessTokenSilently
  } = useAuth0()

  const [gameAssetUrls, updateGameAssetUrls] = useState<IUnityConfig | undefined>(undefined)

  async function updateGameAssets (): Promise<void> {
    try {
      const loaderUrl = await api.getGameAssetUrl('loader.js')
      const dataUrl = await api.getGameAssetUrl('data.gz')
      const frameworkUrl = await api.getGameAssetUrl('framework.js.gz')
      const codeUrl = await api.getGameAssetUrl('wasm.gz')
      updateGameAssetUrls({
        loaderUrl,
        dataUrl,
        frameworkUrl,
        codeUrl,
        streamingAssetsUrl: 'StreamingAssets',
        companyName: 'Euda',
        productName: 'Ville',
        productVersion: '1.0'
      })
    } catch (e) {
      notification.error({ message: 'Sorry, we could not load the game at this time', description: e.message })
    }
  }

  return (
    <div className='App'>
        <main>
          {gameAssetUrls !== undefined && token && (
            <div>
              <UnityWrapper gameAssetUrls={gameAssetUrls} token={token} />
            </div>
          )}
        </main>
  )
}
