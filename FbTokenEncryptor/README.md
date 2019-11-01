# Single usecase Facebook Access Token Encryptor

Send an access token and received it encrypted

## Install

Install dependencies

```bash
npm install
```

Create the zip

```bash
zip -r token-encryptor.zip .
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
- Click Upload and select the `cl-fbadapter.zip` file
- Handler should remain index.handler
- Add the environment variable:
  - Key: `AES_KEY`
  - Value: <<replace with the same secret key that is used to decrypt the user's `FB_ACCESS_TOKEN`>>
- Save

# ENV
Do not forget to add the env variable `AES_KEY` to your lambda, with the same value that is used to encrypt the Facebook access keys.
