import React, { useEffect, useState } from 'react'
import { SpotifyApiContext, User, UserTop } from 'react-spotify-api'
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBBtn
} from 'mdbreact'
import 'mdbreact/dist/css/mdb.css'
import Cookies from 'js-cookie'

import TrackCard from './TrackCard'
import defaultPfp from './examplePfp.jpg'
import './App.css'
import './index.css'

import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'

const dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const App = () => {
  const [spotifyAuthToken, setSpotifyAuthToken] = useState()

  useEffect(() => {
    setSpotifyAuthToken(Cookies.get('spotifyAuthToken'))
    console.log(Scopes.all)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get('spotifyAuthToken')])

  const logout = () => {
    Cookies.remove('spotifyAuthToken', {
      path: dev ? '' : 'react-spotify-auth'
    })
    window.location = dev ? '/' : '/react-spotify-auth'
  }

  return (
    <div className='app'>
      <MDBContainer>
        {/* If there is a cookie named 'spotifyAuthToken' */}
        {Cookies.get('spotifyAuthToken') ? (
          // Display the app
          <>
            <MDBRow>
              <h1>SpotLight</h1>
            </MDBRow>

            <SpotifyApiContext.Provider value={spotifyAuthToken}>
              <User>
                {(user) =>
                  user && user.data ? (
                    <>
                      <MDBCol
                        style={{ maxWidth: '22rem', padding: '0 0 1rem 1rem' }}
                      >
                        <MDBCard>
                          <MDBCardImage
                            className='img-fluid'
                            src={
                              user.data.images[0]
                                ? user.data.images[0].url
                                : defaultPfp
                            }
                            alt='Your Spotify Profile Picture'
                            waves
                          />
                          <MDBCardBody style={{ padding: '1rem' }}>
                            <MDBCardTitle>
                              Bienvenido a SpotLight, {user.data.display_name}
                            </MDBCardTitle>
                            <MDBCardText>
                              Te he dejado tus canciones m??s escuchadas, seguro que quieres escucharlas de nuevo.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </>
                  ) : (
                      <p>Cargando...</p>
                    )
                }
              </User>
              <div style={{ width: '100%' }}>
                <MDBRow className='masonry-with-columns'>
                  <UserTop type='tracks'>
                    {(tracks, loading, error) =>
                      tracks && tracks.data
                        ? tracks.data.items.map((track, ind) => {
                          return (
                            <>
                              <TrackCard track={track} />
                            </>
                          )
                        })
                        : null
                    }
                  </UserTop>
                </MDBRow>
              </div>
            </SpotifyApiContext.Provider>
            <MDBBtn onClick={logout}>Logout</MDBBtn>
          </>
        ) : (
            <div className='login-page'>
              <h1>Spotlight</h1>
              <h2>Inicia sesi??n para comenzar</h2>
              {/*  Display the login page */}

              <div className='spotifyBtn'>
                <SpotifyAuth
                  redirectUri={
                    dev
                      ? 'http://localhost:3000/callback'
                      : 'http://kevinjiang.ca/react-spotify-auth'
                  }
                  clientID='1a70ba777fec4ffd9633c0c418bdcf39'
                  scopes={[
                    Scopes.userReadPrivate,
                    Scopes.userReadEmail,
                    'user-top-read'
                  ]}
                />
              </div>
            </div>
          )}
      </MDBContainer>
    </div>
  )
}

export default App
