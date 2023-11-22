const express = require('express');
const fs = require('fs');
const app = express();

// Create the ./tmp/ directory if it doesn't exist
const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

app.post('/generateVAST', (req, res) => {
  const videoLink = req.query.videoLink;
  const name = req.query.name;

  if (!videoLink) {
    return res.status(400).send('Video link is required');
  }

  const xmlContent = `<VAST version="4.0">
    <Ad id="ad1">
      <InLine>
        <AdSystem>Sample Ad System</AdSystem>
        <AdTitle>Sample Ad Title</AdTitle>
        <Impression><![CDATA[https://impression.tracking.url]]></Impression>
        <Creatives>
          <Creative id="creative1">
            <Linear>
              <Duration>00:00:30</Duration>
              <MediaFiles>
                <MediaFile type="video/mp4" width="640" height="360" bitrate="500" delivery="progressive">
                  <![CDATA[https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4]]>
                </MediaFile>
              </MediaFiles>
            </Linear>
          </Creative>
        </Creatives>
      </InLine>
    </Ad>
  </VAST>`;

  const filePath = `./tmp/${name}.xml`;

  fs.writeFile(filePath, xmlContent, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Error saving file');
    }
    console.log('File saved successfully');
    return res.status(200).send('File saved successfully');
  });
});

app.get('/vast/:name.xml', (req, res) => {
  const { name } = req.params;
  const filePath = `./tmp/${name}.xml`;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(404).send('File not found');
    }
    res.setHeader('Content-Type', 'application/xml');
    res.send(data);
  });
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
