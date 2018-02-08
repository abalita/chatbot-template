# chatbot-template
Boiler-plate for fb chatbot using node+express+vue

### Getting Started
Here are the step to clone, run and deploy this app template

```bash
# Clone repo
mkdir <project-name>
cd <project-name>
git clone https://github.com/abalita/chatbot-template.git .

# Install dependencies and run your app
npm run install-all
npm run dev

# Create & deploy to heroku
** remove the remote repository first
git remote -v
git remote rm origin

git init
heroku apps:create <app-name>

npm run deploy-heroku



```

### Setup env variables
```bash
MONGODB_URI
FB_TOKEN
FB_VERIFY_TOKEN

```

### Setup your FB page and App then connect webhook
