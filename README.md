## Server

### Preview
Live server running on [https://baljeetkode.com/](https://baljeetkode.com/)

### Firebase setup
1. Add firebase cred to the path ```constants/google-application-creds.json```
2. Add .env to root level with file content <br>```GOOGLE_APPLICATION_CREDENTIALS='./constants/google-application-creds.json'```


### Certificate setup
1. Custom CA can be added in path ```cert/myCA.pem``` for workflows
2. For HTTPS traffic add certs to the following paths <br>```baljeetkode.private.key```<br>```baljeetkode.certificate.crt```<br>```baljeetkode.ca.crt```

### Config setup
1. The following configs are modifiable
```
    FILE_SERVER: 'http://localhost:5002',
    SEARCH_ENGINE: "http://127.0.0.1:7700",
    WORKFLOW_ORCHESTRATOR: "https://127.0.0.1:1212",
    WORKFLOW_ORCHESTRATOR_SECRET: "--secret--",
    MEILISEARCH_SECRET_KEY: '--secret--',
    MONGO_URL: "--mongo-url-string--",
    JWT_SECRET_KEY: '--secret--',
    MAILER_ID: '--mail-id--',
    MAILER_PASSWORD: '--mail-password--',
    GOOGLE_TOKEN_URL: 'https://oauth2.googleapis.com/token',
    GOOGLE_CLIENT_ID_ANDROID: '--andoid-client--',
    GOOGLE_CLIENT_SECRET_ANDROID: '--andoid-client-secret--',
    PASSWORD_SALT: '--secret--',
    ES_URL: 'https://127.0.0.1:9200',
    ES_USERNAME: '--username--',
    ES_PASSWORD: '--password--',
    ES_CA: '--CA--',
    AWS_REGION: 'ap-south-1',
    AWS_ACCESS_KEY_ID: '--secret--',
    AWS_SECRET_ACCESS_KEY: '--secret--',
    RAZORPAY_KEY_ID: '--secret--',
    RAZORPAY_KEY_SECRET: '--secret--',
    RAZORPAY_WEBHOOK_SECRET: '--secret--'
```
2. Configs are in path ```contants/config.js```

### How to start
1. Clone the repo
2. ```npm ci```
3. ```npm start```

### Other affiliated repos
* [consumer-mobile](https://github.com/redscool/project-w-client)
* [provider-mobile](https://github.com/redscool/project-w-client-provider)
* [dashboard](https://github.com/redscool/project-w-dashboard)
* [client-web](https://github.com/redscool/project-w-client-web)

