import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import backButton from './components/backButton.js'
import { Link, Button, Card, CardContent, Container, Typography, Box, Paper, Stack } from '@mui/material';

const Workspace = (props) => {
  const [urls, setUrls] = useState([]);
  const [summary, setSummary] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [workspaceID, setWorkspaceID] = useState(Cookies.get('curent_workspace_id'));

  useEffect(() => {
    setWorkspaceID(Cookies.get('curent_workspace_id'))
  }, [])

  useEffect(() => {
    // Fetch the list of URLs from the API
    console.log(`http://127.0.0.1:5000/top-n-urls?username=arvind6902@gmail.com&cluster_id=${workspaceID}`)
    axios.get(`http://127.0.0.1:5000/top-n-urls?username=arvind6902@gmail.com&cluster_id=${workspaceID}`)
      .then(response => {
        console.log("WINNER: ", response)
        setUrls(response.data.urls);
      })
      .catch(error => {
        console.log("SOMETHING WENT WRONG")
        console.error(error);
      });

    // Fetch the paragraph from the API
    axios.get(`http://127.0.0.1:5000/summarize-cluster?cluster_id=${workspaceID}`)
      .then(response => {
        setSummary(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  function handleUserInput(event) {
    setUserInput(event.target.value);
  }

  function handleBotResponse(response) {
    setBotResponse(response);
  }

  const getUrlsComponent = useCallback(() => {
    if (urls) {
      const component_urls = []
      for (var i = 0; i < urls.length; i++) {
        const url = urls[i];
        const url_component = <Link href={url.url} color="inherit">{url.title}</Link>
        component_urls.push(url_component)
      }
      return component_urls
    } else {
      return "Loading URLs"
    }
  }, [urls])

  function getSummary() {
    if (summary) {
      return summary
    } else {
      return "Loading summary."
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className='Time' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{props.workspaceName}</div>
      <Box sx={{ width: '100%' }}>
        <Stack spacing={3} justifyContent='center', alignItems='center'>
          {getUrlsComponent()}
        </Stack>
      </Box>


      <Container maxWidth="md">
        <br /><br />
        <Card>
          <CardContent style={{ textAlign: 'center' }}>
            <Typography>
              <span style={{ fontSize: '48px', fontWeight: 200 }}>{props.workspaceName}</span>
              {backButton(props.setUpdate)}
            </Typography>
          </CardContent>
        </Card>
      </Container>

      <div>
        <h2>hihiihihi</h2>
        {/* <p>{getSummary()}</p> */}
      </div>
      <div>
        <h2>Chatbot</h2>
        <input type="text" value={userInput} onChange={handleUserInput} />
        <Button onClick={() => {
          // Make a call to the chatbot API with the user's input
          axios.post('http://127.0.0.1:5000/cluster_chat', { input: userInput })
            .then(response => {
              handleBotResponse(response.data);
            })
            .catch(error => {
              console.error(error);
            });
        }}>Send</Button>
        <p>{botResponse}</p>
      </div>
    </div>
  );
}

export default Workspace;