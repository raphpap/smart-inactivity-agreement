# Single usecase Facebook External Adapter for Chainlink

Gets the latest post date of a user through the graph api.

## Install

Install dependencies

```bash
npm install
```

Create the zip

```bash
zip -r cl-jsonrpc.zip .
```

Upload to AWS/GCP

## Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 8.10 for the runtime
  - Choose an existing role or create a new one
  - Click Create Function
- Under Function code, select "Upload a .zip file" from the Code entry type drop-down
- Click Upload and select the `cl-jsonrpc.zip` file
- Handler should remain index.handler
- Add the environment variable:
  - Key: `RPC_URL`
  - Value: `Replace_With_Something_Unique`
- Save
